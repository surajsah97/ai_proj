const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Replicate = require('replicate');
const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Initialize AI services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const googleModel = googleAI.getGenerativeModel({ model: "gemini-pro" });
const googleVisionModel = googleAI.getGenerativeModel({ model: "gemini-pro-vision" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Array of Groq models to try in sequence
const GROQ_MODELS = [
  "llama3-8b-8192",
  "llama3-70b-8192",
  "gemma-7b-it"
];

// Function to try multiple Groq models in sequence
const tryGroqModels = async (messages, temperature = 0.7, max_tokens = 1000) => {
  let lastError = null;
  
  for (const model of GROQ_MODELS) {
    try {
      console.log(`Trying Groq model: ${model}`);
      const response = await groq.chat.completions.create({
        messages,
        model,
        temperature,
        max_tokens
      });
      console.log(`Successfully used model: ${model}`);
      return response;
    } catch (error) {
      console.error(`Error with model ${model}:`, error.message);
      lastError = error;
      // Continue to the next model
    }
  }
  
  // If we get here, all models failed
  throw lastError || new Error('All Groq models failed');
};

// Text generation with fallback between services
async function generateText(prompt, options = {}) {
  const { service = 'auto', maxTokens = 1000, temperature = 0.7 } = options;
  
  // Try services in order based on preference or availability
  const services = service === 'auto' 
    ? ['openai', 'groq', 'google', 'replicate'] 
    : [service];
  
  let lastError = null;
  
  for (const svc of services) {
    try {
      console.log(`Attempting to generate text with ${svc} service`);
      
      let result;
      
      switch (svc) {
        case 'openai':
          result = await generateTextWithOpenAI(prompt, maxTokens, temperature);
          break;
        case 'groq':
          result = await generateTextWithGroq(prompt, maxTokens, temperature);
          break;
        case 'google':
          result = await generateTextWithGoogle(prompt, maxTokens, temperature);
          break;
        case 'replicate':
          result = await generateTextWithReplicate(prompt, maxTokens, temperature);
          break;
        default:
          throw new Error(`Unknown service: ${svc}`);
      }
      
      if (result) {
        console.log(`Successfully generated text with ${svc} service`);
        return result;
      }
    } catch (error) {
      console.error(`Error generating text with ${svc} service:`, error);
      lastError = error;
    }
  }
  
  // If all services failed
  throw lastError || new Error('All text generation services failed');
}

// Implementation of individual text generation functions

// Generate text with OpenAI
async function generateTextWithOpenAI(prompt, maxTokens, temperature) {
  try {
    console.log('Generating text with OpenAI');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional advertising copywriter. Create compelling ad copy based on the provided information." },
        { role: "user", content: prompt }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    });
    
    if (response.choices && response.choices[0] && response.choices[0].message) {
      return response.choices[0].message.content.trim();
    }
    
    throw new Error('Invalid response from OpenAI');
  } catch (error) {
    console.error('OpenAI text generation error:', error);
    throw error;
  }
}

// Generate text with Groq
async function generateTextWithGroq(prompt, maxTokens, temperature) {
  try {
    console.log('Generating text with Groq');
    
    const messages = [
      { role: "system", content: "You are a professional advertising copywriter. Create compelling ad copy based on the provided information." },
      { role: "user", content: prompt }
    ];
    
    const response = await tryGroqModels(messages, temperature, maxTokens);
    
    if (response.choices && response.choices[0] && response.choices[0].message) {
      return response.choices[0].message.content.trim();
    }
    
    throw new Error('Invalid response from Groq');
  } catch (error) {
    console.error('Groq text generation error:', error);
    throw error;
  }
}

// Generate text with Google Gemini
async function generateTextWithGoogle(prompt, maxTokens, temperature) {
  try {
    console.log('Generating text with Google Gemini');
    
    const result = await googleModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
      },
    });
    
    const response = result.response;
    if (response && response.text) {
      // Fix: Check if text is a function or property
      return typeof response.text === 'function' ? response.text().trim() : response.text.trim();
    }
    
    throw new Error('Invalid response from Google Gemini');
  } catch (error) {
    console.error('Google Gemini text generation error:', error);
    throw error;
  }
}

// Generate text with Replicate
async function generateTextWithReplicate(prompt, maxTokens, temperature) {
  try {
    console.log('Generating text with Replicate');
    
    // Using Llama 3 model for text generation
    const output = await replicate.run(
      "meta/llama-3-8b-instruct:dd2c4301797f0718eeae771f5a1efc97c2c8653a9e451fbf30c922a71c5fd7a5",
      {
        input: {
          prompt: `<|system|>
You are a professional advertising copywriter. Create compelling ad copy based on the provided information.
<|user|>
${prompt}
<|assistant|>`,
          max_new_tokens: maxTokens,
          temperature: temperature,
        }
      }
    );
    
    if (output && output.join) {
      return output.join('').trim();
    }
    
    throw new Error('Invalid response from Replicate');
  } catch (error) {
    console.error('Replicate text generation error:', error);
    throw error;
  }
}

