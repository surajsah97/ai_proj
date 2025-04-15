import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import '../styles/AdGenerator.css';

const AD_FORMATS = {
  social_media: {
    platforms: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'],
    contentTypes: ['image', 'video', 'carousel']
  },
  banner: {
    types: ['leaderboard', 'skyscraper', 'rectangle', 'sidebar']
  },
  poster: {
    types: ['digital', 'print']
  },
  email: {
    types: ['newsletter', 'promotional', 'transactional']
  }
};

const AdGenerator = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [brandGuidelines, setBrandGuidelines] = useState({
    colors: ['#007bff', '#ffffff'],
    tone: 'professional',
    targetAudience: 'general',
    style: 'modern',
    productDescription: '',
    keyFeatures: '',
    callToAction: 'Shop Now'
  });

  const [selectedFormat, setSelectedFormat] = useState('social_media');
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [selectedAIService, setSelectedAIService] = useState('auto');

  const handleInputChange = (e, field) => {
    setBrandGuidelines({
      ...brandGuidelines,
      [field]: e.target.value
    });
  };

  const handleColorChange = (index, value) => {
    const newColors = [...brandGuidelines.colors];
    newColors[index] = value;
    setBrandGuidelines({
      ...brandGuidelines,
      colors: newColors
    });
  };

  const handleAddColor = () => {
    if (brandGuidelines.colors.length < 5) {
      setBrandGuidelines({
        ...brandGuidelines,
        colors: [...brandGuidelines.colors, '#000000']
      });
    }
  };

  const handleRemoveColor = (index) => {
    if (brandGuidelines.colors.length > 1) {
      const newColors = brandGuidelines.colors.filter((_, i) => i !== index);
      setBrandGuidelines({
        ...brandGuidelines,
        colors: newColors
      });
    }
  };

  const handleFormatChange = (e) => {
    const format = e.target.value;
    setSelectedFormat(format);
    
    // Reset platform when format changes
    if (format === 'social_media') {
      setSelectedPlatform('facebook');
    } else if (format === 'banner') {
      setSelectedPlatform('leaderboard');
    } else if (format === 'poster') {
      setSelectedPlatform('digital');
    } else if (format === 'email') {
      setSelectedPlatform('newsletter');
    }
  };

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  const handleAIServiceChange = (e) => {
    setSelectedAIService(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data for API call
      const requestData = {
        brandGuidelines,
        format: selectedFormat,
        platform: selectedPlatform,
        aiService: selectedAIService
      };
      
      // Call the API endpoint
      const response = await axios.post('/api/generate-ad', requestData);
      
      // Handle response
      if (response.data && response.data.data) {
        navigate('/results', { state: { generatedAds: response.data.data } });
      }
    } catch (error) {
      console.error('Error generating ad:', error);
      setError('Failed to generate ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ad-generator">
      <h1>AI Ad Generator</h1>
      <p className="description">
        Fill in the details below to generate an AI-powered advertisement tailored to your brand.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Brand Guidelines</h2>
          
          <div className="form-group">
            <label htmlFor="colors">Brand Colors</label>
            <div className="color-inputs">
              {brandGuidelines.colors.map((color, index) => (
                <div key={index} className="color-input-group">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="color-picker"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(index)}
                    className="color-remove-btn"
                    disabled={brandGuidelines.colors.length <= 1}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {brandGuidelines.colors.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="color-add-btn"
                >
                  + Add Color
                </button>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="tone">Brand Tone</label>
            <select
              id="tone"
              value={brandGuidelines.tone}
              onChange={(e) => handleInputChange(e, 'tone')}
              className="form-control"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="humorous">Humorous</option>
              <option value="serious">Serious</option>
              <option value="inspirational">Inspirational</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience</label>
            <input
              type="text"
              id="targetAudience"
              value={brandGuidelines.targetAudience}
              onChange={(e) => handleInputChange(e, 'targetAudience')}
              placeholder="e.g., Young professionals, Parents, etc."
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="style">Visual Style</label>
            <select
              id="style"
              value={brandGuidelines.style}
              onChange={(e) => handleInputChange(e, 'style')}
              className="form-control"
            >
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="bold">Bold</option>
              <option value="vintage">Vintage</option>
              <option value="corporate">Corporate</option>
              <option value="playful">Playful</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="productDescription">Product/Service Description</label>
            <textarea
              id="productDescription"
              value={brandGuidelines.productDescription}
              onChange={(e) => handleInputChange(e, 'productDescription')}
              placeholder="Describe your product or service"
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="keyFeatures">Key Features/Benefits</label>
            <textarea
              id="keyFeatures"
              value={brandGuidelines.keyFeatures}
              onChange={(e) => handleInputChange(e, 'keyFeatures')}
              placeholder="List key features or benefits"
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="callToAction">Call to Action</label>
            <input
              type="text"
              id="callToAction"
              value={brandGuidelines.callToAction}
              onChange={(e) => handleInputChange(e, 'callToAction')}
              placeholder="e.g., Shop Now, Learn More, etc."
              className="form-control"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Ad Format</h2>
          
          <div className="form-group">
            <label htmlFor="format">Format</label>
            <select
              id="format"
              value={selectedFormat}
              onChange={handleFormatChange}
              className="form-control"
            >
              <option value="social_media">Social Media</option>
              <option value="banner">Web Banner</option>
              <option value="poster">Poster</option>
              <option value="email">Email</option>
            </select>
          </div>
          
          {selectedFormat === 'social_media' && (
            <div className="form-group">
              <label htmlFor="platform">Platform</label>
              <select
                id="platform"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="form-control"
              >
                {AD_FORMATS.social_media.platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedFormat === 'banner' && (
            <div className="form-group">
              <label htmlFor="bannerType">Banner Type</label>
              <select
                id="bannerType"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="form-control"
              >
                {AD_FORMATS.banner.types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedFormat === 'poster' && (
            <div className="form-group">
              <label htmlFor="posterType">Poster Type</label>
              <select
                id="posterType"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="form-control"
              >
                {AD_FORMATS.poster.types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {selectedFormat === 'email' && (
            <div className="form-group">
              <label htmlFor="emailType">Email Type</label>
              <select
                id="emailType"
                value={selectedPlatform}
                onChange={handlePlatformChange}
                className="form-control"
              >
                {AD_FORMATS.email.types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="form-section">
          <h2>AI Settings</h2>
          
          <div className="form-group">
            <label htmlFor="aiService">AI Service</label>
            <select
              id="aiService"
              value={selectedAIService}
              onChange={handleAIServiceChange}
              className="form-control"
            >
              <option value="auto">Auto (Try all services)</option>
              <option value="openai">OpenAI (DALL-E)</option>
              <option value="replicate">Replicate (SDXL)</option>
              <option value="groq">Groq</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Ad'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AdGenerator;