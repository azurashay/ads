import React from 'react';
import { AdTemplate, AdElement } from '../../types/adTypes';

interface AdPreviewProps {
  template: AdTemplate;
  scale?: number;
}

const AdPreview: React.FC<AdPreviewProps> = ({ template, scale = 1 }) => {
  const { size, elements, background, alignment } = template;

  const containerStyle = {
    width: size.width * scale,
    height: size.height * scale,
    background: background.type === 'color' ? background.value : `url(${background.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const renderElement = (element: AdElement) => {
    if (!element.isVisible) return null;

    const elementStyle = {
      position: 'absolute' as const,
      left: element.position.x * scale,
      top: element.position.y * scale,
      fontSize: (element.style.fontSize || 16) * scale,
      color: element.style.color || '#000000',
      backgroundColor: element.style.backgroundColor || 'transparent',
      fontWeight: element.style.fontWeight || 'normal',
      textAlign: element.style.textAlign || 'left' as const,
      padding: '4px',
      borderRadius: '4px',
      maxWidth: '80%',
      wordWrap: 'break-word' as const,
    };

    switch (element.type) {
      case 'logo':
        return (
          <div key={element.id} style={elementStyle}>
            {element.imageUrl ? (
              <img 
                src={element.imageUrl} 
                alt="Logo" 
                className="max-w-full max-h-full object-contain"
                style={{ maxWidth: '60px', maxHeight: '60px' }}
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs">
                {element.content || 'LOGO'}
              </div>
            )}
          </div>
        );
      
      case 'title':
        return (
          <div key={element.id} style={elementStyle}>
            {element.content || 'Ad Title'}
          </div>
        );
      
      case 'subtitle':
        return (
          <div key={element.id} style={elementStyle}>
            {element.content || 'Ad Subtitle'}
          </div>
        );
      
      case 'button':
        return (
          <div key={element.id} style={elementStyle}>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              style={{ fontSize: elementStyle.fontSize }}
            >
              {element.content || 'Click Here'}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold mb-2">Preview</h3>
        <p className="text-sm text-gray-600">
          {size.name} ({size.width}x{size.height}) - {size.platform}
        </p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div style={containerStyle}>
          {elements.map(renderElement)}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Alignment: {alignment === 'center' ? 'Center' : alignment === 'right' ? 'Right' : 'Left'}</p>
        <p>Background: {background.type === 'color' ? 'Color' : 'Image'}</p>
      </div>
    </div>
  );
};

export default AdPreview; 