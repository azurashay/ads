import React, { useState } from 'react';
import './App.css';
import AdSizeDropdown from './components/common/AdSizeDropdown';
import ImageUploader from './components/common/ImageUploader';
import BackgroundEditor from './components/common/BackgroundEditor';

// Icons (using simple SVG icons as placeholders)
const DragIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 6H16M8 12H16M8 18H16" stroke="#334E68" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M11.716 7.516L12.484 8.284L5.484 15.284H4.716V14.516L11.716 7.516Z" fill="#334E68"/>
  </svg>
);

const ToggleOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="6" fill="#00A0FF"/>
    <circle cx="16" cy="12" r="4" fill="white"/>
  </svg>
);

const ToggleOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="6" fill="#D9E2EC"/>
    <circle cx="8" cy="12" r="4" fill="white"/>
  </svg>
);

const AlignTopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 11H16V13H8V11ZM8 7H16V9H8V7ZM8 15H12V17H8V15Z" fill="#334E68"/>
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 9H16V11H8V9ZM8 13H16V15H8V13ZM8 17H12V19H8V17Z" fill="#334E68"/>
  </svg>
);

const AlignBottomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 9H16V11H8V9ZM8 13H16V15H8V13ZM8 17H12V19H8V17Z" fill="#334E68"/>
  </svg>
);

const ExpandMoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7L10 12L15 7" stroke="#334E68" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Element {
  id: string;
  type: string;
  visible: boolean;
  content: string;
  color?: string;
  image?: string;
}

interface AdSize {
  id: string;
  width: number;
  height: number;
  name: string;
  platform: string;
  description: string;
  aspectRatio: string;
}

