/**
 * Ad Generator Utilities
 * Generate multiple ad templates based on configuration
 */

import { AdTemplate, AdSize } from '../types/adTypes';
import { getAllSizes } from './adData';

export interface AdConfig {
  name: string;
  title: string;
  subtitle: string;
  buttonText: string;
  logoImage?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  platforms: string[];
  sizes?: string[];
}

/**
 * Generate ad templates based on configuration
 */
export const generateAdTemplates = (config: AdConfig): AdTemplate[] => {
  const templates: AdTemplate[] = [];
  const allSizes = getAllSizes();
  
  // Filter sizes based on selected platforms and sizes
  let filteredSizes = allSizes;
  
  if (config.platforms.length > 0) {
    filteredSizes = allSizes.filter(size => 
      config.platforms.includes(size.platform)
    );
  }
  
  if (config.sizes && config.sizes.length > 0) {
    filteredSizes = filteredSizes.filter(size => 
      config.sizes!.includes(size.id)
    );
  }
  
  // Generate template for each size
  filteredSizes.forEach((size, index) => {
    const template: AdTemplate = {
      id: `generated-${index + 1}`,
      name: `${config.name} - ${size.name}`,
      size,
      elements: [
        {
          id: 'logo-1',
          type: 'logo',
          content: 'LOGO',
          imageUrl: config.logoImage || '',
          isVisible: true,
          position: { x: 10, y: 10 },
          style: { fontSize: 16, color: '#000000' }
        },
        {
          id: 'title-1',
          type: 'title',
          content: config.title,
          isVisible: true,
          position: { x: 50, y: 50 },
          style: { fontSize: 24, color: '#000000', fontWeight: 'bold' }
        },
        {
          id: 'subtitle-1',
          type: 'subtitle',
          content: config.subtitle,
          isVisible: true,
          position: { x: 50, y: 90 },
          style: { fontSize: 16, color: '#666666' }
        },
        {
          id: 'button-1',
          type: 'button',
          content: config.buttonText,
          isVisible: true,
          position: { x: 50, y: 130 },
          style: { fontSize: 14, color: '#ffffff', backgroundColor: '#3b82f6' }
        }
      ],
      background: {
        type: config.backgroundImage ? 'image' : 'color',
        value: config.backgroundImage || config.backgroundColor || '#ffffff'
      },
      alignment: 'center'
    };
    
    templates.push(template);
  });
  
  return templates;
};

/**
 * Generate templates for all platforms
 */
export const generateAllPlatformTemplates = (config: AdConfig): AdTemplate[] => {
  const allPlatforms = ['Google Ads', 'Facebook & Instagram', 'LinkedIn', 'Twitter/X', 'TikTok'];
  return generateAdTemplates({
    ...config,
    platforms: allPlatforms
  });
};

/**
 * Generate templates for specific platforms
 */
export const generatePlatformTemplates = (config: AdConfig, platforms: string[]): AdTemplate[] => {
  return generateAdTemplates({
    ...config,
    platforms
  });
};

/**
 * Generate templates for specific sizes
 */
export const generateSizeTemplates = (config: AdConfig, sizeIds: string[]): AdTemplate[] => {
  return generateAdTemplates({
    ...config,
    sizes: sizeIds
  });
};

/**
 * Create a sample configuration
 */
export const createSampleConfig = (): AdConfig => {
  return {
    name: 'Sample Ad Campaign',
    title: 'Amazing Product',
    subtitle: 'Discover the best features and benefits',
    buttonText: 'Learn More',
    backgroundColor: '#00A0FF',
    platforms: ['Google Ads', 'Facebook & Instagram'],
    sizes: ['google-search-300x250', 'fb-feed-1200x628']
  };
}; 