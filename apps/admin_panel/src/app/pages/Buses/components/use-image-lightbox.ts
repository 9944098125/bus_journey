import { useState } from 'react';

export function useImageLightbox() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (images: string[]) => {
    if (!images.length) return;
    setLightboxImages(images);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  const openSingleImage = (imageUrl: string) => openLightbox([imageUrl]);

  const closeLightbox = () => setLightboxOpen(false);

  const showPrev = () =>
    setCurrentImageIndex(prev =>
      prev === 0 ? lightboxImages.length - 1 : prev - 1,
    );

  const showNext = () =>
    setCurrentImageIndex(prev =>
      prev === lightboxImages.length - 1 ? 0 : prev + 1,
    );

  return {
    lightboxOpen,
    lightboxImages,
    currentImageIndex,
    openLightbox,
    openSingleImage,
    closeLightbox,
    showPrev,
    showNext,
  };
}
