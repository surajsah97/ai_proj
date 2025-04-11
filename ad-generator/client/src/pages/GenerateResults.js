import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdCard from '../components/AdCard';
import axios from '../utils/axios';

const GenerateResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ads, setAds] = useState(location.state?.generatedAds || []);

  const handleRegenerate = async (ad) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/generate-ad', {
        ...ad,
        regenerate: true
      });
      
      // Replace the old ad with the new one
      setAds(prevAds => 
        prevAds.map(prevAd => 
          prevAd.id === ad.id ? response.data.data[0] : prevAd
        )
      );
    } catch (error) {
      console.error('Error regenerating ad:', error);
      alert('Error regenerating ad. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (ad) => {
    // Create a JSON blob and trigger download
    const data = JSON.stringify(ad, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad-${ad.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!location.state?.generatedAds) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Ads Generated</h2>
          <p className="text-gray-600 mb-8">Please upload a reference ad to generate new advertisements.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Ad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generated Advertisements
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are your AI-generated advertisements. You can regenerate any ad or download them for your use.
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
