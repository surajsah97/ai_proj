import React from 'react';

const AdCard = ({ ad, onRegenerate, onDownload }) => {
  const {
    headline,
    subheadline,
    cta,
    imageUrl,
    format,
    style: { colors = ['#007bff', '#ffffff'], tone = 'professional' } = {}
  } = ad;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-102">
      {/* Ad Preview */}
      <div 
        className="relative"
        style={{ backgroundColor: colors[0] }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Advertisement"
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-xs uppercase tracking-wide mb-1">
              Format: {format}
            </p>
            <p className="text-xs uppercase tracking-wide mb-1">
              Tone: {tone}
            </p>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {headline}
        </h3>
        <p className="text-gray-600 mb-4">
          {subheadline}
        </p>
        <button
          className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: colors[0] }}
        >
          {cta}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex space-x-4">
        <button
          onClick={() => onRegenerate(ad)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Regenerate
        </button>
        <button
          onClick={() => onDownload(ad)}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Download
        </button>
      </div>

      {/* Color Palette */}
      <div className="px-6 pb-4">
        <div className="flex space-x-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdCard;
