/**
 * Error Handling Utilities
 * Centralized error handling for the Ad Creator
 */

export interface AppError {
  message: string;
  type: 'image' | 'canvas' | 'storage' | 'network' | 'validation';
  details?: any;
}

/**
 * Create a standardized error object
 */
export const createError = (message: string, type: AppError['type'], details?: any): AppError => {
  return {
    message,
    type,
    details
  };
};

/**
 * Handle image loading errors
 */
export const handleImageError = (error: any, imageUrl: string): AppError => {
  console.error('Image loading error:', error);
  
  if (error.message?.includes('timeout')) {
    return createError('Image load timeout. Please try again.', 'image', { imageUrl });
  }
  
  if (error.message?.includes('CORS')) {
    return createError('Image blocked by CORS policy. Please use a different image.', 'image', { imageUrl });
  }
  
  return createError('Failed to load image. Please check the image URL.', 'image', { imageUrl });
};

/**
 * Handle Canvas errors
 */
export const handleCanvasError = (error: any): AppError => {
  console.error('Canvas error:', error);
  
  if (error.message?.includes('tainted')) {
    return createError('Canvas is tainted due to CORS. Please use different images.', 'canvas');
  }
  
  return createError('Failed to generate image. Please try again.', 'canvas');
};

/**
 * Handle storage errors
 */
export const handleStorageError = (error: any, operation: string): AppError => {
  console.error('Storage error:', error);
  
  if (error.name === 'QuotaExceededError') {
    return createError('Storage quota exceeded. Please clear some data.', 'storage', { operation });
  }
  
  return createError(`Failed to ${operation}. Please try again.`, 'storage', { operation });
};

/**
 * Show user-friendly error message
 */
export const showError = (error: AppError): void => {
  const messages = {
    image: 'Image Error',
    canvas: 'Canvas Error', 
    storage: 'Storage Error',
    network: 'Network Error',
    validation: 'Validation Error'
  };
  
  const title = messages[error.type] || 'Error';
  alert(`${title}: ${error.message}`);
};

/**
 * Validate ad template
 */
export const validateAdTemplate = (template: any): AppError | null => {
  if (!template) {
    return createError('Template is required.', 'validation');
  }
  
  if (!template.name || template.name.trim() === '') {
    return createError('Ad name is required.', 'validation');
  }
  
  if (!template.size || !template.size.width || !template.size.height) {
    return createError('Valid ad size is required.', 'validation');
  }
  
  if (!template.elements || !Array.isArray(template.elements)) {
    return createError('Ad elements are required.', 'validation');
  }
  
  const visibleElements = template.elements.filter((el: any) => el.isVisible);
  if (visibleElements.length === 0) {
    return createError('At least one visible element is required.', 'validation');
  }
  
  return null;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}; 