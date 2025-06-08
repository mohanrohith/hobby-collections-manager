import type { LLMServiceConfig } from '../types/llm-vlm/types';

export const llmConfig: LLMServiceConfig = {
  apiKey: process.env['REACT_APP_LLM_API_KEY'] || '',
  modelVersion: process.env['REACT_APP_LLM_MODEL_VERSION'] || '1.0',
  endpoint: process.env['REACT_APP_LLM_ENDPOINT'] || '',
  maxRetries: 3,
  timeout: 30000, // 30 seconds
};

export const imageProcessingConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  resizeOptions: {
    width: 1024,
    height: 1024,
    maintainAspectRatio: true,
  },
};

// Confidence thresholds for different metadata fields
export const confidenceThresholds = {
  overall: 0.7,
  name: 0.8,
  manufacturer: 0.7,
  releaseYear: 0.6,
  category: 0.8,
  subCategory: 0.7,
  condition: 0.6,
  estimatedValue: 0.5,
};
