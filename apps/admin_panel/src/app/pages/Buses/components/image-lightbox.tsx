import React from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  open: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ImageLightbox({
  open,
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  if (!open) return null;

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <button
        className="absolute right-4 top-4 z-50 p-2 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 hover:text-gray-300"
            onClick={e => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70 hover:text-gray-300"
            onClick={e => {
              e.stopPropagation();
              onNext();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Full size ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        />
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
