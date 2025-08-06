import React, { useState } from 'react';

interface AdSize {
  id: string;
  width: number;
  height: number;
  name: string;
  platform: string;
  description: string;
  aspectRatio: string;
}

interface AdSizeDropdownProps {
  onSizeChange: (size: AdSize) => void;
  selectedSize?: AdSize | null;
}

const AdSizeDropdown: React.FC<AdSizeDropdownProps> = ({ onSizeChange, selectedSize }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const adSizes: AdSize[] = [
    // Google Ads
    { id: 'google-search-300x250', width: 300, height: 250, name: 'Medium Rectangle', platform: 'Google Ads', description: 'Search & Display', aspectRatio: '6:5' },
    { id: 'google-display-728x90', width: 728, height: 90, name: 'Leaderboard', platform: 'Google Ads', description: 'Display Network', aspectRatio: '8:1' },
    { id: 'google-display-300x600', width: 300, height: 600, name: 'Half Page', platform: 'Google Ads', description: 'Display Network', aspectRatio: '1:2' },
    { id: 'google-display-160x600', width: 160, height: 600, name: 'Wide Skyscraper', platform: 'Google Ads', description: 'Display Network', aspectRatio: '4:15' },
    { id: 'google-display-320x50', width: 320, height: 50, name: 'Mobile Banner', platform: 'Google Ads', description: 'Mobile Display', aspectRatio: '32:5' },
    
    // Facebook & Instagram
    { id: 'fb-feed-1200x628', width: 1200, height: 628, name: 'Feed Image', platform: 'Facebook & Instagram', description: 'News Feed', aspectRatio: '1.91:1' },
    { id: 'fb-square-1080x1080', width: 1080, height: 1080, name: 'Square', platform: 'Facebook & Instagram', description: 'Feed & Stories', aspectRatio: '1:1' },
    { id: 'fb-stories-1080x1920', width: 1080, height: 1920, name: 'Stories', platform: 'Facebook & Instagram', description: 'Instagram Stories', aspectRatio: '9:16' },
    
    // LinkedIn
    { id: 'li-sponsored-1200x627', width: 1200, height: 627, name: 'Sponsored Content', platform: 'LinkedIn', description: 'Feed Ads', aspectRatio: '1.91:1' },
    { id: 'li-message-300x250', width: 300, height: 250, name: 'Message Ads', platform: 'LinkedIn', description: 'InMail', aspectRatio: '6:5' },
    
    // Twitter/X
    { id: 'tw-promoted-1200x675', width: 1200, height: 675, name: 'Promoted Tweet', platform: 'Twitter/X', description: 'Timeline', aspectRatio: '16:9' },
    
    // TikTok
    { id: 'tt-infeed-1080x1920', width: 1080, height: 1920, name: 'In-Feed', platform: 'TikTok', description: 'For You Page', aspectRatio: '9:16' },
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: '🌐' },
    { id: 'google', name: 'Google Ads', icon: '🔍' },
    { id: 'facebook', name: 'Facebook & Instagram', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  ];

  const filteredSizes = selectedPlatform === 'all' 
    ? adSizes
    : adSizes.filter(size => {
        if (selectedPlatform === 'google') return size.platform === 'Google Ads';
        if (selectedPlatform === 'facebook') return size.platform === 'Facebook & Instagram';
        if (selectedPlatform === 'linkedin') return size.platform === 'LinkedIn';
        if (selectedPlatform === 'twitter') return size.platform === 'Twitter/X';
        if (selectedPlatform === 'tiktok') return size.platform === 'TikTok';
        return true;
      });

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.name === platform);
    return platformData?.icon || '📱';
  };

  return (
    <div className="relative">
      {/* Platform Filter Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {platforms.map(platform => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedPlatform === platform.id 
                ? 'bg-primary text-neutral-0' 
                : 'bg-neutral-2 text-neutral-6 hover:bg-neutral-1'
            }`}
          >
            {platform.icon} {platform.name}
          </button>
        ))}
      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 border border-neutral-2 rounded-lg bg-neutral-0 hover:bg-neutral-1 transition-colors"
        >
          <div className="flex items-center gap-3">
            {selectedSize ? (
              <>
                <div className="w-8 h-6 bg-neutral-2 rounded border flex items-center justify-center text-xs font-mono">
                  {selectedSize.width}x{selectedSize.height}
                </div>
                <div>
                  <div className="font-medium text-neutral-6">{selectedSize.name}</div>
                  <div className="text-sm text-neutral-5 flex items-center gap-1">
                    {getPlatformIcon(selectedSize.platform)} {selectedSize.platform} • {selectedSize.description}
                  </div>
                </div>
              </>
            ) : (
              <span className="text-neutral-5">Select ad size...</span>
            )}
          </div>
          <svg 
            className={`w-5 h-5 text-neutral-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-0 border border-neutral-2 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
            {filteredSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  onSizeChange(size);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-neutral-1 border-b border-neutral-2 last:border-b-0 transition-colors"
              >
                <div className="w-8 h-6 bg-neutral-2 rounded border flex items-center justify-center text-xs font-mono">
                  {size.width}x{size.height}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-6">{size.name}</div>
                  <div className="text-sm text-neutral-5 flex items-center gap-1">
                    {getPlatformIcon(size.platform)} {size.platform} • {size.description}
                  </div>
                </div>
                <div className="text-xs text-neutral-5">
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

export default AdSizeDropdown; 