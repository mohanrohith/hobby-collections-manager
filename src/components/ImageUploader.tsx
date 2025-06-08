import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLLM } from '../context/llm-vlm/LLMContext';
import { ImageAnalysisResult } from '../types/llm-vlm/types';

interface ImageUploaderProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
  category?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalysisComplete, category }) => {
  const { analyzeImage, isAnalyzing, error } = useLLM();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        for (const file of acceptedFiles) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = base64String.split(',')[1];
            if (!base64) {
              throw new Error('Invalid base64 string format');
            }
            const result = await analyzeImage(base64, category);
            onAnalysisComplete(result);
          };
          reader.onerror = () => {
            throw new Error('Failed to read file');
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Error processing files:', error);
      }
    },
    [analyzeImage, onAnalysisComplete, category]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    multiple: false,
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
