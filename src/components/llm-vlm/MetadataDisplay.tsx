import React from 'react';
import { MetadataDisplayProps } from '../../types/llm-vlm/types';

const confidenceThresholds = {
  name: 0.7,
  manufacturer: 0.7,
  year: 0.7,
  category: 0.7,
  subCategory: 0.7,
  condition: 0.7,
  value: 0.7,
};

export const MetadataDisplay: React.FC<MetadataDisplayProps> = ({
  result,
  editable = false,
  onEdit,
}) => {
  const { metadata, confidence } = result;

  const renderField = (
    label: string,
    value: string | number | undefined,
    confidenceScore: number,
    threshold: number
  ) => {
    if (value === undefined) return null;

    const isConfident = confidenceScore >= threshold;
    const valueClass = isConfident ? 'text-gray-900' : 'text-yellow-600';

    return (
      <div className="flex justify-between items-center py-2">
        <span className="font-medium text-gray-700">{label}:</span>
        {editable && onEdit ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onEdit(label.toLowerCase(), e.target.value)}
            className={`ml-2 px-2 py-1 border rounded ${valueClass}`}
          />
        ) : (
          <span className={valueClass}>{value}</span>
        )}
        <span className={`ml-2 text-sm ${isConfident ? 'text-green-600' : 'text-yellow-600'}`}>
          {(confidenceScore * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
      <div className="space-y-2">
        {renderField(
          'Name',
          metadata.name,
          confidence.itemIdentification,
          confidenceThresholds.name
        )}
        {renderField(
          'Manufacturer',
          metadata.manufacturer,
          confidence.manufacturer,
          confidenceThresholds.manufacturer
        )}
        {renderField('Year', metadata.year, confidence.releaseYear, confidenceThresholds.year)}
        {renderField(
          'Category',
          metadata.category,
          confidence.category,
          confidenceThresholds.category
        )}
        {renderField(
          'Subcategory',
          metadata.subCategory,
          confidence.subCategory,
          confidenceThresholds.subCategory
        )}
        {renderField(
          'Condition',
          metadata.condition,
          confidence.condition,
          confidenceThresholds.condition
        )}
        {renderField(
          'Value',
          metadata.value ? `$${metadata.value}` : undefined,
          confidence.estimatedValue,
          confidenceThresholds.value
        )}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="font-medium">Overall Confidence:</span>
          <span
            className={`font-semibold ${
              confidence.overall >= 0.7 ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {(confidence.overall * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
