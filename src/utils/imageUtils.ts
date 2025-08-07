/**
 * Image Utilities for Ad Creator
 * Improved image handling for Canvas operations
 */

export interface ImageLoadResult {
  success: boolean;
  image?: HTMLImageElement;
  error?: string;
}

/**
 * Load an image with better error handling and timeout
 */
export const loadImage = (src: string, timeout: number = 5000): Promise<ImageLoadResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    // Set cross-origin for external images
    img.crossOrigin = 'anonymous';
    
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: 'Image load timeout'
      });
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve({
        success: true,
        image: img
      });
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: 'Failed to load image'
      });
    };

    img.src = src;
  });
};

/**
 * Convert Data URL to Blob URL for better Canvas compatibility
 */
export const dataUrlToBlobUrl = async (dataUrl: string): Promise<string> => {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting Data URL to Blob URL:', error);
    return dataUrl; // Fallback to original Data URL
  }
};

/**
 * Validate if an image URL is valid
 */
export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if it's a data URL
  if (url.startsWith('data:image/')) {
    return true;
  }
  
  // Check if it's a blob URL
  if (url.startsWith('blob:')) {
    return true;
  }
  
  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Get image dimensions from URL
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to get image dimensions'));
    };
    img.src = src;
  });
};

/**
 * Resize image to fit within specified dimensions while maintaining aspect ratio
 */
export const resizeImageToFit = (
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const { naturalWidth, naturalHeight } = img;
  
  let { width, height } = { width: naturalWidth, height: naturalHeight };
  
  if (width > maxWidth) {
    height = (height * maxWidth) / width;
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = (width * maxHeight) / height;
    height = maxHeight;
  }
  
  return { width, height };
};

/**
 * Create a fallback image when original fails to load
 */
export const createFallbackImage = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string = 'LOGO',
  fontSize: number = 16
): void => {
  // Draw background rectangle
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(x, y, width, height);
  
  // Draw border
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  
  // Draw text
  ctx.fillStyle = '#6b7280';
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2);
};

/**
 * Enhanced image loading for Canvas with multiple fallback strategies
 */
export const loadImageForCanvas = async (
  src: string,
  fallbackText?: string
): Promise<{ image?: HTMLImageElement; useFallback: boolean; error?: string }> => {
  // First try: Direct load
  const result = await loadImage(src);
  if (result.success && result.image) {
    return { image: result.image, useFallback: false };
  }
  
  // Second try: Convert Data URL to Blob URL
  if (src.startsWith('data:')) {
    try {
      const blobUrl = await dataUrlToBlobUrl(src);
      const blobResult = await loadImage(blobUrl);
      if (blobResult.success && blobResult.image) {
        return { image: blobResult.image, useFallback: false };
      }
    } catch (error) {
      console.warn('Failed to convert Data URL to Blob URL:', error);
    }
  }
  
  // Fallback: Return error for fallback handling
  return {
    useFallback: true,
    error: result.error || 'Image failed to load'
  };
};

/**
 * Generate ad image from template
 */
export const generateAdImage = async (template: any): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  canvas.width = template.size.width;
  canvas.height = template.size.height;
  
  // Draw background
  if (template.background.type === 'color') {
    ctx.fillStyle = template.background.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (template.background.type === 'image') {
    try {
      const imageResult = await loadImageForCanvas(template.background.value);
      if (imageResult.image) {
        ctx.drawImage(imageResult.image, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } catch (error) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw elements
  const promises: Promise<void>[] = [];
  
  template.elements.forEach((element: any) => {
    if (!element.isVisible) return;
    
    if (element.type === 'logo' && element.imageUrl) {
      const promise = new Promise<void>(async (resolve) => {
        try {
          const imageResult = await loadImageForCanvas(element.imageUrl, element.content);
          
          if (imageResult.image) {
            ctx.drawImage(imageResult.image, element.position.x, element.position.y, 60, 60);
          } else {
            createFallbackImage(
              ctx,
              element.position.x,
              element.position.y,
              60,
              60,
              element.content,
              element.style.fontSize || 16
            );
          }
        } catch (error) {
          ctx.font = `${element.style.fontSize || 16}px Arial`;
          ctx.fillStyle = element.style.color || '#000000';
          ctx.fillText(element.content, element.position.x, element.position.y + (element.style.fontSize || 16));
        }
        resolve();
      });
      promises.push(promise);
    } else {
      ctx.font = `${element.style.fontSize || 16}px Arial`;
      ctx.fillStyle = element.style.color || '#000000';
      ctx.fillText(element.content, element.position.x, element.position.y + (element.style.fontSize || 16));
    }
  });
  
  await Promise.all(promises);
  
  return canvas.toDataURL('image/jpeg', 0.9);
}; 