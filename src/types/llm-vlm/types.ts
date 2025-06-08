export interface ItemMetadata {
  name: string;
  manufacturer: string;
  year: number;
  category: string;
  subCategory: string;
  condition: string;
  value: number;
  specialEdition?: boolean;
  damage?: string;
  description: string;
  rarity: string;
  series?: string;
  edition?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  provenance?: string;
  notes?: string;
  additionalMetadata: {
    series?: string;
    scale?: string;
    setNumber?: string;
    damage?: string;
    rarity?: string;
    [key: string]: any;
  };
}

export interface ConfidenceScore {
  overall: number;
  itemIdentification: number;
  manufacturer: number;
  releaseYear: number;
  category: number;
  subCategory: number;
  condition: number;
  estimatedValue: number;
  specialEdition: number;
  damage: number;
  setNumber?: number;
  pieceCount?: number;
  theme?: number;
  recommendedAge?: number;
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
  modelName: string;
  maxRetries: number;
  timeout: number;
  temperature: number;
  maxTokens: number;
  categoryPrompts: Record<string, string>;
  generalPrompt: string;
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

export interface ImageProcessingConfig {
  maxSize?: number;
  allowedFormats?: string[];
  resizeOptions?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
}

export interface MetadataDisplayProps {
  result: ImageAnalysisResult;
  editable?: boolean;
  onEdit?: (field: string, value: any) => void;
}
