import React, { useCallback, useState } from 'react';
import { useLLM } from '../../context/llm-vlm/LLMContext';
import type { ImageAnalysisResult } from '../../types/llm-vlm/types';

interface ImageUploaderProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
  onError: (error: string) => void;
  multiple?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalysisComplete,
  onError,
  multiple = false,
}) => {
  const { analyzeImage, analyzeImages, isProcessing, error } = useLLM();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    async (files: FileList) => {
      try {
        setUploadProgress(0);
        const fileArray = Array.from(files);

        if (multiple) {
          const results = await analyzeImages(fileArray);
          results.forEach((result) => onAnalysisComplete(result));
        } else {
          const firstFile = fileArray[0];
          if (!firstFile) {
            throw new Error('No file selected');
          }
          const result = await analyzeImage(firstFile);
          onAnalysisComplete(result);
        }

        setUploadProgress(100);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'An error occurred during analysis');
      } finally {
        setIsDragging(false);
      }
    },
    [analyzeImage, analyzeImages, multiple, onAnalysisComplete, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />

      <div className="space-y-4">
        <div className="text-4xl mb-2">📸</div>
        <h3 className="text-lg font-medium">
          {isProcessing ? 'Processing...' : 'Drop images here or click to upload'}
        </h3>
        <p className="text-sm text-gray-500">
          {multiple ? 'Upload multiple images' : 'Upload a single image'}
        </p>

        {isProcessing && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
};
