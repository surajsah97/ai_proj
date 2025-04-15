const PDFDocument = require('pdfkit');
const PptxGenJS = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

// Import the functions directly from aiServiceManager
const { generateText, generateImage } = require('../utils/aiServiceManager');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// File metadata tracking
const fileMetadata = new Map();

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    await fs.promises.mkdir(uploadsDir, { recursive: true });
  }
};

// Track file metadata
const trackFileMetadata = (fileId, metadata) => {
  fileMetadata.set(fileId, {
    ...metadata,
    createdAt: new Date().toISOString(),
    lastAccessed: new Date().toISOString()
  });
};

// Update file access time
const updateFileAccess = (fileId) => {
  const metadata = fileMetadata.get(fileId);
  if (metadata) {
    metadata.lastAccessed = new Date().toISOString();
    fileMetadata.set(fileId, metadata);
  }
};

const AD_FORMATS = {
  social_media: {
    platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
    dimensions: {
      facebook: { width: 1200, height: 628 },
      instagram: { width: 1080, height: 1080 },
      twitter: { width: 1200, height: 675 },
      linkedin: { width: 1200, height: 627 },
      tiktok: { width: 1080, height: 1920 }
    },
    contentTypes: ['image', 'video', 'carousel']
  },
  banner: {
    types: ['leaderboard', 'skyscraper', 'rectangle', 'sidebar'],
    dimensions: {
      leaderboard: { width: 728, height: 90 },
      skyscraper: { width: 160, height: 600 },
      rectangle: { width: 300, height: 250 },
      sidebar: { width: 300, height: 600 }
    }
  },
  poster: {
    types: ['digital', 'print'],
    dimensions: {
      digital: { width: 1920, height: 1080 },
      print: { width: 2480, height: 3508 }
    }
  },
  email: {
    types: ['newsletter', 'promotional', 'transactional'],
    dimensions: {
      width: 600,
      height: 'auto'
    }
  }
};

// Create error placeholder function
const createErrorPlaceholder = async (path, message) => {
  await sharp({
    create: {
      width: 500,
      height: 400,
      channels: 4,
      background: { r: 245, g: 245, b: 245 }
    }
  })
  .composite([{
    input: Buffer.from(`<svg width="500" height="400">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" font-family="Helvetica" font-size="16" fill="#666" text-anchor="middle">
        ${message}
      </text>
    </svg>`),
    top: 0,
    left: 0
  }])
  .png()
  .toFile(path);
};

