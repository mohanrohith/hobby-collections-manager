import { ImageProcessingOptions, ImageProcessingResult } from '../../types/llm-vlm/types';

export class ImageProcessingService {
  private options: ImageProcessingOptions;

  constructor(options: ImageProcessingOptions = {}) {
    this.options = {
      maxSize: 5 * 1024 * 1024, // 5MB default
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      resizeOptions: {
        width: 1024,
        height: 1024,
        maintainAspectRatio: true,
      },
      ...options,
    };
  }

  async processImage(file: File): Promise<ImageProcessingResult> {
    // Validate file size
    if (file.size > (this.options.maxSize || 5 * 1024 * 1024)) {
      throw new Error('File size exceeds maximum allowed size');
    }

    // Validate file format
    if (this.options.allowedFormats && !this.options.allowedFormats.includes(file.type)) {
      throw new Error('File format not supported');
    }

    // Create a blob URL for the image
    const blobUrl = URL.createObjectURL(file);

    try {
      // Load the image
      const img = await this.loadImage(blobUrl);

      // Get original dimensions
      const originalDimensions = {
        width: img.width,
        height: img.height,
      };

      // Resize if needed
      const resizedImage = await this.resizeImage(img);

      // Convert to blob
      const processedBlob = await this.imageToBlob(resizedImage, file.type);

      return {
        processedImage: processedBlob,
        originalSize: file.size,
        processedSize: processedBlob.size,
        format: file.type,
        dimensions: originalDimensions,
      };
    } finally {
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private async resizeImage(img: HTMLImageElement): Promise<HTMLImageElement> {
    const { width, height, maintainAspectRatio } = this.options.resizeOptions || {};

    if (!width && !height) {
      return img;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    let newWidth = width || img.width;
    let newHeight = height || img.height;

    if (maintainAspectRatio) {
      const aspectRatio = img.width / img.height;
      if (width && height) {
        if (width / height > aspectRatio) {
          newWidth = height * aspectRatio;
        } else {
          newHeight = width / aspectRatio;
        }
      } else if (width) {
        newHeight = width / aspectRatio;
      } else if (height) {
        newWidth = height * aspectRatio;
      }
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const resizedImg = new Image();
    resizedImg.src = canvas.toDataURL(img.src);
    return resizedImg;
  }

  private async imageToBlob(img: HTMLImageElement, type: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image to blob'));
          }
        },
        type,
        0.9
      );
    });
  }
}
