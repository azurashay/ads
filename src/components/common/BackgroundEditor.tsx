import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

interface BackgroundEditorProps {
  onBackgroundChange: (type: 'color' | 'image', value: string) => void;
  currentType: 'color' | 'image';
  currentValue: string;
}

const BackgroundEditor: React.FC<BackgroundEditorProps> = ({
  onBackgroundChange,
  currentType,
  currentValue
}) => {
  const [activeTab, setActiveTab] = useState<'color' | 'image'>(currentType);

  const presetColors = [
    '#00A0FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
    '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9'
  ];

  const handleColorChange = (color: string) => {
    onBackgroundChange('color', color);
  };

  const handleImageChange = (imageUrl: string) => {
    onBackgroundChange('image', imageUrl);
  };

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex border-b border-neutral-2">
        <button
          onClick={() => setActiveTab('color')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'color'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-5 hover:text-neutral-6'
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'image'
              ? 'text-primary border-b-2 border-primary'
              : 'text-neutral-5 hover:text-neutral-6'
          }`}
        >
          Image
        </button>
      </div>

      {/* Color Tab */}
      {activeTab === 'color' && (
        <div className="space-y-4">
          {/* Custom Color Picker */}
          <div>
            <label className="block text-sm font-medium text-neutral-6 mb-2">
              Custom Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentType === 'color' ? currentValue : '#00A0FF'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 border border-neutral-2 rounded cursor-pointer"
              />
              <input
                type="text"
                value={currentType === 'color' ? currentValue : '#00A0FF'}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-2 rounded text-sm font-mono"
                placeholder="#00A0FF"
              />
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium text-neutral-6 mb-2">
              Preset Colors
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    currentType === 'color' && currentValue === color
                      ? 'border-neutral-6 scale-110'
                      : 'border-neutral-2 hover:border-neutral-5'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-neutral-6 mb-2">
              Preview
            </label>
            <div 
              className="w-full h-20 rounded border border-neutral-2"
              style={{ backgroundColor: currentType === 'color' ? currentValue : '#00A0FF' }}
            />
          </div>
        </div>
      )}

      {/* Image Tab */}
      {activeTab === 'image' && (
        <div className="space-y-4">
          <ImageUploader
            onImageChange={handleImageChange}
            currentImage={currentType === 'image' ? currentValue : undefined}
            placeholder="Upload Background Image"
            aspectRatio="16:9"
          />
          
          {/* Preview */}
          {currentType === 'image' && currentValue && (
            <div>
              <label className="block text-sm font-medium text-neutral-6 mb-2">
                Preview
              </label>
              <div className="w-full h-20 rounded border border-neutral-2 overflow-hidden">
                <img
                  src={currentValue}
                  alt="Background Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BackgroundEditor; 