import { LLMServiceConfig } from '../types/llm-vlm/types';
import {
  legoPrompt,
  funkoPrompt,
  diecastPrompt,
  booksPrompt,
  generalPrompt,
} from './llm-vlm/prompts';

export const config: LLMServiceConfig = {
  apiKey: process.env['REACT_APP_GEMINI_API_KEY'] || '',
  modelName: 'gemini-2.0-flash',
  maxRetries: 3,
  timeout: 30000,
  temperature: 0.7,
  maxTokens: 1000,
  categoryPrompts: {
    LEGO: legoPrompt,
    'Funko Pop': funkoPrompt,
    'Diecast Cars': diecastPrompt,
    Books: booksPrompt,
  },
  generalPrompt,
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
  specialEdition: 0.8,
  damage: 0.7,
};

// Collection-specific settings
export const collectionSettings = {
  lego: {
    requiredFields: ['setNumber', 'theme', 'year', 'pieces'],
    confidenceThresholds: {
      setNumber: 0.9,
      theme: 0.8,
      year: 0.7,
      pieces: 0.6,
    },
  },
  funko: {
    requiredFields: ['popNumber', 'series', 'year'],
    confidenceThresholds: {
      popNumber: 0.9,
      series: 0.8,
      year: 0.7,
    },
  },
  diecast: {
    requiredFields: ['manufacturer', 'model', 'scale', 'year'],
    confidenceThresholds: {
      manufacturer: 0.8,
      model: 0.7,
      scale: 0.9,
      year: 0.7,
    },
  },
};
