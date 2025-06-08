import React from 'react';
import type { ImageAnalysisResult } from '../../types/llm-vlm/types';
import { confidenceThresholds } from '../../config/llm-vlm';

interface MetadataDisplayProps {
  result: ImageAnalysisResult;
  onEdit?: (field: string, value: any) => void;
  editable?: boolean;
}

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
  result,
  onEdit,
  editable = false,
}) => {
  const { metadata, confidence } = result;

  const renderConfidenceIndicator = (score: number | undefined, threshold: number) => {
    if (score === undefined) return null;

    const color = score >= threshold ? 'bg-green-500' : 'bg-yellow-500';
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm text-gray-500">{Math.round(score * 100)}%</span>
      </div>
    );
  };

  const renderField = (label: string, value: any, confidenceScore?: number, threshold?: number) => {
    const isEditable = editable && onEdit;
    const displayValue = value || 'Not detected';

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {isEditable ? (
            <input
              type="text"
              value={displayValue}
              onChange={(e) => onEdit(label.toLowerCase(), e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{displayValue}</p>
          )}
        </div>
        {renderConfidenceIndicator(confidenceScore, threshold || 0)}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>

      <div className="space-y-2">
        {renderField('Name', metadata.name, confidence.scores.name, confidenceThresholds.name)}
        {renderField(
          'Manufacturer',
          metadata.manufacturer,
          confidence.scores.manufacturer,
          confidenceThresholds.manufacturer
        )}
        {renderField(
          'Release Year',
          metadata.releaseYear,
          confidence.scores.releaseYear,
          confidenceThresholds.releaseYear
        )}
        {renderField(
          'Category',
          metadata.category,
          confidence.scores.category,
          confidenceThresholds.category
        )}
        {renderField(
          'Subcategory',
          metadata.subCategory,
          confidence.scores.subCategory,
          confidenceThresholds.subCategory
        )}
        {renderField(
          'Condition',
          metadata.condition,
          confidence.scores.condition,
          confidenceThresholds.condition
        )}
        {renderField(
          'Estimated Value',
          metadata.estimatedValue ? `$${metadata.estimatedValue}` : undefined,
          confidence.scores.estimatedValue,
          confidenceThresholds.estimatedValue
        )}
      </div>

      {metadata.additionalMetadata && Object.keys(metadata.additionalMetadata).length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Metadata</h4>
          <div className="space-y-2">
            {Object.entries(metadata.additionalMetadata).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700">{key}</label>
                  <p className="mt-1 text-sm text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Overall Confidence</span>
          {renderConfidenceIndicator(confidence.overall, confidenceThresholds.overall)}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Processing time: {result.processingTime}ms | Model version: {result.modelVersion}
        </p>
      </div>
    </div>
  );
};
