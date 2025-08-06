import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageChange: (imageUrl: string) => void;
  currentImage?: string;
  placeholder?: string;
  aspectRatio?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageChange, 
  currentImage, 
  placeholder = "Upload Image",
  aspectRatio = "1:1"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    onImageChange('');
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-neutral-2 hover:border-neutral-5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {previewUrl ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-32 object-contain rounded border"
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <button
              onClick={handleClick}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Change Image
            </button>
          </div>
        ) : (
          <div onClick={handleClick} className="cursor-pointer">
            <div className="w-16 h-16 bg-neutral-2 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg className="w-8 h-8 text-neutral-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm text-neutral-6">{placeholder}</p>
            <p className="text-xs text-neutral-5 mt-1">Click to upload or drag and drop</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 