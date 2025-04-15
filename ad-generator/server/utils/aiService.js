// Sample image URLs from Pexels (free to use)
const sampleImages = [
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
    'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg',
    'https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg',
    'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg'
];

// Color palettes for different styles
// const colorPalettes = {
//     professional: [
//         ['#2563eb', '#ffffff', '#1e40af'],
//         ['#0f766e', '#f0fdfa', '#134e4a'],
//         ['#4338ca', '#eef2ff', '#312e81'],
//         ['#0369a1', '#ecfeff', '#0c4a6e']
//     ],
//     casual: [
//         ['#f59e0b', '#fffbeb', '#b45309'],
//         ['#10b981', '#ecfdf5', '#065f46'],
//         ['#6366f1', '#eef2ff', '#4338ca'],
//         ['#ec4899', '#fdf2f8', '#9d174d']
//     ],
//     playful: [
//         ['#f43f5e', '#fff1f2', '#e11d48'],
//         ['#8b5cf6', '#f5f3ff', '#6d28d9'],
//         ['#06b6d4', '#ecfeff', '#0e7490'],
//         ['#facc15', '#fefce8', '#ca8a04']
//     ],
//     luxury: [
//         ['#000000', '#f9fafb', '#4b5563'],
//         ['#7e22ce', '#f5f3ff', '#581c87'],
//         ['#b91c1c', '#fef2f2', '#7f1d1d'],
//         ['#1e3a8a', '#eff6ff', '#1e3a8a']
//     ],
//     technical: [
//         ['#374151', '#f9fafb', '#111827'],
//         ['#0f766e', '#f0fdfa', '#134e4a'],
//         ['#0c4a6e', '#ecfeff', '#0369a1'],
//         ['#1e3a8a', '#eff6ff', '#1e3a8a']
//     ]
// };

// const toneTemplates = {
//     professional: {
//         headlines: [
//             "Transform Your Business Today",
//             "Elevate Your Professional Success",
//             "Innovation Meets Excellence",
//             "Strategic Solutions for Growth",
//             "Unlock Your Business Potential"
//         ],
//         subheadlines: [
//             "Expert solutions tailored to your needs",
//             "Achieve more with industry-leading technology",
//             "Streamline your operations with proven methods",
//             "Trusted by industry leaders worldwide",
//             "Delivering measurable results since 2010"
//         ],
//         ctas: [
//             "Learn More",
//             "Get Started",
//             "Schedule a Consultation",
//             "Request a Demo",
//             "Join Our Network"
//         ]
//     },
//     casual: {
//         headlines: [
//             "Ready for Something Amazing?",
//             "Let's Make Magic Happen",
//             "Your Journey Starts Here",
//             "The Smarter Way to Connect",
//             "Discover What You've Been Missing"
//         ],
//         subheadlines: [
//             "Join thousands of happy customers",
//             "Discover what's possible with us",
//             "Simple solutions for everyday needs",
//             "Making life easier, one step at a time",
//             "Because you deserve better options"
//         ],
//         ctas: [
//             "Join Now",
//             "Try It Out",
//             "Get Started",
//             "See How It Works",
//             "Count Me In"
//         ]
//     },
//     playful: {
//         headlines: [
//             "Get Ready for Awesome! 🚀",
//             "Time to Have Some Fun! ✨",
//             "Let's Create Something Cool! 🎨",
//             "Woohoo! You Found Us! 🎉",
//             "The Fun Starts Here! 🌈"
//         ],
//         subheadlines: [
//             "Because boring is so yesterday",
//             "Join the fun and see what happens",
//             "Adventure awaits around every corner",
//             "Life's too short for ordinary experiences",
//             "Bringing smiles to faces since 2015"
//         ],
//         ctas: [
//             "Let's Go!",
//             "Jump In!",
//             "Start the Fun!",
//             "I'm Ready!",
//             "Show Me More!"
//         ]
//     },
//     luxury: {
//         headlines: [
//             "Experience Unparalleled Excellence",
//             "Discover True Luxury",
//             "Elevate Your Lifestyle",
//             "Crafted for Connoisseurs",
//             "The Epitome of Sophistication"
//         ],
//         subheadlines: [
//             "Crafted for those who demand the finest",
//             "Where luxury meets exceptional quality",
//             "Exclusive offerings for discerning individuals",
//             "Redefining standards of excellence",
//             "Indulge in the extraordinary"
//         ],
//         ctas: [
//             "Explore Collection",
//             "Reserve Now",
//             "Discover More",
//             "Experience Luxury",
//             "Request Private Viewing"
//         ]
//     },
//     technical: {
//         headlines: [
//             "Optimize Your Performance",
//             "Advanced Solutions for Complex Needs",
//             "Engineering the Future",
//             "Data-Driven Innovation",
//             "Precision Technology at Work"
//         ],
//         subheadlines: [
//             "Leveraging cutting-edge technology",
//             "Data-driven solutions for measurable results",
//             "Precision-engineered for optimal performance",
//             "Scalable architecture for enterprise needs",
//             "Backed by rigorous testing and validation"
//         ],
//         ctas: [
//             "View Specifications",
//             "Start Implementation",
//             "Learn More",
//             "Technical Details",
//             "Request API Access"
//         ]
//     }
// };

