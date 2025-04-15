import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdCard from '../components/AdCard';
import axios from '../utils/axios';

const GenerateResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ads, setAds] = useState(() => {
    const initialAds = location.state?.generatedAds || [];
    console.log('Initial ads data:', initialAds);

    // Recursive function to sanitize ad object properties and log types
    function sanitizeAd(ad, path = '') {
      if (ad === null || ad === undefined) return ad;
      if (typeof ad === 'string' || typeof ad === 'number' || typeof ad === 'boolean') return ad;
      if (Array.isArray(ad)) {
        return ad.map((item, index) => sanitizeAd(item, `${path}[${index}]`));
      }
      if (typeof ad === 'object') {
        // If it's a React element (has $$typeof), convert to string placeholder and log
        if (ad.$$typeof) {
          console.warn(`React element found at ${path}, replacing with placeholder`);
          return '[React Element]';
        }
        // Defensive: if object has React children or props that are React elements, sanitize them too
        const sanitized = {};
        for (const key in ad) {
          if (Object.prototype.hasOwnProperty.call(ad, key)) {
            sanitized[key] = sanitizeAd(ad[key], path ? `${path}.${key}` : key);
          }
        }
        return sanitized;
      }
      console.warn(`Unexpected type at ${path}:`, typeof ad);
      return String(ad);
    }

    const sanitizedAds = Array.isArray(initialAds)
      ? initialAds.map((ad, index) => sanitizeAd(ad, `ads[${index}]`))
      : [sanitizeAd(initialAds, 'ads[0]')];

    console.log('Sanitized ads data:', sanitizedAds);
    return sanitizedAds;
  });

  const handleRegenerate = async (ad, element = null) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/generate-ad', {
        ...ad,
        regenerate: true,
        regenerateElement: element
      });
      
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format from server');
      }

      const newAd = response.data.data[0];
      if (!newAd || typeof newAd !== 'object') {
        throw new Error('Invalid ad data received from server');
      }

      // Replace the old ad with the new one
      setAds(prevAds => 
        prevAds.map(prevAd => 
          prevAd.id === ad.id ? newAd : prevAd
        )
      );
    } catch (error) {
      console.error('Error regenerating ad:', error);
      alert('Error regenerating ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownload = async (ad, format) => {
    try {
      const downloadUrl = ad.downloadUrls?.[format];
      if (!downloadUrl) {
        throw new Error(`Download URL for ${format} not found`);
      }

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl.startsWith('http') ? downloadUrl : `${axios.defaults.baseURL}${downloadUrl}`;
      link.download = `ad-${ad.id}.${format}`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Generated Advertisements
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are your AI-generated advertisements. You can regenerate any element or download them in different formats.
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Regenerating ad...</p>
            </div>
          </div>
        )}

        {/* Grid of Ad Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onRegenerate={handleRegenerate}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {/* Create New Ad Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Another Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateResults;
