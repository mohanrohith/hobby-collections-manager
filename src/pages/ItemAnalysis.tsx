import React, { useState } from 'react';
import { ImageUploader } from '../components/llm-vlm/ImageUploader';
import { MetadataDisplay } from '../components/llm-vlm/MetadataDisplay';
import type { ImageAnalysisResult } from '../types/llm-vlm/types';

export const ItemAnalysis: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: ImageAnalysisResult) => {
    setAnalysisResult(result);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setAnalysisResult(null);
  };

  const handleEditMetadata = (field: string, value: any) => {
    if (!analysisResult) return;

    setAnalysisResult({
      ...analysisResult,
      metadata: {
        ...analysisResult.metadata,
        [field]: value,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Item Analysis</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Image</h2>
          <ImageUploader
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            multiple={false}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {analysisResult && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h2>
            <MetadataDisplay result={analysisResult} onEdit={handleEditMetadata} editable={true} />
          </div>
        )}
      </div>
    </div>
  );
};