// Image generation with fallback between services
async function generateImage(prompt, options = {}) {
  const { service = 'auto', width = 1024, height = 1024 } = options;
  
  // Map dimensions to supported formats for each service
  const dalleSize = getDalleSize(width, height);
  
  // Try services in order based on preference or availability
  const services = service === 'auto' 
    ? ['openai', 'replicate', 'google'] 
    : [service];
  
  let error = null;
  
  for (const svc of services) {
    try {
      console.log(`Attempting to generate image with ${svc}`);
      
      switch (svc) {
        case 'openai':
          const openaiResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: dalleSize,
            quality: "standard",
            style: "vivid"
          });
          
          // Download and save the image
          const imageUrl = openaiResponse.data[0].url;
          return await downloadAndSaveImage(imageUrl, width, height);
          
        case 'replicate':
          const replicateResponse = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
              input: {
                prompt: prompt,
                width: getValidWidth(width, 'replicate'),
                height: getValidHeight(height, 'replicate'),
                num_outputs: 1
              }
            }
          );
          
          if (replicateResponse && replicateResponse[0]) {
            return await downloadAndSaveImage(replicateResponse[0], width, height);
          }
          throw new Error('No image generated by Replicate');
          
        case 'google':
          // Google's Gemini doesn't support direct image generation yet
          // This is a placeholder for when it becomes available
          throw new Error('Google Gemini image generation not yet supported');
      }
    } catch (err) {
      console.error(`Error with ${svc}:`, err);
      error = err;
      // Continue to next service
    }
  }
  
  // If all services failed, generate a fallback image
  return await generateFallbackImage(prompt, width, height);
}

// Helper function to download and save an image
async function downloadAndSaveImage(imageUrl, targetWidth, targetHeight) {
  try {
    console.log('Downloading image from:', imageUrl);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    
    // Generate a unique filename
    const fileName = `ai-image-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Resize the image to the target dimensions
    await sharp(Buffer.from(imageBuffer))
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(filePath);
    
    console.log('Image saved to:', filePath);
    return `/api/uploads/${fileName}`;
  } catch (error) {
    console.error('Error downloading and saving image:', error);
    throw error;
  }
}

// Generate a fallback image if all AI services fail
async function generateFallbackImage(prompt, width, height) {
  try {
    console.log('Generating fallback image');
    
    // Extract color from prompt if possible
    const colorMatch = prompt.match(/(red|blue|green|yellow|orange|purple|pink|black|white|gray|brown)/i);
    const backgroundColor = colorMatch ? colorMatch[0].toLowerCase() : 'blue';
    
    // Create a simple SVG with the prompt text
    const svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor === 'white' ? '#f0f0f0' : backgroundColor}"/>
        <text x="50%" y="50%" font-family="Arial" font-size="24" fill="${backgroundColor === 'white' ? 'black' : 'white'}" text-anchor="middle">
          ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}
        </text>
      </svg>
    `;
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate a unique filename
    const fileName = `fallback-image-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert SVG to PNG
    await sharp(Buffer.from(svgContent))
      .resize(width, height)
      .toFile(filePath);
    
    console.log('Fallback image saved to:', filePath);
    return `/api/uploads/${fileName}`;
  } catch (error) {
    console.error('Error generating fallback image:', error);
    throw error;
  }
}

// Helper function to get valid DALL-E size
function getDalleSize(width, height) {
  const ratio = width / height;
  
  if (ratio >= 1.5) {
    return "1792x1024"; // Landscape
  } else if (ratio <= 0.67) {
    return "1024x1792"; // Portrait
  } else {
    return "1024x1024"; // Square
  }
}

// Helper function to get valid width for different services
function getValidWidth(width, service) {
  if (service === 'replicate') {
    // SDXL requires width to be a multiple of 8
    return Math.ceil(width / 8) * 8;
  }
  return width;
}

// Helper function to get valid height for different services
function getValidHeight(height, service) {
  if (service === 'replicate') {
    // SDXL requires height to be a multiple of 8
    return Math.ceil(height / 8) * 8;
  }
  return height;
}

module.exports = {
  generateText,
  generateImage,
  tryGroqModels,
  generateTextWithOpenAI,
  generateTextWithGroq,
  generateTextWithGoogle,
  generateTextWithReplicate
};