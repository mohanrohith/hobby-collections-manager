import React, { useState } from 'react';
import { ImageAnalysisForm } from '../components/llm-vlm/ImageAnalysisForm';
import { ImageAnalysisResult } from '../types/llm-vlm/types';

export const ItemAnalysis: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisComplete = (result: ImageAnalysisResult) => {
    setAnalysisResult(result);
    setError(null);
  };

  const renderAdditionalMetadata = (metadata: any) => {
    if (metadata.category === 'LEGO') {
      return (
        <>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Set Number:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.setNumber || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Theme/Series:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.theme || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Subtheme:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.subtheme || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Model Name:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.modelName || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Recommended Age:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.recommendedAge || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Number of Pieces:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.pieceCount || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Minifigures:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.minifigures || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Dimensions:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.dimensions || 'N/A'}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <dt className="text-gray-500">Box Condition:</dt>
            <dd className="col-span-2">{metadata.additionalMetadata?.boxCondition || 'N/A'}</dd>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
            <p className="text-gray-600 mb-4">
              Select a category and upload an image of your collectible item for analysis.
            </p>
          </div>
          <div className="mt-5">
            <ImageAnalysisForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
          {error && (
            <div className="mt-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Item Details</h3>
                <dl className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Name:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.name}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Manufacturer:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.manufacturer}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Year:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.year}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Category:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.category}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Subcategory:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.subCategory}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Condition:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.condition}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Value:</dt>
                    <dd className="col-span-2">${analysisResult.metadata.value}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Rarity:</dt>
                    <dd className="col-span-2">{analysisResult.metadata.rarity}</dd>
                  </div>
                  {renderAdditionalMetadata(analysisResult.metadata)}
                </dl>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Confidence Scores</h3>
                <dl className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Overall:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.overall * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Item Identification:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.itemIdentification * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Manufacturer:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.manufacturer * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Release Year:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.releaseYear * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Category:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.category * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Subcategory:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.subCategory * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Condition:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.condition * 100).toFixed(1)}%
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500">Value:</dt>
                    <dd className="col-span-2">
                      {(analysisResult.confidence.estimatedValue * 100).toFixed(1)}%
                    </dd>
                  </div>
                  {analysisResult.metadata.category === 'LEGO' && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-gray-500">Set Number:</dt>
                        <dd className="col-span-2">
                          {analysisResult.confidence.setNumber
                            ? (analysisResult.confidence.setNumber * 100).toFixed(1)
                            : 'N/A'}
                          %
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-gray-500">Piece Count:</dt>
                        <dd className="col-span-2">
                          {analysisResult.confidence.pieceCount
                            ? (analysisResult.confidence.pieceCount * 100).toFixed(1)
                            : 'N/A'}
                          %
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-gray-500">Theme:</dt>
                        <dd className="col-span-2">
                          {analysisResult.confidence.theme
                            ? (analysisResult.confidence.theme * 100).toFixed(1)
                            : 'N/A'}
                          %
                        </dd>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <dt className="text-gray-500">Recommended Age:</dt>
                        <dd className="col-span-2">
                          {analysisResult.confidence.recommendedAge
                            ? (analysisResult.confidence.recommendedAge * 100).toFixed(1)
                            : 'N/A'}
                          %
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>

              <div className="text-sm text-gray-500 mt-4">
                <p>Processing Time: {analysisResult.processingTime}ms</p>
                <p>Model Version: {analysisResult.modelVersion}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
