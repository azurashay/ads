# Ad Creator System

Advanced digital ad creation system with support for multiple platforms.

## Main Features

### 🎯 Ad Sizes
- **Google Ads**: Search Ads, Display Ads, Responsive Display
- **Facebook & Instagram**: Feed Ads, Stories, Carousel
- **LinkedIn**: Sponsored Content, Message Ads
- **Twitter/X**: Promoted Tweets
- **TikTok**: In-Feed, TopView

### ✏️ Advanced Editor
- Ad size selection by platform
- Element editing (logo, title, subtitle, button)
- Background settings (color or image)
- Element alignment
- Real-time preview
- Image upload with drag & drop
- Enhanced image handling for Canvas

### 🎨 Design
- Modern and accessible user interface
- Responsive design
- Accurate preview
- Professional styling

## Installation and Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── AdEditor/          # Main ad editor
│   ├── AdPreview/         # Preview component
│   └── common/            # Shared components
├── types/                 # TypeScript definitions
├── utils/                 # Helper functions
└── hooks/                 # React Hooks
```

## Technologies

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Heroicons** for icons

## Current Features

- ✅ Create ads with multiple platforms
- ✅ Upload logo and background images
- ✅ Real-time preview
- ✅ Download generated ads as JPG
- ✅ Save templates locally
- ✅ Export templates as JSON
- ✅ Enhanced image handling for Canvas
- ✅ Responsive design

## Future Features

- [ ] Load saved templates
- [ ] Ready template library
- [ ] Share ads
- [ ] Edit history
- [ ] Video support
- [ ] Animations
- [ ] Automatic optimization
- [ ] Cloud storage

## Contributing

We welcome contributions! Please create an Issue or Pull Request.

## License

MIT License
