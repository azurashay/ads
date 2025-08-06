import { Platform, AdSize } from '../types/adTypes';

export const platforms: Platform[] = [
  {
    id: 'google',
    name: 'Google Ads',
    icon: '🔍',
    sizes: [
      { 
        id: 'google-search-300x250', 
        width: 300, 
        height: 250, 
        name: 'Medium Rectangle', 
        platform: 'Google Ads', 
        description: 'Search & Display', 
        aspectRatio: '6:5' 
      },
      { 
        id: 'google-display-728x90', 
        width: 728, 
        height: 90, 
        name: 'Leaderboard', 
        platform: 'Google Ads', 
        description: 'Display Network', 
        aspectRatio: '8:1' 
      },
      { 
        id: 'google-display-300x600', 
        width: 300, 
        height: 600, 
        name: 'Half Page', 
        platform: 'Google Ads', 
        description: 'Display Network', 
        aspectRatio: '1:2' 
      },
      { 
        id: 'google-display-160x600', 
        width: 160, 
        height: 600, 
        name: 'Wide Skyscraper', 
        platform: 'Google Ads', 
        description: 'Display Network', 
        aspectRatio: '4:15' 
      },
      { 
        id: 'google-display-320x50', 
        width: 320, 
        height: 50, 
        name: 'Mobile Banner', 
        platform: 'Google Ads', 
        description: 'Mobile Display', 
        aspectRatio: '32:5' 
      }
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook & Instagram',
    icon: '📘',
    sizes: [
      { 
        id: 'fb-feed-1200x628', 
        width: 1200, 
        height: 628, 
        name: 'Feed Image', 
        platform: 'Facebook', 
        description: 'News Feed', 
        aspectRatio: '1.91:1' 
      },
      { 
        id: 'fb-square-1080x1080', 
        width: 1080, 
        height: 1080, 
        name: 'Square', 
        platform: 'Facebook', 
        description: 'Feed & Stories', 
        aspectRatio: '1:1' 
      },
      { 
        id: 'fb-stories-1080x1920', 
        width: 1080, 
        height: 1920, 
        name: 'Stories', 
        platform: 'Facebook', 
        description: 'Instagram Stories', 
        aspectRatio: '9:16' 
      }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    sizes: [
      { 
        id: 'li-sponsored-1200x627', 
        width: 1200, 
        height: 627, 
        name: 'Sponsored Content', 
        platform: 'LinkedIn', 
        description: 'Feed Ads', 
        aspectRatio: '1.91:1' 
      },
      { 
        id: 'li-message-300x250', 
        width: 300, 
        height: 250, 
        name: 'Message Ads', 
        platform: 'LinkedIn', 
        description: 'InMail', 
        aspectRatio: '6:5' 
      }
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    sizes: [
      { 
        id: 'tw-promoted-1200x675', 
        width: 1200, 
        height: 675, 
        name: 'Promoted Tweet', 
        platform: 'Twitter', 
        description: 'Timeline', 
        aspectRatio: '16:9' 
      }
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    sizes: [
      { 
        id: 'tt-infeed-1080x1920', 
        width: 1080, 
        height: 1920, 
        name: 'In-Feed', 
        platform: 'TikTok', 
        description: 'For You Page', 
        aspectRatio: '9:16' 
      }
    ]
  }
];

export const getAllSizes = (): AdSize[] => {
  return platforms.flatMap(platform => platform.sizes);
};

export const getSizesByPlatform = (platformId: string): AdSize[] => {
  const platform = platforms.find(p => p.id === platformId);
  return platform ? platform.sizes : [];
}; 