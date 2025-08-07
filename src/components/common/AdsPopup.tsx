import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AdTemplate } from '../../types/adTypes';
import { generateAdImage } from '../../utils/imageUtils';

interface AdsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  templates: AdTemplate[];
}

interface GeneratedAd {
  template: AdTemplate;
  imageUrl: string;
  name: string;
  size: string;
  platform: string;
}

const AdsPopup: React.FC<AdsPopupProps> = ({ isOpen, onClose, templates }) => {
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);

  const generateAllAds = async () => {
    setIsGenerating(true);
    setCurrentProgress(0);
    
    const ads: GeneratedAd[] = [];
    
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      try {
        const imageUrl = await generateAdImage(template);
        ads.push({
          template,
          imageUrl,
          name: template.name,
          size: `${template.size.width}x${template.size.height}`,
          platform: template.size.platform
        });
      } catch (error) {
        console.error(`Error generating ad for ${template.name}:`, error);
        // Add template without image
        ads.push({
          template,
          imageUrl: '',
          name: template.name,
          size: `${template.size.width}x${template.size.height}`,
          platform: template.size.platform
        });
      }
      
      setCurrentProgress(((i + 1) / templates.length) * 100);
    }
    
    setGeneratedAds(ads);
    setIsGenerating(false);
  };

  const handleDownloadAll = () => {
    generatedAds.forEach((ad, index) => {
      if (ad.imageUrl) {
        const a = document.createElement('a');
        a.href = ad.imageUrl;
        a.download = `ad-${ad.name}-${ad.size}-${index + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  };

  const handleDownloadSingle = (ad: GeneratedAd, index: number) => {
    if (ad.imageUrl) {
      const a = document.createElement('a');
      a.href = ad.imageUrl;
      a.download = `ad-${ad.name}-${ad.size}-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  React.useEffect(() => {
    if (isOpen && templates.length > 0 && generatedAds.length === 0) {
      generateAllAds();
    }
  }, [isOpen, templates]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                      📊 Generated Ads ({templates.length} templates)
                    </Dialog.Title>

                    {isGenerating && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Generating ads...</span>
                          <span className="text-sm text-gray-500">{Math.round(currentProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${currentProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {generatedAds.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">
                            {generatedAds.length} ads generated successfully
                          </p>
                          <button
                            onClick={handleDownloadAll}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            📥 Download All
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {generatedAds.map((ad, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium text-gray-900">{ad.name}</h4>
                                  <p className="text-sm text-gray-500">{ad.platform} • {ad.size}</p>
                                </div>
                                <button
                                  onClick={() => handleDownloadSingle(ad, index)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                                >
                                  📥
                                </button>
                              </div>
                              
                              <div className="bg-white rounded border p-2">
                                {ad.imageUrl ? (
                                  <img
                                    src={ad.imageUrl}
                                    alt={`Generated ad ${ad.name}`}
                                    className="w-full h-auto max-h-32 object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">
                                    Failed to generate image
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isGenerating && generatedAds.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No ads to generate</p>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AdsPopup; 