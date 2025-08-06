/**
 * Ad Storage Utilities
 * Functions for saving and loading ad templates
 */

import { AdTemplate } from '../types/adTypes';

const STORAGE_KEY = 'ad_creator_templates';

/**
 * Save ad template to localStorage
 */
export const saveAdTemplate = (template: AdTemplate): void => {
  try {
    const existingTemplates = getAdTemplates();
    const updatedTemplates = [...existingTemplates, template];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error saving ad template:', error);
  }
};

/**
 * Get all saved ad templates
 */
export const getAdTemplates = (): AdTemplate[] => {
  try {
    const templates = localStorage.getItem(STORAGE_KEY);
    return templates ? JSON.parse(templates) : [];
  } catch (error) {
    console.error('Error loading ad templates:', error);
    return [];
  }
};

/**
 * Delete ad template by ID
 */
export const deleteAdTemplate = (templateId: string): void => {
  try {
    const existingTemplates = getAdTemplates();
    const updatedTemplates = existingTemplates.filter(template => template.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error deleting ad template:', error);
  }
};

/**
 * Update existing ad template
 */
export const updateAdTemplate = (templateId: string, updatedTemplate: AdTemplate): void => {
  try {
    const existingTemplates = getAdTemplates();
    const updatedTemplates = existingTemplates.map(template => 
      template.id === templateId ? updatedTemplate : template
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
  } catch (error) {
    console.error('Error updating ad template:', error);
  }
};

/**
 * Export ad template as JSON file
 */
export const exportAdTemplate = (template: AdTemplate): void => {
  try {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ad-template-${template.name}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting ad template:', error);
  }
};

/**
 * Import ad template from JSON file
 */
export const importAdTemplate = (file: File): Promise<AdTemplate> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const template = JSON.parse(content) as AdTemplate;
        
        // Validate template structure
        if (!template.id || !template.name || !template.size || !template.elements) {
          throw new Error('Invalid template format');
        }
        
        resolve(template);
      } catch (error) {
        reject(new Error('Failed to parse template file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read template file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Clear all saved templates
 */
export const clearAllTemplates = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing templates:', error);
  }
}; 