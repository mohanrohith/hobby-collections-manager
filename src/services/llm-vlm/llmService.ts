import type {
  LLMServiceConfig,
  ImageAnalysisResult,
  ItemMetadata,
  ConfidenceScore,
} from '../../types/llm-vlm/types';

export class LLMService {
  private config: LLMServiceConfig;
  private retryCount = 0;

  constructor(config: LLMServiceConfig) {
    this.config = config;
  }

  private async makeRequest(imageData: Blob): Promise<ImageAnalysisResult> {
    const formData = new FormData();
    formData.append('image', imageData);
    formData.append('model_version', this.config.modelVersion);

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      return this.processResponse(result);
    } catch (error) {
      if (this.retryCount < (this.config.maxRetries || 3)) {
        this.retryCount++;
        return this.makeRequest(imageData);
      }
      throw error;
    }
  }

  private processResponse(response: any): ImageAnalysisResult {
    // Process the raw API response into our standardized format
    const metadata: ItemMetadata = {
      name: response.name || '',
      manufacturer: response.manufacturer,
      releaseYear: response.release_year,
      category: response.category,
      subCategory: response.sub_category,
      condition: response.condition,
      estimatedValue: response.estimated_value,
      additionalMetadata: response.additional_metadata,
    };

    const confidence: ConfidenceScore = {
      overall: response.confidence?.overall || 0,
      scores: {
        name: response.confidence?.scores?.name,
        manufacturer: response.confidence?.scores?.manufacturer,
        releaseYear: response.confidence?.scores?.release_year,
        category: response.confidence?.scores?.category,
        subCategory: response.confidence?.scores?.sub_category,
        condition: response.confidence?.scores?.condition,
        estimatedValue: response.confidence?.scores?.estimated_value,
      },
    };

    return {
      metadata,
      confidence,
      processingTime: response.processing_time || 0,
      modelVersion: this.config.modelVersion,
    };
  }

  public async analyzeImage(imageData: Blob): Promise<ImageAnalysisResult> {
    this.retryCount = 0;
    return this.makeRequest(imageData);
  }

  public async analyzeImages(imageDataArray: Blob[]): Promise<ImageAnalysisResult[]> {
    return Promise.all(imageDataArray.map((image) => this.analyzeImage(image)));
  }
}
