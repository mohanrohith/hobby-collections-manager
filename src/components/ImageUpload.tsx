import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        // Create a unique filename
        const filename = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `images/${filename}`);

        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);
        onImageUploaded(downloadUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
        setError('Error uploading image. Please try again.');
      } finally {
        setUploading(false);
      }
    },
    [onImageUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {currentImageUrl ? (
          <div className="relative">
            <img src={currentImageUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            <div className="mt-2 text-sm text-gray-500">
              {uploading ? 'Uploading...' : 'Click or drag to replace image'}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-gray-500">
              {uploading ? (
                'Uploading...'
              ) : isDragActive ? (
                'Drop the image here'
              ) : (
                <>
                  <p>Drag and drop an image here, or click to select</p>
                  <p className="text-sm mt-1">Supports JPG, PNG, GIF, WEBP (max 5MB)</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
