import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getBlob } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { ImageProcessingService } from './imageService';
import { ImageProcessingOptions } from '../../types/llm-vlm/types';

export interface UploadResult {
  url: string;
  thumbnailUrl: string | undefined;
  metadata: {
    size: number;
    format: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export class StorageService {
  private imageProcessingService: ImageProcessingService;

  constructor(options?: ImageProcessingOptions) {
    this.imageProcessingService = new ImageProcessingService(options);
  }

  async uploadImage(
    file: File,
    userId: string,
    itemId: string,
    generateThumbnail = true
  ): Promise<UploadResult> {
    try {
      // Process the image
      const processedImage = await this.imageProcessingService.processImage(file);

      // Generate a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const path = itemId.startsWith('temp_')
        ? `users/${userId}/temp/${itemId}/${filename}`
        : `users/${userId}/items/${itemId}/${filename}`;

      // Upload the processed image
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, processedImage.processedImage);
      const url = await getDownloadURL(storageRef);

      let thumbnailUrl: string | undefined;
      if (generateThumbnail) {
        // Generate and upload thumbnail
        const thumbnail = await this.imageProcessingService.generateThumbnail(
          processedImage.processedImage
        );
        const thumbnailPath = itemId.startsWith('temp_')
          ? `users/${userId}/temp/${itemId}/thumbnails/${filename}`
          : `users/${userId}/items/${itemId}/thumbnails/${filename}`;
        const thumbnailRef = ref(storage, thumbnailPath);
        await uploadBytes(thumbnailRef, thumbnail);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      return {
        url,
        thumbnailUrl,
        metadata: {
          size: processedImage.processedSize,
          format: processedImage.format,
          dimensions: processedImage.dimensions,
        },
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) {
        throw new Error('Image URL is required');
      }

      // Remove query parameters and decode the URL
      const urlWithoutParams = imageUrl.split('?')[0] || imageUrl;
      const decodedUrl = decodeURIComponent(urlWithoutParams);

      // Create a reference using the full URL
      const storageRef = ref(storage, decodedUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  async listImages(
    userId: string,
    itemId: string
  ): Promise<{ url: string; thumbnailUrl: string | undefined }[]> {
    try {
      const path = itemId.startsWith('temp_')
        ? `users/${userId}/temp/${itemId}`
        : `users/${userId}/items/${itemId}`;
      const listRef = ref(storage, path);
      const result = await listAll(listRef);

      const images = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { url, thumbnailUrl: undefined };
        })
      );

      // Get thumbnails if they exist
      const thumbnailPath = `${path}/thumbnails`;
      const thumbnailRef = ref(storage, thumbnailPath);
      try {
        const thumbnailResult = await listAll(thumbnailRef);
        const thumbnails = await Promise.all(
          thumbnailResult.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { url };
          })
        );

        // Match thumbnails with their corresponding images
        return images.map((image) => {
          const filename = image.url.split('/').pop();
          const thumbnail = thumbnails.find((t) => t.url.split('/').pop() === filename);
          return {
            ...image,
            thumbnailUrl: thumbnail?.url,
          };
        });
      } catch (error) {
        // If thumbnails don't exist, return just the images
        return images;
      }
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }

  async moveImage(oldPath: string, newPath: string): Promise<void> {
    try {
      // Get the file from the old location
      const oldRef = ref(storage, oldPath);
      const file = await getBlob(oldRef);

      // Upload to the new location
      const newRef = ref(storage, newPath);
      await uploadBytes(newRef, file);

      // Delete the old file
      await deleteObject(oldRef);

      // Move thumbnail if it exists
      const oldThumbnailPath = oldPath.replace(/\/([^/]+)$/, '/thumbnails/$1');
      const newThumbnailPath = newPath.replace(/\/([^/]+)$/, '/thumbnails/$1');

      try {
        const oldThumbnailRef = ref(storage, oldThumbnailPath);
        const thumbnailFile = await getBlob(oldThumbnailRef);
        const newThumbnailRef = ref(storage, newThumbnailPath);
        await uploadBytes(newThumbnailRef, thumbnailFile);
        await deleteObject(oldThumbnailRef);
      } catch (error) {
        // Ignore error if thumbnail doesn't exist
        console.error('No thumbnail to move:', error);
      }
    } catch (error) {
      console.error('Error moving image:', error);
      throw error;
    }
  }

  async moveAllImagesFromTempToPermanent(
    userId: string,
    tempItemId: string,
    newItemId: string
  ): Promise<string[]> {
    // Move all images from temp to permanent location and return new URLs
    const tempPath = `users/${userId}/temp/${tempItemId}`;
    const permPath = `users/${userId}/items/${newItemId}`;
    const tempRef = ref(storage, tempPath);
    const result = await listAll(tempRef);
    const newUrls: string[] = [];
    for (const item of result.items) {
      const filename = item.name;
      const oldPath = `${tempPath}/${filename}`;
      const newPath = `${permPath}/${filename}`;
      await this.moveImage(oldPath, newPath);
      const url = await getDownloadURL(ref(storage, newPath));
      newUrls.push(url);
    }
    // Optionally, delete the temp folder (not strictly needed)
    return newUrls;
  }
}