// const formatTemplates = {
//     social_media: {
//         dimensions: "1200x628",
//         style: "Bold, eye-catching visuals with concise text"
//     },
//     banner: {
//         dimensions: "728x90",
//         style: "Horizontal layout with clear CTA"
//     },
//     email: {
//         dimensions: "600x200",
//         style: "Clean, professional design with detailed content"
//     },
//     display: {
//         dimensions: "300x250",
//         style: "Compact design with strong visual hierarchy"
//     },
//     story: {
//         dimensions: "1080x1920",
//         style: "Vertical format with immersive visuals"
//     }
// };

// Add OpenAI integration
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');

// Sample image URLs as fallback only
// const sampleImages = [
//     'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
//     'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
//     'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
//     'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
//     'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
// ];

// Add roundRect polyfill for canvas
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

// Ensure uploads directory exists
const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// OpenAI API configuration
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
    }
});

// Function to generate image using OpenAI DALL-E
async function generateImageWithAI(prompt) {
    try {
        console.log('Generating image with prompt:', prompt);
        const response = await openaiClient.post('/images/generations', {
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        });
        
        console.log('Image generated successfully');
        return response.data.data[0].url;
    } catch (error) {
        console.error('Error generating image with AI:', error.response?.data || error.message);
        // Fallback to sample images if AI generation fails
        return sampleImages[Math.floor(Math.random() * sampleImages.length)];
    }
}

// Function to generate text using OpenAI GPT
async function generateTextWithAI(prompt, maxTokens = 100) {
    try {
        console.log('Generating text with prompt:', prompt);
        const response = await openaiClient.post('/chat/completions', {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert advertising copywriter." },
                { role: "user", content: prompt }
            ],
            max_tokens: maxTokens,
            temperature: 0.7
        });
        
        console.log('Text generated successfully');
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating text with AI:', error.response?.data || error.message);
        return null;
    }
}

// Function to download and save AI-generated image
async function downloadAndSaveImage(imageUrl) {
    try {
        console.log('Downloading image from:', imageUrl);
        ensureUploadsDir();
        
        // Download the image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        
        // Save the image
        const fileName = `img_${uuidv4()}.png`;
        const filePath = path.join(__dirname, '../../uploads', fileName);
        fs.writeFileSync(filePath, imageBuffer);
        
        console.log('Image saved to:', filePath);
        return `/uploads/${fileName}`;
    } catch (error) {
        console.error('Error downloading and saving image:', error);
        throw new Error('Failed to download and save image');
    }
}

