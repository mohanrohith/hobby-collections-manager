import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLLM } from '../../context/llm-vlm/LLMContext';
import { ImageAnalysisResult } from '../../types/llm-vlm/types';
import { Category } from './CategorySelector';

interface ImageUploaderProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
  category: Category | undefined;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalysisComplete,
  category,
  multiple = false,
}) => {
  const { analyzeImage, isAnalyzing, error } = useLLM();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        if (!base64) {
          reject(new Error('Invalid base64 string format'));
          return;
        }
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    async (fileArray: File[]) => {
      try {
        if (multiple) {
          for (const file of fileArray) {
            const base64 = await fileToBase64(file);
            const result = await analyzeImage(base64, category);
            onAnalysisComplete(result);
          }
        } else {
          const file = fileArray[0];
          if (!file) {
            throw new Error('No file selected');
          }
          const base64 = await fileToBase64(file);
          const result = await analyzeImage(base64, category);
          onAnalysisComplete(result);
        }
      } catch (error) {
        console.error('Error processing files:', error);
      }
    },
    [analyzeImage, onAnalysisComplete, category, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} disabled={isAnalyzing} />
      {isAnalyzing ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Analyzing image...</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">Drag and drop an image here, or click to select</p>
          <p className="text-sm text-gray-500">Supported formats: JPEG, PNG, GIF</p>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
