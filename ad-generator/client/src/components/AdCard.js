import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { motion } from 'framer-motion';
import { FiDownload, FiRefreshCw, FiEdit, FiImage, FiAlertTriangle } from 'react-icons/fi';

const AdCard = ({ ad, onRegenerate, onDownload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [isHovered, setIsHovered] = useState(false);

  const [animateIn, setAnimateIn] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Always call hooks unconditionally and before any early returns
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    if (!ad || typeof ad !== 'object') {
      console.error('Invalid ad prop received:', ad);
      return;
    }
    console.log('Ad properties types:');
    Object.entries(ad || {}).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value.$$typeof) {
        console.warn(`React element found in ad property "${key}"`);
      } else {
        console.log(`Property "${key}": type ${typeof value}`);
      }
    });
  }, [ad]);

  if (!ad || typeof ad !== 'object') {
    return <div className="text-red-500 p-4">Error: Invalid ad data</div>;
  }

  const {
    headline = '',
    subheadline = '',
    cta = 'Learn More',
    imageUrl = '',
    format = 'unknown',
    style = {},
    downloadUrls = {}
  } = ad;

  // Defensive checks for headline, subheadline, cta to avoid rendering objects
  const safeHeadline = typeof headline === 'object' ? JSON.stringify(headline) : headline;
  const safeSubheadline = typeof subheadline === 'object' ? JSON.stringify(subheadline) : subheadline;
  const safeCta = typeof cta === 'object' ? JSON.stringify(cta) : cta;

  // Define missing handlers to avoid no-undef errors
  const handleCtaClick = () => {
    alert(`This would take the user to a landing page for: ${safeHeadline}`);
  };

  const handleRegenerateElement = (element) => {
    if (onRegenerate) {
      setIsLoading(true);
      onRegenerate(ad, element).catch((error) => {
        console.error('Error regenerating element:', error);
        setError({ type: 'error', message: 'Failed to regenerate. Please try again.' });
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleDownload = (type) => {
    if (onDownload) {
      setIsLoading(true);
      onDownload(ad, type).catch((error) => {
        console.error('Error downloading ad:', error);
        setError({ type: 'error', message: 'Failed to download. Please try again.' });
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    if (activeTab === 'edit') {
      handleRegenerateElement('all');
    } else {
      handleDownload('image');
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: animateIn ? 1 : 0, y: animateIn ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Ad Preview */}
      <div className="relative" style={{ backgroundColor: (Array.isArray(style.colors) ? style.colors[0] : '#007bff') }}>
        {imageUrl && (
          <div className="relative">
            <motion.img
              src={imageUrl && (imageUrl.startsWith('http') ? imageUrl : `${axios.defaults.baseURL}${imageUrl}`)}
              alt={safeHeadline || 'Ad image'}
              className="w-full object-cover"
              style={{ maxHeight: '300px' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              <h3 className="text-white text-xl font-bold mb-2">{safeHeadline}</h3>
              <p className="text-white text-sm mb-4">{safeSubheadline}</p>
              <motion.button
                className="px-4 py-2 rounded-md font-medium text-sm"
                style={{ backgroundColor: (Array.isArray(style.colors) ? style.colors[1] : '#ffffff'), color: (Array.isArray(style.colors) ? style.colors[0] : '#007bff') }}
                onClick={handleCtaClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {safeCta}
              </motion.button>
            </motion.div>
          </div>
        )}

        {!imageUrl && (
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2" style={{ color: (Array.isArray(style.colors) ? style.colors[1] : '#ffffff') }}>{safeHeadline}</h3>
            <p className="text-sm mb-4" style={{ color: (Array.isArray(style.colors) ? style.colors[1] : '#ffffff') }}>{safeSubheadline}</p>
            <motion.button
              className="px-4 py-2 rounded-md font-medium text-sm"
              style={{ backgroundColor: (Array.isArray(style.colors) ? style.colors[1] : '#ffffff'), color: (Array.isArray(style.colors) ? style.colors[0] : '#007bff') }}
              onClick={handleCtaClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {safeCta}
            </motion.button>
          </div>
        )}

        {/* Format badge */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {format} {style.tone}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <motion.button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-4 text-sm font-medium flex items-center ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <FiImage className="mr-1" /> Preview
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('edit')}
            className={`py-2 px-4 text-sm font-medium flex items-center ${
              activeTab === 'edit'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <FiEdit className="mr-1" /> Edit
          </motion.button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'preview' ? (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">{safeHeadline}</h3>
          </div>
          <p className="text-gray-600 mb-4">{safeSubheadline}</p>
          <motion.button
            className="w-full mb-3 px-4 py-2 text-white rounded transition-colors flex items-center justify-center"
            style={{ backgroundColor: (Array.isArray(style.colors) ? style.colors[0] : '#007bff') }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {safeCta}
          </motion.button>
        </div>
      ) : (
        <div className="p-6">
          <div className="space-y-4">
            <div className="group relative">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {safeHeadline}
              </h3>
              <motion.div
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={() => handleRegenerateElement('headline')}
                  className="text-xs bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded-full flex items-center"
                >
                  <FiRefreshCw className="mr-1" /> Regenerate
                </button>
              </motion.div>
            </div>

            <div className="group relative">
              <p className="text-gray-600 mb-4">
                {safeSubheadline}
              </p>
              <motion.div
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={() => handleRegenerateElement('subheadline')}
                  className="text-xs bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded-full flex items-center"
                >
                  <FiRefreshCw className="mr-1" /> Regenerate
                </button>
              </motion.div>
            </div>

            <div className="group relative">
              <button
                className="w-full mb-3 px-4 py-2 text-white rounded transition-colors"
                style={{ backgroundColor: (Array.isArray(style.colors) ? style.colors[0] : '#007bff') }}
              >
                {safeCta}
              </button>
              <motion.div
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={() => handleRegenerateElement('cta')}
                  className="text-xs bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded-full flex items-center"
                >
                  <FiRefreshCw className="mr-1" /> Regenerate
                </button>
              </motion.div>
            </div>

            <div className="group relative">
              <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                <FiImage className="text-gray-400 text-2xl" />
              </div>
              <motion.div
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              >
                <button
                  onClick={() => handleRegenerateElement('image')}
                  className="text-xs bg-blue-100 text-blue-600 hover:text-blue-800 px-2 py-1 rounded-full flex items-center"
                >
                  <FiRefreshCw className="mr-1" /> Regenerate Image
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className={`p-4 ${error.type === 'timeout' ? 'bg-yellow-50' : 'bg-red-50'} border-l-4 ${error.type === 'timeout' ? 'border-yellow-400' : 'border-red-400'}`}>
          <div className="flex items-center">
            <FiAlertTriangle className={`mr-3 ${error.type === 'timeout' ? 'text-yellow-400' : 'text-red-400'}`} />
            <p className="text-sm text-gray-700">{error.message}</p>
          </div>
          {error.type === 'timeout' && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">The server might still be processing your request.</p>
              <motion.button
                onClick={handleRetry}
                className="mt-2 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="mr-1" /> Retry ({retryCount + 1})
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <motion.button
          onClick={() => handleRegenerateElement('all')}
          disabled={isLoading}
          className={`w-full mb-3 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Processing...' : 'Regenerate All'}
        </motion.button>
        
        <div className="grid grid-cols-3 gap-2">
          {downloadUrls.pdf && (
            <motion.button
              onClick={() => handleDownload('pdf')}
              disabled={isLoading}
              className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              <FiDownload className="mr-1" /> PDF
            </motion.button>
          )}
          {downloadUrls.ppt && (
            <motion.button
              onClick={() => handleDownload('ppt')}
              disabled={isLoading}
              className={`px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              <FiDownload className="mr-1" /> PPT
            </motion.button>
          )}
          {downloadUrls.image && (
            <motion.button
              onClick={() => handleDownload('image')}
              disabled={isLoading}
              className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              <FiDownload className="mr-1" /> Image
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdCard;
