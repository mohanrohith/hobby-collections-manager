import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ImageAnalysisResult, ImageProcessingResult } from '../../types/llm-vlm/types';
import { LLMService } from '../../services/llm-vlm/llmService';
import { ImageProcessingService } from '../../services/image-processing/imageService';

interface LLMContextType {
  isProcessing: boolean;
  error: string | null;
  analyzeImage: (file: File) => Promise<ImageAnalysisResult>;
  analyzeImages: (files: File[]) => Promise<ImageAnalysisResult[]>;
  processImage: (file: File) => Promise<ImageProcessingResult>;
  processImages: (files: File[]) => Promise<ImageProcessingResult[]>;
}

const LLMContext = createContext<LLMContextType | null>(null);

interface LLMProviderProps {
  children: React.ReactNode;
  llmConfig: {
    apiKey: string;
    modelVersion: string;
    endpoint: string;
  };
  imageProcessingConfig?: {
    maxSize?: number;
    allowedFormats?: string[];
    resizeOptions?: {
      width?: number;
      height?: number;
      maintainAspectRatio?: boolean;
    };
  };
}

export const LLMProvider: React.FC<LLMProviderProps> = ({
  children,
  llmConfig,
  imageProcessingConfig,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const llmService = new LLMService(llmConfig);
  const imageService = new ImageProcessingService(imageProcessingConfig);

  const analyzeImage = useCallback(
    async (file: File): Promise<ImageAnalysisResult> => {
      try {
        setIsProcessing(true);
        setError(null);
        const processedImage = await imageService.processImage(file);
        const result = await llmService.analyzeImage(processedImage.processedImage);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during image analysis');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [llmService, imageService]
  );

  const analyzeImages = useCallback(
    async (files: File[]): Promise<ImageAnalysisResult[]> => {
      try {
        setIsProcessing(true);
        setError(null);
        const processedImages = await imageService.processImages(files);
        const results = await llmService.analyzeImages(
          processedImages.map((result) => result.processedImage)
        );
        return results;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during image analysis');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [llmService, imageService]
  );

  const processImage = useCallback(
    async (file: File): Promise<ImageProcessingResult> => {
      try {
        setIsProcessing(true);
        setError(null);
        return await imageService.processImage(file);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during image processing');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [imageService]
  );

  const processImages = useCallback(
    async (files: File[]): Promise<ImageProcessingResult[]> => {
      try {
        setIsProcessing(true);
        setError(null);
        return await imageService.processImages(files);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred during image processing');
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [imageService]
  );

  const value = {
    isProcessing,
    error,
    analyzeImage,
    analyzeImages,
    processImage,
    processImages,
  };

  return <LLMContext.Provider value={value}>{children}</LLMContext.Provider>;
};

export const useLLM = () => {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within an LLMProvider');
  }
  return context;
};