// Function to create downloadable PNG ad
async function createDownloadablePNG(ad) {
    try {
        console.log('Creating downloadable PNG for ad:', ad.id);
        ensureUploadsDir();
        
        const { headline, subheadline, cta, imageUrl, style } = ad;
        const { colors, dimensions } = style;
        
        // Parse dimensions
        const [width, height] = dimensions.split('x').map(Number);
        
        // Create canvas with the right dimensions
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        
        // Set background color
        ctx.fillStyle = colors[0] || '#2563eb';
        ctx.fillRect(0, 0, width, height);
        
        // Load and draw the image
        if (imageUrl) {
            try {
                const image = await loadImage(imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`);
                const aspectRatio = image.width / image.height;
                
                // Calculate image dimensions to maintain aspect ratio
                let imgWidth, imgHeight;
                if (width / height > aspectRatio) {
                    imgWidth = width;
                    imgHeight = width / aspectRatio;
                } else {
                    imgHeight = height;
                    imgWidth = height * aspectRatio;
                }
                
                // Center the image
                const x = (width - imgWidth) / 2;
                const y = (height - imgHeight) / 2;
                
                ctx.drawImage(image, x, y, imgWidth, imgHeight);
                
                // Add semi-transparent overlay for text readability
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(0, height * 0.6, width, height * 0.4);
            } catch (imgError) {
                console.error('Error loading image:', imgError);
                // Continue without the image
            }
        }
        
        // Add text
        ctx.fillStyle = colors[1] || '#ffffff';
        ctx.font = `bold ${height * 0.06}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(headline, width / 2, height * 0.75, width * 0.9);
        
        ctx.font = `${height * 0.04}px Arial`;
        ctx.fillText(subheadline, width / 2, height * 0.85, width * 0.9);
        
        // Add CTA button
        const btnWidth = width * 0.4;
        const btnHeight = height * 0.08;
        const btnX = (width - btnWidth) / 2;
        const btnY = height * 0.9;
        
        ctx.fillStyle = colors[2] || '#ffffff';
        ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 10);
        ctx.fill();
        
        ctx.fillStyle = colors[0] || '#2563eb';
        ctx.font = `bold ${height * 0.04}px Arial`;
        ctx.fillText(cta, width / 2, btnY + btnHeight * 0.65);
        
        // Save the canvas to a file
        const fileName = `ad_${uuidv4()}.png`;
        const filePath = path.join(__dirname, '../../uploads', fileName);
        const out = fs.createWriteStream(filePath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        
        return new Promise((resolve, reject) => {
            out.on('finish', () => {
                console.log('PNG created successfully:', filePath);
                resolve(`/uploads/${fileName}`);
            });
            out.on('error', (err) => {
                console.error('Error creating PNG:', err);
                reject(err);
            });
        });
    } catch (error) {
        console.error('Error creating downloadable PNG:', error);
        throw new Error('Failed to create downloadable ad image');
    }
}

// Function to create downloadable PDF ad
async function createDownloadablePDF(ad) {
    try {
        console.log('Creating downloadable PDF for ad:', ad.id);
        ensureUploadsDir();
        
        const { headline, subheadline, cta, imageUrl, style } = ad;
        const { colors, dimensions } = style;
        
        // Parse dimensions
        const [width, height] = dimensions.split('x').map(Number);
        
        // Create PDF with the right dimensions
        const doc = new PDFDocument({
            size: [width, height],
            margin: 0
        });
        
        const fileName = `ad_${uuidv4()}.pdf`;
        const filePath = path.join(__dirname, '../../uploads', fileName);
        const writeStream = fs.createWriteStream(filePath);
        
        doc.pipe(writeStream);
        
        // Add background color
        doc.rect(0, 0, width, height).fill(colors[0] || '#2563eb');
        
        // Add image if available
        if (imageUrl) {
            try {
                // Download the image first if it's a URL
                const imgUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
                const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                const imageBuffer = Buffer.from(response.data);
                
                // Add the image to the PDF
                doc.image(imageBuffer, 0, 0, {
                    width: width,
                    height: height * 0.7,
                    align: 'center',
                    valign: 'center'
                });
                
                // Add semi-transparent overlay for text readability
                doc.rect(0, height * 0.5, width, height * 0.5)
                   .fill('rgba(0, 0, 0, 0.5)');
            } catch (imgError) {
                console.error('Error adding image to PDF:', imgError);
                // Continue without the image
            }
        }
        
        // Add headline
        doc.font('Helvetica-Bold')
           .fontSize(height * 0.05)
           .fill(colors[1] || '#ffffff')
           .text(headline, 20, height * 0.6, {
               width: width - 40,
               align: 'center'
           });
        
        // Add subheadline
        doc.font('Helvetica')
           .fontSize(height * 0.03)
           .fill(colors[1] || '#ffffff')
           .text(subheadline, 20, height * 0.75, {
               width: width - 40,
               align: 'center'
           });
        
        // Add CTA button
        const btnWidth = width * 0.4;
        const btnHeight = height * 0.08;
        const btnX = (width - btnWidth) / 2;
        const btnY = height * 0.85;
        
        doc.roundedRect(btnX, btnY, btnWidth, btnHeight, 10)
           .fill(colors[2] || '#ffffff');
        
        doc.font('Helvetica-Bold')
           .fontSize(height * 0.03)
           .fill(colors[0] || '#2563eb')
           .text(cta, btnX, btnY + btnHeight / 4, {
               width: btnWidth,
               align: 'center'
           });
        
        // Finalize the PDF
        doc.end();
        
        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log('PDF created successfully:', filePath);
                resolve(`/uploads/${fileName}`);
            });
            writeStream.on('error', (err) => {
                console.error('Error creating PDF:', err);
                reject(err);
            });
        });
    } catch (error) {
        console.error('Error creating downloadable PDF:', error);
        throw new Error('Failed to create downloadable ad PDF');
    }
}

