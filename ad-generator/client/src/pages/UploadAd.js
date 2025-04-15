import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const UploadAd = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState({
    brandGuidelines: {
      colors: ['#007bff', '#ffffff'],
      tone: 'professional',
      targetAudience: '',
      style: '',
      productDescription: '',
      keyFeatures: '',
      callToAction: '',
      imageDescription: ''
    },
    format: 'social_media',
    aiPreferences: {
      creativity: 0.7, // Default creativity level (0.0-1.0)
      provider: 'auto' // Auto-select the best provider
    }
  });

  // Calculate form completion percentage for progress indicator
  useEffect(() => {
    const requiredFields = ['targetAudience', 'productDescription', 'keyFeatures'];
    const filledFields = requiredFields.filter(field => 
      formData.brandGuidelines[field]?.trim().length > 0
    );
    
    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    setFormProgress(progress);
  }, [formData]);

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear any previous errors when user makes changes
    if (error) setError(null);
  };

  const handleColorChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      brandGuidelines: {
        ...prev.brandGuidelines,
        colors: prev.brandGuidelines.colors.map((color, i) => 
          i === index ? value : color
        )
      }
    }));
  };

  const handleFormatChange = (e) => {
    setFormData(prev => ({
      ...prev,
      format: e.target.value
    }));
  };

  const handleCreativityChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      aiPreferences: {
        ...prev.aiPreferences,
        creativity: value
      }
    }));
  };

  // Generate a detailed prompt for image creation based on user inputs
  const generateImagePrompt = () => {
    const { brandGuidelines } = formData;
    
    // Start with the product description
    let prompt = `Create a professional advertisement image for: ${brandGuidelines.productDescription}`;
    
    // Add style information
    if (brandGuidelines.style) {
      prompt += ` in a ${brandGuidelines.style} style`;
    }
    
    // Add tone information
    prompt += ` with a ${brandGuidelines.tone} tone`;
    
    // Add target audience if provided
    if (brandGuidelines.targetAudience) {
      prompt += ` targeted at ${brandGuidelines.targetAudience}`;
    }
    
    // Add key features if provided
    if (brandGuidelines.keyFeatures) {
      prompt += `. Highlighting these key features: ${brandGuidelines.keyFeatures}`;
    }
    
    // Add call to action if provided
    if (brandGuidelines.callToAction) {
      prompt += `. Include a call to action: "${brandGuidelines.callToAction}"`;
    }
    
    // Add specific image description if provided
    if (brandGuidelines.imageDescription) {
      prompt += `. The image should show: ${brandGuidelines.imageDescription}`;
    }
    
    // Add color information
    prompt += `. Use these brand colors: ${brandGuidelines.colors.join(', ')}`;
    
    // Add format-specific instructions
    if (formData.format === 'social_media') {
      prompt += `. Create a social media friendly image with good visual appeal.`;
    } else if (formData.format === 'banner') {
      prompt += `. Design as a banner advertisement with clear messaging.`;
    } else if (formData.format === 'email') {
      prompt += `. Design for email marketing with clean layout.`;
    }
    
    return prompt;
  };

  // Validate form before submission
  const validateForm = () => {
    const { brandGuidelines } = formData;
    
    if (!brandGuidelines.productDescription.trim()) {
      setError('Product description is required');
      return false;
    }
    
    if (!brandGuidelines.targetAudience.trim()) {
      setError('Target audience is required');
      return false;
    }
    
    if (!brandGuidelines.keyFeatures.trim()) {
      setError('Key features are required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLoadingStage('preparing'); // Initial loading stage
    
    try {
      // Generate the image prompt
      const imagePrompt = generateImagePrompt();
      console.log('Generated Image Prompt:', imagePrompt);
      
      // Create request data object with proper platform based on format
      const requestData = {
        brandGuidelines: formData.brandGuidelines,
        format: formData.format,
        platform: formData.format === 'social_media' ? 'facebook' : 'general',
        aiProvider: formData.aiPreferences.provider,
        imagePrompt: imagePrompt,
        creativity: formData.aiPreferences.creativity
      };
      console.log('Request Data:', requestData);
      
      setLoadingStage('connecting'); // Update loading stage
      const apiUrl = 'http://localhost:5000/api/generate-ad';
      console.log('Using API URL:', apiUrl);
      
      // Call the API endpoint with the full URL and increased timeout
      setLoadingStage('generating'); // Update to image generation stage
      const response = await axios.post(apiUrl, requestData, {
        timeout: 180000, // Increase timeout to 3 minutes for AI generation
        onUploadProgress: () => {
          setLoadingStage('processing'); // Update when request is sent and processing
        }
      });
      console.log('API Response:', response);
      
      setLoadingStage('finalizing'); // Final stage before completion
      
      // Handle response
      if (response.data && response.data.data) {
        // Sanitize the response data to prevent URL construction errors
        const sanitizedData = response.data.data.map(ad => {
          // Make a safe copy of the ad object
          const safeAd = {...ad};
          
          // Ensure imageUrl is properly formatted
          if (safeAd.imageUrl && typeof safeAd.imageUrl === 'string') {
            // If it's not an absolute URL, make it relative to the server
            if (!safeAd.imageUrl.startsWith('http') && !safeAd.imageUrl.startsWith('/')) {
              safeAd.imageUrl = `/${safeAd.imageUrl}`;
            }
          } else {
            // If imageUrl is invalid, use a placeholder
            safeAd.imageUrl = '/placeholder-image.jpg';
          }
          
          // Sanitize any download URLs if they exist
          if (safeAd.downloadUrls && typeof safeAd.downloadUrls === 'object') {
            Object.keys(safeAd.downloadUrls).forEach(key => {
              const url = safeAd.downloadUrls[key];
              if (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('/')) {
                safeAd.downloadUrls[key] = `/${url}`;
              }
            });
          }
          
          return safeAd;
        });
        
        // Navigate to results page with the sanitized generated ads
        navigate('/results', { 
          state: { 
            generatedAds: sanitizedData,
            originalRequest: formData // Pass original request for potential regeneration
          } 
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error generating ad:', error);
      // Set a more descriptive error message based on the error type
      if (error.code === 'ECONNABORTED') {
        setError('Request timed out. AI image generation is taking longer than expected. Please try again with simpler inputs or try later.');
      } else if (error.message.includes('URL')) {
        setError('Invalid URL in response. Please try again.');
      } else if (error.response) {
        setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Failed to generate ad: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  // Helper function to get loading message based on current stage
  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'preparing':
        return 'Preparing your request...';
      case 'connecting':
        return 'Connecting to AI service...';
      case 'generating':
        return 'Generating your advertisement...';
      case 'processing':
        return 'Creating images and content...';
      case 'finalizing':
        return 'Finalizing your advertisement...';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Create New Advertisement</h1>
      <p className="text-center text-gray-600 mb-8">Fill in your brand details to generate a custom advertisement</p>

      {/* Form progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Form completion</span>
          <span className="text-sm font-medium">{formProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Display error message if there is one */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">
                {getLoadingMessage()}
              </h3>
              <p className="text-gray-600 text-center">
                AI image generation can take up to 2 minutes. Please be patient.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand Guidelines Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Brand Guidelines</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Colors <span className="text-gray-500 text-xs">(Select primary and secondary colors)</span>
              </label>
              <div className="flex space-x-2">
                {formData.brandGuidelines.colors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="h-10 w-20 cursor-pointer"
                    />
                    <span className="text-xs mt-1">{index === 0 ? 'Primary' : 'Secondary'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Tone <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.brandGuidelines.tone}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'tone')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="playful">Playful</option>
                <option value="luxury">Luxury</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.brandGuidelines.targetAudience}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'targetAudience')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Young professionals, age 25-35"
              />
              <p className="text-xs text-gray-500 mt-1">Who is your product or service designed for?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Style
              </label>
              <input
                type="text"
                value={formData.brandGuidelines.style}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'style')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Minimalist, Modern, Traditional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.brandGuidelines.productDescription}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'productDescription')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Describe your product or service in detail..."
              />
              <p className="text-xs text-gray-500 mt-1">Be specific about what your product or service offers</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Features <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.brandGuidelines.keyFeatures}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'keyFeatures')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="List the key features or benefits, separated by commas..."
              />
              <p className="text-xs text-gray-500 mt-1">What makes your product or service stand out?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call to Action
              </label>
              <input
                type="text"
                value={formData.brandGuidelines.callToAction}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'callToAction')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Shop Now, Learn More, Sign Up"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Description
              </label>
              <textarea
                value={formData.brandGuidelines.imageDescription}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'imageDescription')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Describe what you want to see in the image (e.g., 'A person using our product outdoors')"
              />
              <p className="text-xs text-gray-500 mt-1">The more specific you are, the better the generated image will match your vision</p>
            </div>
          </div>
        </div>

        {/* Output Format Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Output Format</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.format === 'social_media' ? 'border-blue-500 bg-blue-50' : ''}`}>
              <input
                type="radio"
                name="format"
                value="social_media"
                checked={formData.format === 'social_media'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <div>
                <span className="font-medium">Social Media Post</span>
                <p className="text-xs text-gray-500 mt-1">Optimized for Facebook, Instagram, etc.</p>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.format === 'banner' ? 'border-blue-500 bg-blue-50' : ''}`}>
              <input
                type="radio"
                name="format"
                value="banner"
                checked={formData.format === 'banner'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <div>
                <span className="font-medium">Banner Ad</span>
                <p className="text-xs text-gray-500 mt-1">For websites and digital displays</p>
              </div>
            </label>

            <label className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.format === 'email' ? 'border-blue-500 bg-blue-50' : ''}`}>
              <input
                type="radio"
                name="format"
                value="email"
                checked={formData.format === 'email'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <div>
                <span className="font-medium">Email Marketing</span>
                <p className="text-xs text-gray-500 mt-1">Designed for email campaigns</p>
              </div>
            </label>
          </div>
        </div>

        {/* AI Preferences Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Creativity Level
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Conservative</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.aiPreferences.creativity}
                  onChange={handleCreativityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm">Creative</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Higher creativity produces more varied results, lower creativity produces more predictable results
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 text-white font-semibold rounded-lg ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isLoading ? 'Generating...' : 'Generate Advertisement'}
        </button>
        
        <p className="text-center text-gray-500 text-sm">
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </form>
    </div>
  );
};

export default UploadAd;
