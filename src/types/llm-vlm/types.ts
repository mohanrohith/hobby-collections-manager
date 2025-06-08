export interface ItemMetadata {
  name: string;
  manufacturer?: string;
  releaseYear?: number;
  category?: string;
  subCategory?: string;
  condition?: string;
  estimatedValue?: number;
  additionalMetadata?: Record<string, any>;
}

export interface ConfidenceScore {
  overall: number; // 0-1
  scores: {
    name?: number;
    manufacturer?: number;
    releaseYear?: number;
    category?: number;
    subCategory?: number;
    condition?: number;
    estimatedValue?: number;
  };
}

export interface ImageAnalysisResult {
  metadata: ItemMetadata;
  confidence: ConfidenceScore;
  processingTime: number;
  modelVersion: string;
}

export interface ImageProcessingOptions {
  maxSize?: number; // in bytes
  allowedFormats?: string[];
  resizeOptions?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
}

export interface LLMServiceConfig {
  apiKey: string;
  modelVersion: string;
  endpoint: string;
  maxRetries?: number;
  timeout?: number;
}

export interface ImageProcessingResult {
  processedImage: Blob;
  originalSize: number;
  processedSize: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}