// Color palettes and tone templates
const colorPalettes = {
    professional: [
        ['#2563eb', '#ffffff', '#1e40af'],
        ['#0f766e', '#f0fdfa', '#134e4a'],
        ['#4338ca', '#eef2ff', '#312e81'],
        ['#0369a1', '#ecfeff', '#0c4a6e']
    ],
    casual: [
        ['#f59e0b', '#fffbeb', '#b45309'],
        ['#10b981', '#ecfdf5', '#065f46'],
        ['#6366f1', '#eef2ff', '#4338ca'],
        ['#ec4899', '#fdf2f8', '#9d174d']
    ],
    playful: [
        ['#f43f5e', '#fff1f2', '#e11d48'],
        ['#8b5cf6', '#f5f3ff', '#6d28d9'],
        ['#06b6d4', '#ecfeff', '#0e7490'],
        ['#facc15', '#fefce8', '#ca8a04']
    ],
    luxury: [
        ['#000000', '#f9fafb', '#4b5563'],
        ['#7e22ce', '#f5f3ff', '#581c87'],
        ['#b91c1c', '#fef2f2', '#7f1d1d'],
        ['#1e3a8a', '#eff6ff', '#1e3a8a']
    ],
    technical: [
        ['#374151', '#f9fafb', '#111827'],
        ['#0f766e', '#f0fdfa', '#134e4a'],
        ['#0c4a6e', '#ecfeff', '#0369a1'],
        ['#1e3a8a', '#eff6ff', '#1e3a8a']
    ]
};

const formatTemplates = {
    social_media: {
        dimensions: "1200x628",
        style: "Bold, eye-catching visuals with concise text"
    },
    banner: {
        dimensions: "728x90",
        style: "Horizontal layout with clear CTA"
    },
    email: {
        dimensions: "600x200",
        style: "Clean, professional design with detailed content"
    },
    display: {
        dimensions: "300x250",
        style: "Compact design with strong visual hierarchy"
    },
    story: {
        dimensions: "1080x1920",
        style: "Vertical format with immersive visuals"
    }
};

