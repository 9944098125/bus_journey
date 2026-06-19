import React, { RefObject } from 'react';
import { Camera } from 'lucide-react';

import { cn } from 'utils/twm';

import { ACCEPTED_IMAGE_TYPES } from './constants';

type ProfilePictureUploadProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  previewUrl: string | null;
  selectedImage: File | null;
  imageError: string | null;
  isDragging: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onRemove: () => void;
};

export function ProfilePictureUpload({
  fileInputRef,
  previewUrl,
  selectedImage,
  imageError,
  isDragging,
  onFileChange,
  onDrop,
  onDragEnter,
  onDragLeave,
  onRemove,
}: ProfilePictureUploadProps) {
  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            openFilePicker();
          }
        }}
        onClick={openFilePicker}
        onDragOver={event => {
          event.preventDefault();
          onDragEnter();
        }}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          'group relative flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all duration-300',
          isDragging
            ? 'scale-105 border-[#722f37] bg-[#fdf5f5]'
            : 'border-[#d4a5ad] bg-[#faf0f0] hover:border-[#722f37] hover:bg-[#fdf5f5]',
          imageError && 'border-red-400',
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#722f37]/70">
            <Camera className="size-7" />
            <span className="text-[10px] font-medium">Add photo</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-[#5c0a1a]/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-6 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex items-center gap-3 text-xs text-[#722f37]/70">
        <span>Optional · max 5 MB</span>
        {selectedImage && (
          <button
            type="button"
            onClick={onRemove}
            className="font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {imageError && (
        <p className="text-[10px] font-poppins font-medium text-red-600">
          {imageError}
        </p>
      )}
    </div>
  );
}
