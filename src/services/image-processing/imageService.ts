import type { ImageProcessingOptions, ImageProcessingResult } from '../../types/llm-vlm/types';

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

  private validateImage(file: File): void {
    if (!this.options.allowedFormats?.includes(file.type)) {
      throw new Error(
        `Unsupported image format. Allowed formats: ${this.options.allowedFormats?.join(', ')}`
      );
    }

    if (file.size > (this.options.maxSize || 0)) {
      throw new Error(`Image size exceeds maximum allowed size of ${this.options.maxSize} bytes`);
    }
  }

  private async resizeImage(imageData: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        let { width, height } = img;
        const maxWidth = this.options.resizeOptions?.width || 1024;
        const maxHeight = this.options.resizeOptions?.height || 1024;

        if (this.options.resizeOptions?.maintainAspectRatio) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        } else {
          width = maxWidth;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          'image/jpeg',
          0.9
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(imageData);
    });
  }

  public async processImage(file: File): Promise<ImageProcessingResult> {
    this.validateImage(file);

    const processedImage = await this.resizeImage(file);
    const dimensions = await this.getImageDimensions(processedImage);

    return {
      processedImage,
      originalSize: file.size,
      processedSize: processedImage.size,
      format: file.type,
      dimensions,
    };
  }

  private async getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  }

  public async processImages(files: File[]): Promise<ImageProcessingResult[]> {
    return Promise.all(files.map((file) => this.processImage(file)));
  }
}
