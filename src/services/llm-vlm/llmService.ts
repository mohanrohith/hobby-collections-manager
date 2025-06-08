import { GoogleGenAI } from '@google/genai';
import { LLMServiceConfig } from '../../types/llm-vlm/types';
import { APIRateLimiter } from './rateLimiter';

interface TextPart {
  text: string;
}

interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export class LLMService {
  private ai: GoogleGenAI;
  private config: LLMServiceConfig;
  private rateLimiter: APIRateLimiter;

  constructor(config: LLMServiceConfig) {
    this.config = config;
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.rateLimiter = new APIRateLimiter({
      requestsPerMinute: 60, // Adjust based on your API quota
      maxRequestsPerDay: 1000, // Adjust based on your API quota
    });
  }

  async analyzeImage(imageBase64: string, category?: string): Promise<any> {
    try {
      // Check rate limits before making the API call
      await this.rateLimiter.checkLimit();

      const promptText =
        (category && this.config.categoryPrompts[category]
          ? this.config.categoryPrompts[category]
          : this.config.generalPrompt) ?? 'Analyze this image and provide metadata in JSON format.';

      const textPart: TextPart = { text: promptText };
      const imagePart: InlineDataPart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      };

      const model = this.ai.models.generateContent({
        model: this.config.modelName,
        contents: [textPart, imagePart],
      });

      const response = await model;
      if (!response.text) {
        throw new Error('No response text received from the model');
      }

      const cleanedResponse = this.cleanJsonResponse(response.text);
      return cleanedResponse;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  private cleanJsonResponse(responseText: string): any {
    try {
      // Remove any markdown code block markers
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '');
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error('Failed to parse model response');
    }
  }

  getRemainingQuota(): { daily: number; rateLimit: number } {
    return {
      daily: this.rateLimiter.getRemainingDailyQuota(),
      rateLimit: this.rateLimiter.getRemainingRateLimit(),
    };
  }
}
