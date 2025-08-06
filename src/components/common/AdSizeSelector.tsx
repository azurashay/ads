import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AdSize } from '../../types/adTypes';
import { platforms } from '../../utils/adData';

interface AdSizeSelectorProps {
  onSizeChange: (size: AdSize) => void;
  selectedSize?: AdSize | null;
}

const AdSizeSelector: React.FC<AdSizeSelectorProps> = ({ onSizeChange, selectedSize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredSizes = selectedPlatform === 'all' 
    ? platforms.flatMap(p => p.sizes)
    : platforms.find(p => p.id === selectedPlatform)?.sizes || [];

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            selectedPlatform === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Platforms
        </button>
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPlatform === platform.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {platform.icon} {platform.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedSize ? (
              <>
                <div className="w-8 h-6 bg-gray-200 rounded border flex items-center justify-center text-xs font-mono">
                  {selectedSize.width}x{selectedSize.height}
                </div>
                <div>
                  <div className="font-medium">{selectedSize.name}</div>
                  <div className="text-sm text-gray-500">{selectedSize.platform} • {selectedSize.description}</div>
                </div>
              </>
            ) : (
              <span className="text-gray-500">Select ad size...</span>
            )}
          </div>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
            {filteredSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  onSizeChange(size);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="w-8 h-6 bg-gray-200 rounded border flex items-center justify-center text-xs font-mono">
                  {size.width}x{size.height}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium">{size.name}</div>
                  <div className="text-sm text-gray-500">{size.platform} • {size.description}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {size.aspectRatio}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdSizeSelector; 