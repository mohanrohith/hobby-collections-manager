import React, { useState } from 'react';
import { CategorySelector, Category } from './CategorySelector';
import { ImageUploader } from './ImageUploader';
import { ImageAnalysisResult } from '../../types/llm-vlm/types';

interface ImageAnalysisFormProps {
  onAnalysisComplete: (result: ImageAnalysisResult) => void;
  className?: string;
}

export const ImageAnalysisForm: React.FC<ImageAnalysisFormProps> = ({
  onAnalysisComplete,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  return (
    <div className={`space-y-6 ${className}`}>
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ImageUploader category={selectedCategory} onAnalysisComplete={onAnalysisComplete} />
    </div>
  );
};