// Generate PDF from ad content
const generatePDF = async (ad, imagePath) => {
  try {
    const pdfPath = path.join(__dirname, '..', 'uploads', `ad-${ad.id}.pdf`);
    const doc = new PDFDocument({ size: 'A4' });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 50, 50, { width: 500 });
    }
    
    doc.fontSize(20).text(ad.headline, 50, 300);
    doc.fontSize(14).text(ad.subheadline, 50, 330);
    doc.fontSize(16).text(ad.cta, 50, 360, { underline: true });
    
    doc.end();
    
    return new Promise((resolve) => {
      stream.on('finish', () => resolve(pdfPath));
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};

// Generate PowerPoint from ad content  
const generatePPT = async (ad, imagePath) => {
  try {
    const pptPath = path.join(__dirname, '..', 'uploads', `ad-${ad.id}.pptx`);
    const ppt = new PptxGenJS();
    
    const slide = ppt.addSlide();
    if (fs.existsSync(imagePath)) {
      slide.addImage({ path: imagePath, x: 1, y: 1, w: 8, h: 4.5 });
    }
    slide.addText(ad.headline, { x: 1, y: 5.5, fontSize: 24 });
    slide.addText(ad.subheadline, { x: 1, y: 6, fontSize: 18 });
    slide.addText(ad.cta, { x: 1, y: 6.5, fontSize: 20, bold: true });
    
    await ppt.writeFile(pptPath);
    return pptPath;
  } catch (error) {
    console.error('Error generating PPT:', error);
    return null;
  }
};

// Generate social media variations
const generateSocialMediaVariations = async (ad, imagePath) => {
  try {
    const variations = [];
    const platforms = AD_FORMATS.social_media.platforms;
    
    for (const platform of platforms) {
      const dims = AD_FORMATS.social_media.dimensions[platform];
      const variantPath = path.join(__dirname, '..', 'uploads', `ad-${ad.id}-${platform}.png`);
      
      await sharp(imagePath)
        .resize(dims.width, dims.height)
        .toFile(variantPath);
        
      variations.push({
        platform,
        url: `/api/downloads/${path.basename(variantPath)}`,
        dimensions: `${dims.width}x${dims.height}`
      });
    }
    
    return variations;
  } catch (error) {
    console.error('Error generating social media variations:', error);
    return [];
  }
};

// Helper function to generate ad text
const generateAdText = async (brandGuidelines, format) => {
  try {
    const prompt = `Create a ${format} advertisement with these brand guidelines:
      - Colors: ${brandGuidelines.colors.join(', ')}
      - Tone: ${brandGuidelines.tone}
      - Target Audience: ${brandGuidelines.targetAudience}
      - Style: ${brandGuidelines.style}
      - Product: ${brandGuidelines.productDescription}
      - Key Features: ${brandGuidelines.keyFeatures}
      - Call to Action: ${brandGuidelines.callToAction || 'Learn More'}
      
      The ad should include:
      1. A catchy headline
      2. A compelling description
      3. A strong call to action
      
      Format the response as:
      HEADLINE: [your headline]
      DESCRIPTION: [your description]
      CTA: [your call to action]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 200
    });

    const text = response.choices[0].message.content;
    
    const lines = text.split('\n');
    return {
      headline: lines.find(l => l.startsWith('HEADLINE:'))?.replace('HEADLINE:', '').trim(),
      subheadline: lines.find(l => l.startsWith('DESCRIPTION:'))?.replace('DESCRIPTION:', '').trim(),
      cta: lines.find(l => l.startsWith('CTA:'))?.replace('CTA:', '').trim()
    };
  } catch (error) {
    console.error('Error generating ad text:', error);
    return {
      headline: `Amazing ${brandGuidelines.productDescription}`,
      subheadline: `Experience the best ${brandGuidelines.productDescription} with ${brandGuidelines.keyFeatures.join(', ')}`,
      cta: brandGuidelines.callToAction || 'Learn More'
    };
  }
};

// Helper functions for generating specific text elements
const generateHeadline = async (brandGuidelines, format) => {
  const text = await generateAdText(brandGuidelines, format);
  return text.headline;
};

const generateSubheadline = async (brandGuidelines, format) => {
  const text = await generateAdText(brandGuidelines, format);
  return text.subheadline;
};

const generateCTA = async (brandGuidelines) => {
  const text = await generateAdText(brandGuidelines, 'general');
  return text.cta;
};

/**
 * Generates an advertisement based on brand guidelines and format
 */
const generateAd = async (req, res) => {
  try {
    await ensureUploadsDir();
    const { brandGuidelines, format, platform, regenerate, regenerateElement } = req.body;
    
    if (!brandGuidelines || !format) {
      throw new Error('Missing required parameters: brandGuidelines and format');
    }

    if (!AD_FORMATS[format]) {
      throw new Error(`Invalid format: ${format}. Valid formats are: ${Object.keys(AD_FORMATS).join(', ')}`);
    }
    
    if (platform && !AD_FORMATS[format].platforms?.includes(platform)) {
      throw new Error(`Invalid platform for ${format}: ${platform}`);
    }

    const dimensions = platform 
      ? AD_FORMATS[format].dimensions[platform]
      : AD_FORMATS[format].dimensions;

    let headline, subheadline, cta;
    
    if (regenerate && regenerateElement) {
      headline = regenerateElement === 'headline' ? await generateHeadline(brandGuidelines, format) : req.body.headline;
      subheadline = regenerateElement === 'subheadline' ? await generateSubheadline(brandGuidelines, format) : req.body.subheadline;
      cta = regenerateElement === 'cta' ? await generateCTA(brandGuidelines) : req.body.cta;
    } else {
      const adText = await generateAdText(brandGuidelines, format);
      headline = adText.headline;
      subheadline = adText.subheadline;
      cta = adText.cta || brandGuidelines.callToAction || 'Learn More';
    }

    let imageUrl;
    
    if (regenerate && regenerateElement !== 'image') {
      imageUrl = req.body.imageUrl;
    } else {
      const imagePrompt = `Create a ${format} advertisement ${platform ? `for ${platform}` : ''} with:
        - Colors: ${brandGuidelines.colors.join(', ')}
        - Tone: ${brandGuidelines.tone}
        - Target Audience: ${brandGuidelines.targetAudience}
        - Style: ${brandGuidelines.style}
        - Product: ${brandGuidelines.productDescription}
        - Key Features: ${brandGuidelines.keyFeatures}
        - Headline: ${headline}`;

      imageUrl = await generateImage(imagePrompt, {
        service: req.app.locals.selectedAIService || 'auto',
        width: dimensions.width || 1024,
        height: dimensions.height || 1024
      });
    }

    const ad = {
      id: regenerate ? req.body.id : Date.now().toString(),
      format,
      platform: platform || 'general',
      headline,
      subheadline,
      cta,
      text: `${headline}\n\n${subheadline}\n\n${cta}`,
      imageUrl,
      style: {
        colors: brandGuidelines.colors,
        tone: brandGuidelines.tone,
        dimensions: `${dimensions.width}x${dimensions.height}`
      },
      createdAt: regenerate ? req.body.createdAt : new Date().toISOString()
    };

    const generateDownloadableFiles = async (ad) => {
      try {
        const downloads = {};
        const imagePath = path.join(__dirname, '..', 'uploads', path.basename(ad.imageUrl));

        if (ad.openAiFiles) {
          if (ad.openAiFiles.pdf) downloads.pdf = ad.openAiFiles.pdf;
          if (ad.openAiFiles.ppt) downloads.ppt = ad.openAiFiles.ppt;
          if (ad.openAiFiles.variations) downloads.variations = ad.openAiFiles.variations;
        }

        if (!downloads.pdf) {
          const pdfPath = await generatePDF(ad, imagePath);
          if (pdfPath) downloads.pdf = `/api/downloads/${path.basename(pdfPath)}`;
        }

        if ((ad.format === 'poster' || ad.format === 'banner') && !downloads.ppt) {
          const pptPath = await generatePPT(ad, imagePath);
          if (pptPath) downloads.ppt = `/api/downloads/${path.basename(pptPath)}`;
        }

        if (ad.format === 'social_media' && !downloads.variations) {
          const variations = await generateSocialMediaVariations(ad, imagePath);
          downloads.variations = variations;
        }

        return downloads;
      } catch (error) {
        console.error('Error generating downloadable files:', error);
        return {};
      }
    };

    const downloadUrls = await generateDownloadableFiles(ad);
    ad.downloadUrls = downloadUrls;
console.log({ad})
    res.json({
      message: 'Ad generated successfully',
      data: [ad]
    });
  } catch (error) {
    console.error('Error generating ad:', error);
    const errorResponse = {
      success: false,
      message: 'Error generating advertisement',
      error: error.message,
      code: error.code || 'AD_GENERATION_ERROR'
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
      errorResponse.details = {
        requestBody: req.body,
        params: req.params
      };
    }

    return res.status(500).json(errorResponse);
  }
};

const createDownloadablePNG = async (ad) => {
  try {
    if (!ad?.imageUrl) {
      throw new Error('Missing required imageUrl in ad object');
    }

    await ensureUploadsDir();
    
    let imageUrl;
    if (typeof ad.imageUrl !== 'string') {
      throw new Error('imageUrl must be a string');
    }
    
    imageUrl = ad.imageUrl.startsWith('http') 
      ? ad.imageUrl 
      : `http://localhost:${process.env.PORT || 3001}${ad.imageUrl.startsWith('/') ? '' : '/'}${ad.imageUrl}`;
    
    let imageBuffer;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      imageBuffer = await response.buffer();
      if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Empty image buffer received');
      }
    } catch (error) {
      console.error('Image download failed:', error);
      const pngPath = path.join(__dirname, '..', 'uploads', `ad-${ad.id}.png`);
      await createErrorPlaceholder(pngPath, 'Image download failed');
      return pngPath;
    }

    const filename = `ad-${ad.id.replace(/[^a-zA-Z0-9-_]/g, '')}.png`;
    const pngPath = path.join(__dirname, '..', 'uploads', filename);
    
    if (pngPath.indexOf(path.join(__dirname, '..', 'uploads')) !== 0) {
      throw new Error('Invalid file path');
    }

    const isPng = imageBuffer.toString('hex', 0, 8) === '89504e470d0a1a0a';
    const isJpg = imageBuffer.toString('hex', 0, 4) === 'ffd8ffe0' || 
                 imageBuffer.toString('hex', 0, 4) === 'ffd8ffe1';
    const isSvg = imageBuffer.toString('utf8', 0, 100).includes('<svg');

    if (isPng || isJpg || isSvg) {
      try {
        await sharp(imageBuffer, { failOnError: false })
          .toFormat('png')
          .toFile(pngPath);
      } catch (error) {
        await createErrorPlaceholder(pngPath, 'Image processing error');
      }
    } else {
      await createErrorPlaceholder(pngPath, 'Unsupported image format');
    }

    return pngPath;
  } catch (error) {
    console.error('Error creating downloadable PNG:', error);
    return null;
  }
};

module.exports = {
  generateAd,
  createDownloadablePNG
};
