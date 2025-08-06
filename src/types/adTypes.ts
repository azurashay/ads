export interface AdSize {
  id: string;
  width: number;
  height: number;
  name: string;
  platform: string;
  description: string;
  aspectRatio: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  sizes: AdSize[];
}

export interface AdElement {
  id: string;
  type: 'logo' | 'title' | 'subtitle' | 'button' | 'background';
  content: string;
  imageUrl?: string; // For logo elements that can have an image
  isVisible: boolean;
  position: {
    x: number;
    y: number;
  };
  style: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface AdTemplate {
  id: string;
  name: string;
  size: AdSize;
  elements: AdElement[];
  background: {
    type: 'color' | 'image';
    value: string;
  };
  alignment: 'left' | 'center' | 'right';
}

export interface AdEditorState {
  selectedSize: AdSize | null;
  template: AdTemplate;
  isEditing: boolean;
} 