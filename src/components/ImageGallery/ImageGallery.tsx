import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/image-processing/storageService';
import { useAuth } from '../../context/AuthContext';

export interface ImageGalleryProps {
  itemId: string;
  userId?: string;
  selectedImageUrls?: string[];
  onImageSelect?: (url: string) => void;
  onImagesChange?: (urls: string[]) => void;
  onImageDelete?: (url: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  itemId,
  userId,
  onImageSelect,
  selectedImageUrls,
  onImagesChange,
  onImageDelete,
}) => {
  const [images, setImages] = useState<{ url: string; thumbnailUrl: string | undefined }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const storageService = new StorageService();
  const MAX_IMAGES = 4;

  useEffect(() => {
    const currentUserId = userId || user?.uid;
    if (currentUserId && itemId) {
      loadImages(currentUserId);
    }
  }, [userId, user, itemId]);

  const loadImages = async (currentUserId: string) => {
    try {
      const imageList = await storageService.listImages(currentUserId, itemId);
      setImages(imageList);
      if (onImagesChange) {
        onImagesChange(imageList.map((img) => img.url));
      }
    } catch (err) {
      setError('Failed to load images');
      console.error('Error loading images:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const currentUserId = userId || user?.uid;
    if (!files || !currentUserId) return;

    setIsUploading(true);
    setError(null);

    try {
      if (images.length >= MAX_IMAGES) {
        setError('Maximum number of images reached');
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          await storageService.uploadImage(file, currentUserId, itemId);
        }
      }
      await loadImages(currentUserId);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (imageUrl: string) => {
    if (!imageUrl) {
      console.error('Cannot delete image: URL is undefined');
      return;
    }
    if (onImageDelete) {
      if (window.confirm('Are you sure you want to remove this image from the item?')) {
        onImageDelete(imageUrl);
        setImages((prev) => prev.filter((img) => img.url !== imageUrl));
        if (onImageSelect && selectedImageUrls && selectedImageUrls.includes(imageUrl)) {
          onImageSelect('');
        }
      }
    } else {
      // fallback: just remove from UI
      setImages((prev) => prev.filter((img) => img.url !== imageUrl));
      if (onImageSelect && selectedImageUrls && selectedImageUrls.includes(imageUrl)) {
        onImageSelect('');
      }
    }
  };

  const handleImageClick = (url: string) => {
    if (selectedImageUrls && selectedImageUrls.includes(url)) {
      // If clicking the already selected image, deselect it
      onImageSelect?.('');
    } else {
      onImageSelect?.(url);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="cursor-pointer bg-white border border-blue-600 text-blue-600 font-semibold shadow hover:bg-blue-50 transition-colors px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {isUploading ? 'Uploading...' : 'Add Images'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading || images.length >= MAX_IMAGES}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative group ${
              selectedImageUrls && selectedImageUrls.includes(image.url)
                ? 'ring-2 ring-blue-500'
                : ''
            }`}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={`Item image ${index + 1}`}
              className="w-full h-32 object-cover rounded cursor-pointer"
              onClick={() => handleImageClick(image.url)}
            />
            <button
              type="button"
              onClick={() => handleDelete(image.url)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
