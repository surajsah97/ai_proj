import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const UploadAd = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    referenceAd: {
      imageUrl: '',
      text: '',
    },
    brandGuidelines: {
      colors: ['#007bff', '#ffffff'],
      tone: 'professional',
      targetAudience: '',
      style: '',
    },
    format: 'social_media',
  });

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFormatChange = (e) => {
    setFormData(prev => ({
      ...prev,
      format: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/generate-ad', formData);
      navigate('/results', { state: { generatedAds: response.data.data } });
    } catch (error) {
      console.error('Error generating ad:', error);
      alert('Error generating ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Create New Advertisement</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Reference Ad Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reference Advertisement</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Image URL
              </label>
              <input
                type="url"
                value={formData.referenceAd.imageUrl}
                onChange={(e) => handleInputChange(e, 'referenceAd', 'imageUrl')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Ad Text
              </label>
              <textarea
                value={formData.referenceAd.text}
                onChange={(e) => handleInputChange(e, 'referenceAd', 'text')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Enter your reference ad text here..."
              />
            </div>
          </div>
        </div>

        {/* Brand Guidelines Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Brand Guidelines</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Colors
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={formData.brandGuidelines.colors[0]}
                  onChange={(e) => handleInputChange(e, 'brandGuidelines', 'colors')}
                  className="h-10 w-20"
                />
                <input
                  type="color"
                  value={formData.brandGuidelines.colors[1]}
                  onChange={(e) => handleInputChange(e, 'brandGuidelines', 'colors')}
                  className="h-10 w-20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Tone
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
                Target Audience
              </label>
              <input
                type="text"
                value={formData.brandGuidelines.targetAudience}
                onChange={(e) => handleInputChange(e, 'brandGuidelines', 'targetAudience')}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Young professionals, age 25-35"
              />
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
          </div>
        </div>

        {/* Output Format Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Output Format</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="format"
                value="social_media"
                checked={formData.format === 'social_media'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <span>Social Media Post</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="format"
                value="banner"
                checked={formData.format === 'banner'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <span>Banner Ad</span>
            </label>

            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="format"
                value="email"
                checked={formData.format === 'email'}
                onChange={handleFormatChange}
                className="mr-2"
              />
              <span>Email Marketing</span>
            </label>
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
      </form>
    </div>
  );
};

export default UploadAd;
