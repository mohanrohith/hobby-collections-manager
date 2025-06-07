import { FirebaseApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';

export interface ImageAnalysisResult {
  itemIdentification: string;
  manufacturer: string;
  releaseYear?: number;
  condition: string;
  estimatedValue?: number;
  confidence: number;
  additionalMetadata: Record<string, unknown>;
}

export interface ImageAnalysisRequest {
  imageUrl: string;
  collectionType: string;
}

class LLMService {
  private functions;

  constructor(firebaseApp: FirebaseApp) {
    this.functions = getFunctions(firebaseApp);
  }

  async analyzeImage(request: ImageAnalysisRequest): Promise<ImageAnalysisResult> {
    try {
      const analyzeImageFunction = httpsCallable(this.functions, 'analyzeImage');
      const result = await analyzeImageFunction(request);
      return result.data as ImageAnalysisResult;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }

  async getConfidenceScore(analysisResult: ImageAnalysisResult): Promise<number> {
    // Calculate overall confidence score based on individual field confidences
    return analysisResult.confidence;
  }

  async validateAnalysisResult(analysisResult: ImageAnalysisResult): Promise<boolean> {
    // Implement validation logic for analysis results
    return analysisResult.confidence >= 0.7; // Example threshold
  }
}

export default LLMService;