function App() {
  const [alignment, setAlignment] = useState<'top' | 'center' | 'bottom'>('center');
  const [selectedAdSize, setSelectedAdSize] = useState<AdSize | null>(null);
  const [elements, setElements] = useState<Element[]>([
    { id: 'logo', type: 'logo', visible: true, content: 'Landify', image: '' },
    { id: 'title', type: 'title', visible: true, content: 'Your Cloud Is Growing. Is Your Security Keeping Up?' },
    { id: 'subtitle', type: 'subtitle', visible: true, content: 'Protect your enterprise from the inside out — with real-time threat detection, zero trust access, and automated compliance.' },
    { id: 'button', type: 'button', visible: true, content: 'Book Your Demo Now' },
    { id: 'background', type: 'background', visible: true, content: '', color: '#00A0FF', image: '' }
  ]);

  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOverElement, setDragOverElement] = useState<string | null>(null);
  const [editingElement, setEditingElement] = useState<string | null>(null);

  const handleElementChange = (elementId: string, field: string, value: any) => {
    setElements(prev => prev.map(element =>
      element.id === elementId ? { ...element, [field]: value } : element
    ));
  };

  const handleToggleVisibility = (elementId: string) => {
    setElements(prev => prev.map(element =>
      element.id === elementId ? { ...element, visible: !element.visible } : element
    ));
  };

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedElement(null);
    setDragOverElement(null);
  };

  const handleDragOver = (e: React.DragEvent, elementId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverElement(elementId);
  };

  const handleDragLeave = () => {
    setDragOverElement(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedElement || draggedElement === targetId) return;

    const draggedIndex = elements.findIndex(el => el.id === draggedElement);
    const targetIndex = elements.findIndex(el => el.id === targetId);

    const newElements = [...elements];
    const [draggedElementData] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, draggedElementData);

    setElements(newElements);
    setDraggedElement(null);
    setDragOverElement(null);
  };

  const handleAdSizeChange = (size: AdSize) => {
    setSelectedAdSize(size);
    console.log('Selected ad size:', size);
  };

  const handleLogoImageChange = (imageUrl: string) => {
    handleElementChange('logo', 'image', imageUrl);
  };

  const handleBackgroundChange = (type: 'color' | 'image', value: string) => {
    if (type === 'color') {
      handleElementChange('background', 'color', value);
      handleElementChange('background', 'image', '');
    } else {
      handleElementChange('background', 'image', value);
      handleElementChange('background', 'color', '');
    }
  };

  const renderElement = (element: Element) => {
    const isDragging = draggedElement === element.id;
    const isDragOver = dragOverElement === element.id;
    const isEditing = editingElement === element.id;

    return (
      <div
        key={element.id}
        draggable
        onDragStart={(e) => handleDragStart(e, element.id)}
        onDragEnd={handleDragEnd}
        onDragOver={(e) => handleDragOver(e, element.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, element.id)}
        className={`draggable-element ${isDragging ? 'dragging' : ''} ${!element.visible ? 'element-hidden' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="drag-handle">
            <DragIcon />
          </div>
          <div className={`flex-1 bg-neutral-1 rounded-md p-2.5 drop-zone ${isDragOver ? 'drag-over' : ''}`}>
            {element.type === 'logo' && (
              <div className="flex items-end justify-between">
                <div className="w-20">
                  <div className="text-xs font-bold text-neutral-5 mb-1">Logo</div>
                  {element.image ? (
                    <div className="h-5 rounded overflow-hidden">
                      <img src={element.image} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-5 bg-blue-100 rounded flex items-center justify-center text-xs">
                      {element.content}
                    </div>
                  )}
                </div>
                <button 
                  className="p-1"
                  onClick={() => setEditingElement(isEditing ? null : element.id)}
                >
                  <EditIcon />
                </button>
              </div>
            )}

            {element.type === 'title' && (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-5 mb-1.5">Title</div>
                  <div className="bg-neutral-0 border border-neutral-2 rounded px-3 py-2">
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                      className="w-full text-sm text-neutral-6 outline-none"
                      placeholder="Enter title"
                    />
                  </div>
                </div>
                <button 
                  className="p-1 toggle-switch"
                  onClick={() => handleToggleVisibility(element.id)}
                >
                  {element.visible ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </button>
              </div>
            )}

            {element.type === 'subtitle' && (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold text-neutral-5 mb-1.5">Subtitle</div>
                  <div className="bg-neutral-0 border border-neutral-2 rounded px-3 py-2">
                    <textarea
                      value={element.content}
                      onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                      className="w-full text-sm text-neutral-6 outline-none resize-none"
                      placeholder="Enter subtitle"
                      rows={3}
                    />
                  </div>
                </div>
                <button 
                  className="p-1 toggle-switch"
                  onClick={() => handleToggleVisibility(element.id)}
                >
                  {element.visible ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </button>
              </div>
            )}

            {element.type === 'button' && (
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-neutral-5">Primary Button</span>
                    <ExpandMoreIcon />
                  </div>
                  <div className="bg-neutral-0 border border-neutral-2 rounded px-3 py-2">
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) => handleElementChange(element.id, 'content', e.target.value)}
                      className="w-full text-sm text-neutral-6 outline-none"
                      placeholder="Enter button text"
                    />
                  </div>
                </div>
                <button 
                  className="p-1 toggle-switch"
                  onClick={() => handleToggleVisibility(element.id)}
                >
                  {element.visible ? <ToggleOnIcon /> : <ToggleOffIcon />}
                </button>
              </div>
            )}

            {element.type === 'background' && (
              <div className="flex items-end justify-between">
                <div className="w-32">
                  <div className="text-xs font-bold text-neutral-5 mb-1">Background</div>
                  <div 
                    className="h-20 rounded border border-neutral-2 overflow-hidden"
                    style={{ 
                      backgroundColor: element.color || 'transparent',
                      backgroundImage: element.image ? `url(${element.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
                <button 
                  className="p-1"
                  onClick={() => setEditingElement(isEditing ? null : element.id)}
                >
                  <EditIcon />
                </button>
              </div>
            )}

            {/* Edit Modal for Logo and Background */}
            {isEditing && (
              <div className="mt-4 p-4 bg-neutral-0 border border-neutral-2 rounded-lg">
                {element.type === 'logo' && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-6 mb-3">Edit Logo</h4>
                    <ImageUploader
                      onImageChange={handleLogoImageChange}
                      currentImage={element.image}
                      placeholder="Upload Logo Image"
                      aspectRatio="1:1"
                    />
                  </div>
                )}
                
                {element.type === 'background' && (
                  <div>
                    <h4 className="text-sm font-medium text-neutral-6 mb-3">Edit Background</h4>
                    <BackgroundEditor
                      onBackgroundChange={handleBackgroundChange}
                      currentType={element.image ? 'image' : 'color'}
                      currentValue={element.image || element.color || '#00A0FF'}
                    />
                  </div>
                )}
                
                <button
                  onClick={() => setEditingElement(null)}
                  className="mt-3 px-3 py-1 bg-neutral-2 text-neutral-6 rounded text-sm hover:bg-neutral-1 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-0 font-open-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="p-4 border-b-4 border-primary">
          <h1 className="text-xl font-semibold text-neutral-6">Edit ads</h1>
        </div>

        <div className="p-4 space-y-5">
          {/* Ad Size Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-6 mb-2">
              Ad Size
            </label>
            <AdSizeDropdown 
              onSizeChange={handleAdSizeChange}
              selectedSize={selectedAdSize}
            />
          </div>

          {/* Alignment Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-6">Ads alignment</span>
            <div className="flex bg-neutral-2 rounded-full p-1">
              <button
                onClick={() => setAlignment('top')}
                className={`p-1 rounded-full ${alignment === 'top' ? 'bg-neutral-0' : ''}`}
              >
                <AlignTopIcon />
              </button>
              <button
                onClick={() => setAlignment('center')}
                className={`p-1 rounded-full ${alignment === 'center' ? 'bg-neutral-0' : ''}`}
              >
                <AlignCenterIcon />
              </button>
              <button
                onClick={() => setAlignment('bottom')}
                className={`p-1 rounded-full ${alignment === 'bottom' ? 'bg-neutral-0' : ''}`}
              >
                <AlignBottomIcon />
              </button>
            </div>
          </div>

          {/* Elements */}
          <div className="space-y-3">
            {elements.map(renderElement)}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-1 px-6 py-2 rounded-b-md">
          <div className="flex justify-end gap-4">
            <button className="px-4 py-1.5 bg-neutral-2 text-neutral-6 rounded text-sm font-semibold">
              Cancel
            </button>
            <button className="px-4 py-1.5 bg-primary text-neutral-0 rounded text-base font-semibold">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