// Main function to generate ads
const generateAd = async (adData) => {
    try {
        console.log('Generating ad with data:', JSON.stringify(adData, null, 2));
        const { 
            referenceAd, 
            brandGuidelines, 
            format, 
            regenerate = false,
            regenerateElement = null 
        } = adData;
        
        // Default values if brandGuidelines is missing
        const tone = brandGuidelines?.tone || 'professional';
        const brand = brandGuidelines?.brandName || 'Your Brand';
        const industry = brandGuidelines?.industry || 'general';
        const targetAudience = brandGuidelines?.targetAudience || 'general consumers';
        
        // If regenerating a specific element of an existing ad
        if (regenerate && referenceAd) {
            try {
                console.log('Regenerating ad element:', regenerateElement);
                const updatedAd = { ...referenceAd };
                
                if (regenerateElement === 'headline' || !regenerateElement) {
                    // Generate headline with AI
                    const headlinePrompt = `Create a compelling headline for a ${tone} advertisement for a ${industry} company named "${brand}" targeting ${targetAudience}. Keep it under 60 characters.`;
                    const aiHeadline = await generateTextWithAI(headlinePrompt);
                    updatedAd.headline = aiHeadline || "Innovative Solutions for Modern Needs";
                }
                
                if (regenerateElement === 'subheadline' || !regenerateElement) {
                    // Generate subheadline with AI
                    const subheadlinePrompt = `Write a brief, engaging subheadline for a ${tone} advertisement for "${brand}" that complements this headline: "${updatedAd.headline}". Target audience: ${targetAudience}. Keep it under 100 characters.`;
                    const aiSubheadline = await generateTextWithAI(subheadlinePrompt);
                    updatedAd.subheadline = aiSubheadline || "Discover how our solutions can transform your experience";
                }
                
                if (regenerateElement === 'cta' || !regenerateElement) {
                    // Generate CTA with AI
                    const ctaPrompt = `Create a short, action-oriented call-to-action button text for a ${tone} advertisement for "${brand}". Target audience: ${targetAudience}. Keep it under 20 characters.`;
                    const aiCta = await generateTextWithAI(ctaPrompt, 20);
                    updatedAd.cta = aiCta || "Learn More";
                }
                
                if (regenerateElement === 'image' || !regenerateElement) {
                    // Generate image with AI
                    const imagePrompt = `Create a professional advertisement image for ${brand}, a ${industry} company. The ad should have a ${tone} tone and match the headline: "${updatedAd.headline}". Target audience: ${targetAudience}. The image should be visually appealing with good composition and relevant to the product/service.`;
                    const aiImageUrl = await generateImageWithAI(imagePrompt);
                    
                    // Download and save the image locally
                    const localImageUrl = await downloadAndSaveImage(aiImageUrl);
                    updatedAd.imageUrl = localImageUrl;
                }
                
                if (regenerateElement === 'colors' || !regenerateElement) {
                    // Generate colors with AI or use predefined palettes
                    updatedAd.style.colors = colorPalettes[tone][Math.floor(Math.random() * colorPalettes[tone].length)];
                }
                
                // Update timestamp
                updatedAd.metadata = updatedAd.metadata || {};
                updatedAd.metadata.generatedAt = new Date().toISOString();
                
                // Generate downloadable versions
                updatedAd.downloadUrl = await createDownloadablePNG(updatedAd);
                updatedAd.pdfUrl = await createDownloadablePDF(updatedAd);
                
                console.log('Ad regenerated successfully');
                return [updatedAd];
            } catch (regenerateError) {
                console.error('Error regenerating ad:', regenerateError);
                throw new Error(`Failed to regenerate ad: ${regenerateError.message}`);
            }
        }

        // Generate multiple variations for new ads
        const variations = await Promise.all(Array.from({ length: 3 }, async (_, index) => {
            try {
                console.log(`Generating variation ${index + 1}`);
                // Generate headline with AI
                const headlinePrompt = `Create a compelling headline for a ${tone} advertisement for a ${industry} company named "${brand}" targeting ${targetAudience}. Keep it under 60 characters.`;
                const headline = await generateTextWithAI(headlinePrompt) || "Innovative Solutions for Modern Needs";
                
                // Generate subheadline with AI
                const subheadlinePrompt = `Write a brief, engaging subheadline for a ${tone} advertisement for "${brand}" that complements this headline: "${headline}". Target audience: ${targetAudience}. Keep it under 100 characters.`;
                const subheadline = await generateTextWithAI(subheadlinePrompt) || "Discover how our solutions can transform your experience";
                
                // Generate CTA with AI
                const ctaPrompt = `Create a short, action-oriented call-to-action button text for a ${tone} advertisement for "${brand}". Target audience: ${targetAudience}. Keep it under 20 characters.`;
                const cta = await generateTextWithAI(ctaPrompt, 20) || "Learn More";
                
                // Generate image with AI
                const imagePrompt = `Create a professional advertisement image for ${brand}, a ${industry} company. The ad should have a ${tone} tone and match the headline: "${headline}". Target audience: ${targetAudience}. The image should be visually appealing with good composition and relevant to the product/service.`;
                const aiImageUrl = await generateImageWithAI(imagePrompt);
                
                // Download and save the image locally
                const localImageUrl = await downloadAndSaveImage(aiImageUrl);
                
                // Get dimensions based on format
                let dimensions;
                switch(format) {
                    case 'social_media': dimensions = "1200x628"; break;
                    case 'banner': dimensions = "728x90"; break;
                    case 'email': dimensions = "600x200"; break;
                    case 'display': dimensions = "300x250"; break;
                    case 'story': dimensions = "1080x1920"; break;
                    default: dimensions = "1200x628";
                }
                
                const ad = {
                    id: `ad_${Date.now()}_${index}`,
                    headline,
                    subheadline,
                    cta,
                    imageUrl: localImageUrl,
                    format: format || 'social_media',
                    style: {
                        colors: colorPalettes[tone][Math.floor(Math.random() * colorPalettes[tone].length)],
                        tone,
                        dimensions
                    },
                    metadata: {
                        targetAudience,
                        brandStyle: brandGuidelines?.style,
                        generatedAt: new Date().toISOString()
                    }
                };
                
                // Generate downloadable versions
                ad.downloadUrl = await createDownloadablePNG(ad);
                ad.pdfUrl = await createDownloadablePDF(ad);
                
                console.log(`Variation ${index + 1} generated successfully`);
                return ad;
            } catch (variationError) {
                console.error(`Error generating variation ${index}:`, variationError);
                // Return a basic ad if there's an error
                return {
                    id: `ad_${Date.now()}_${index}`,
                    headline: "Innovative Solutions for Modern Needs",
                    subheadline: "Discover how our solutions can transform your experience",
                    cta: "Learn More",
                    imageUrl: sampleImages[0],
                    format: format || 'social_media',
                    style: {
                        colors: ['#2563eb', '#ffffff', '#1e40af'],
                        tone,
                        dimensions: "1200x628"
                    },
                    metadata: {
                        generatedAt: new Date().toISOString(),
                        error: variationError.message
                    }
                };
            }
        }));

        console.log('All variations generated successfully');
        return variations;

    } catch (error) {
        console.error('Error in AI service:', error);
        throw new Error('Failed to generate advertisement');
    }
};

module.exports = {
    generateAd
};
