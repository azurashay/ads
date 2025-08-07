import React, { useState } from 'react';
import { AdSize, AdTemplate } from '../../types/adTypes';
import AdSizeSelector from '../common/AdSizeSelector';
import AdPreview from '../AdPreview/AdPreview';
import ImageUploader from '../common/ImageUploader';
import { loadImageForCanvas, createFallbackImage } from '../../utils/imageUtils';
import { saveAdTemplate, exportAdTemplate } from '../../utils/adStorage';
import AdsPopup from '../common/AdsPopup';
import { generateAdTemplates, createSampleConfig, AdConfig } from '../../utils/adGenerator';

const AdEditor: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<AdSize | null>(null);
  const [isAdCreated, setIsAdCreated] = useState(false);
  const [createdAd, setCreatedAd] = useState<AdTemplate | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isAdsPopupOpen, setIsAdsPopupOpen] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<AdTemplate[]>([]);
  const [template, setTemplate] = useState<AdTemplate>({
    id: '1',
    name: 'New Ad',
    size: {
      id: 'default',
      width: 300,
      height: 250,
      name: 'Default',
      platform: 'Default',
      description: 'Default size',
      aspectRatio: '6:5'
    },
    elements: [
      {
        id: 'logo-1',
        type: 'logo',
        content: 'LOGO',
        imageUrl: '',
        isVisible: true,
        position: { x: 10, y: 10 },
        style: { fontSize: 16, color: '#000000' }
      },
      {
        id: 'title-1',
        type: 'title',
        content: 'Ad Title',
        isVisible: true,
        position: { x: 50, y: 50 },
        style: { fontSize: 24, color: '#000000', fontWeight: 'bold' }
      },
      {
        id: 'subtitle-1',
        type: 'subtitle',
        content: 'Ad Subtitle',
        isVisible: true,
        position: { x: 50, y: 90 },
        style: { fontSize: 16, color: '#666666' }
      },
      {
        id: 'button-1',
        type: 'button',
        content: 'Click Here',
        isVisible: true,
        position: { x: 50, y: 130 },
        style: { fontSize: 14, color: '#ffffff', backgroundColor: '#3b82f6' }
      }
    ],
    background: {
      type: 'color',
      value: '#ffffff'
    },
    alignment: 'center'
  });

  const handleSizeChange = (size: AdSize) => {
    setSelectedSize(size);
    setTemplate(prev => ({
      ...prev,
      size
    }));
  };

  const handleElementChange = (elementId: string, field: string, value: any) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.id === elementId
          ? { ...element, [field]: value }
          : element
      )
    }));
  };

  const handleBackgroundChange = (type: 'color' | 'image', value: string) => {
    setTemplate(prev => ({
      ...prev,
      background: { type, value }
    }));
  };

  const handleLogoImageChange = (imageUrl: string) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(element =>
        element.type === 'logo'
          ? { ...element, imageUrl }
          : element
      )
    }));
  };

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    setTemplate(prev => ({
      ...prev,
      alignment
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', template);
    setCreatedAd(template);
    setIsAdCreated(true);
    
    // Generate the image preview
    try {
      const imageUrl = await generateAdImage();
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image preview:', error);
    }
  };

  const generateAdImage = async (): Promise<string> => {
    if (!createdAd) return '';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = createdAd.size.width;
    canvas.height = createdAd.size.height;
    
    // Enhanced function to draw elements with improved image handling
    const drawElements = async () => {
      const promises: Promise<void>[] = [];
      
      createdAd!.elements.forEach(element => {
        if (!element.isVisible) return;
        
        if (element.type === 'logo' && element.imageUrl) {
          const promise = new Promise<void>(async (resolve) => {
            try {
              const imageResult = await loadImageForCanvas(element.imageUrl || '', element.content);
              
              if (imageResult.image) {
                // Successfully loaded image
                ctx.drawImage(imageResult.image, element.position.x, element.position.y, 60, 60);
              } else {
                // Use fallback
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
              console.error('Error loading logo image:', error);
              // Fallback to text
              ctx.font = `${element.style.fontSize || 16}px Arial`;
              ctx.fillStyle = element.style.color || '#000000';
              ctx.fillText(element.content, element.position.x, element.position.y + (element.style.fontSize || 16));
            }
            resolve();
          });
          promises.push(promise);
        } else {
          // Draw text elements
          ctx.font = `${element.style.fontSize || 16}px Arial`;
          ctx.fillStyle = element.style.color || '#000000';
          ctx.fillText(element.content, element.position.x, element.position.y + (element.style.fontSize || 16));
        }
      });
      
      await Promise.all(promises);
    };
    
    // Enhanced function to draw background with improved image handling
    const drawBackground = async () => {
      if (createdAd.background.type === 'color') {
        ctx.fillStyle = createdAd.background.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (createdAd.background.type === 'image') {
        return new Promise<void>(async (resolve) => {
          try {
            const imageResult = await loadImageForCanvas(createdAd.background.value);
            
            if (imageResult.image) {
              // Successfully loaded background image
              ctx.drawImage(imageResult.image, 0, 0, canvas.width, canvas.height);
            } else {
              // Fallback to white background
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          } catch (error) {
            console.error('Error loading background image:', error);
            // Fallback to white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          resolve();
        });
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    await drawBackground();
    await drawElements();
    
    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const handleDownloadAd = async () => {
    if (!createdAd) return;
    
    try {
      const imageDataUrl = await generateAdImage();
      if (imageDataUrl) {
        const a = document.createElement('a');
        a.href = imageDataUrl;
        a.download = `ad-${createdAd.name}-${createdAd.size.width}x${createdAd.size.height}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating ad image:', error);
      alert('Error generating ad image. Please try again.');
    }
  };

  const handleSaveTemplate = () => {
    if (!createdAd) return;
    
    try {
      saveAdTemplate(createdAd);
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  };

  const handleExportTemplate = () => {
    if (!createdAd) return;
    
    try {
      exportAdTemplate(createdAd);
    } catch (error) {
      console.error('Error exporting template:', error);
      alert('Error exporting template. Please try again.');
    }
  };

  const handleGenerateAds = () => {
    // Create configuration from current template
    const config: AdConfig = {
      name: template.name,
      title: template.elements.find(el => el.type === 'title')?.content || 'Ad Title',
      subtitle: template.elements.find(el => el.type === 'subtitle')?.content || 'Ad Subtitle',
      buttonText: template.elements.find(el => el.type === 'button')?.content || 'Click Here',
      logoImage: template.elements.find(el => el.type === 'logo')?.imageUrl || '',
      backgroundColor: template.background.type === 'color' ? template.background.value : '#ffffff',
      backgroundImage: template.background.type === 'image' ? template.background.value : undefined,
      platforms: ['Google Ads', 'Facebook & Instagram', 'LinkedIn', 'Twitter/X', 'TikTok'],
      sizes: []
    };
    
    // Generate templates for all platforms
    const templates = generateAdTemplates(config);
    setGeneratedTemplates(templates);
    setIsAdsPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Ad Creator System
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Ad Editor</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ad Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Size
                </label>
                <AdSizeSelector 
                  onSizeChange={handleSizeChange}
                  selectedSize={selectedSize}
                />
              </div>

              {/* Background Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Background
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="backgroundType"
                        value="color"
                        checked={template.background.type === 'color'}
                        onChange={() => handleBackgroundChange('color', template.background.value)}
                        className="mr-2"
                      />
                      Background Color
                    </label>
                    {template.background.type === 'color' && (
                      <input
                        type="color"
                        value={template.background.value}
                        onChange={(e) => handleBackgroundChange('color', e.target.value)}
                        className="mt-2 w-full h-10 border border-gray-300 rounded"
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="backgroundType"
                        value="image"
                        checked={template.background.type === 'image'}
                        onChange={() => handleBackgroundChange('image', template.background.value)}
                        className="mr-2"
                      />
                      Background Image
                    </label>
                    {template.background.type === 'image' && (
                      <div className="mt-2">
                        <ImageUploader
                          onImageChange={(imageUrl) => handleBackgroundChange('image', imageUrl)}
                          currentImage={template.background.value}
                          placeholder="Upload Background Image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Element Alignment
                </label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map((alignment) => (
                    <button
                      key={alignment}
                      type="button"
                      onClick={() => handleAlignmentChange(alignment)}
                      className={`px-4 py-2 rounded ${
                        template.alignment === alignment
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {alignment === 'center' ? 'Center' : alignment === 'right' ? 'Right' : 'Left'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Element Editing */}
              <div>
                <h3 className="text-lg font-medium mb-4">Edit Elements</h3>
                <div className="space-y-4">
                  {template.elements.map((element) => (
                    <div key={element.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">
                          {element.type === 'logo' ? 'Logo' :
                           element.type === 'title' ? 'Title' :
                           element.type === 'subtitle' ? 'Subtitle' : 'Button'}
                        </h4>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={element.isVisible}
                            onChange={(e) => handleElementChange(element.id, 'isVisible', e.target.checked)}
                            className="mr-2"
                          />
                          Show
                        </label>
                      </div>
                      
                      {element.isVisible && (
                        <div className="space-y-3">
                          {element.type === 'logo' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo Image
                              </label>
                              <ImageUploader
                                onImageChange={handleLogoImageChange}
                                currentImage={element.imageUrl}
                                placeholder="Upload Logo Image"
                              />
                            </div>
                          )}
                          
                          <input
                            type="text"
                            placeholder="Element content"
                            value={element.content}
                            onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                          
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Font size"
                              value={element.style.fontSize || 16}
                              onChange={(e) => handleElementChange(element.id, 'style', {
                                ...element.style,
                                fontSize: parseInt(e.target.value) || 16
                              })}
                              className="p-2 border border-gray-300 rounded"
                            />
                            
                            <input
                              type="color"
                              value={element.style.color || '#000000'}
                              onChange={(e) => handleElementChange(element.id, 'style', {
                                ...element.style,
                                color: e.target.value
                              })}
                              className="w-full h-10 border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors font-medium text-lg font-semibold"
                >
                  ✅ Create Ad
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAds}
                  className="flex-1 bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors font-medium text-lg font-semibold"
                >
                  🚀 Generate All Ads
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AdPreview template={template} scale={0.8} />
          </div>

          {/* Created Ad Section */}
          {isAdCreated && createdAd && (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-600">✅ Ad Created Successfully!</h2>
                <div className="space-x-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleDownloadAd}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    📥 Download Ad
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    💾 Save Template
                  </button>
                  <button
                    onClick={handleExportTemplate}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  >
                    📤 Export Template
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const imageUrl = await generateAdImage();
                        setGeneratedImageUrl(imageUrl);
                      } catch (error) {
                        console.error('Error regenerating image:', error);
                      }
                    }}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    🔄 Regenerate Image
                  </button>
                  <button
                    onClick={() => {
                      setIsAdCreated(false);
                      setCreatedAd(null);
                      setGeneratedImageUrl('');
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    ✏️ Edit Again
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ad Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ad Name:</strong> {createdAd.name}</p>
                    <p><strong>Size:</strong> {createdAd.size.width} x {createdAd.size.height}</p>
                    <p><strong>Platform:</strong> {createdAd.size.platform}</p>
                    <p><strong>Background Type:</strong> {createdAd.background.type === 'color' ? 'Color' : 'Image'}</p>
                    <p><strong>Alignment:</strong> {createdAd.alignment === 'center' ? 'Center' : createdAd.alignment === 'right' ? 'Right' : 'Left'}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Ad Elements:</h4>
                    <ul className="space-y-1 text-sm">
                      {createdAd.elements.filter(el => el.isVisible).map(element => (
                        <li key={element.id} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {element.type === 'logo' ? 'Logo' :
                           element.type === 'title' ? 'Title' :
                           element.type === 'subtitle' ? 'Subtitle' : 'Button'}: {element.content}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {generatedImageUrl ? (
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">Generated Image:</h4>
                        <img 
                          src={generatedImageUrl} 
                          alt="Generated Ad" 
                          className="max-w-full h-auto border border-gray-300 rounded"
                          style={{ maxHeight: '400px' }}
                        />
                      </div>
                    ) : (
                      <AdPreview template={createdAd} scale={1} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ads Popup */}
          <AdsPopup
            isOpen={isAdsPopupOpen}
            onClose={() => setIsAdsPopupOpen(false)}
            templates={generatedTemplates}
          />
        </div>
      </div>
    </div>
  );
};

export default AdEditor; 