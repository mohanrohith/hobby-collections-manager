import { GoogleGenAI } from '@google/genai';
import { LLMServiceConfig, ImageAnalysisResult } from '../../types/llm-vlm/types';

export class LLMService {
  private ai: GoogleGenAI;
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig) {
    this.config = config;
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
  }

  private cleanJsonResponse(responseText: string): string {
    // First remove markdown code block formatting
    const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();

    // Then extract just the JSON object using regex
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    return cleaned;
  }

  async analyzeImage(imageData: string, category?: string): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    try {
      // Select the appropriate prompt based on category
      const prompt =
        category && this.config.categoryPrompts[category]
          ? this.config.categoryPrompts[category]
          : this.config.generalPrompt;

      const model = this.ai.models.generateContent({
        model: this.config.modelName,
        contents: [
          {
            text: prompt || '',
          },
          {
            inlineData: {
              data: imageData,
              mimeType: 'image/jpeg',
            },
          },
        ],
      });

      const response = await model;
      if (!response.text) {
        throw new Error('No response text received from the model');
      }

      const cleanedResponse = this.cleanJsonResponse(response.text);
      const parsedResponse = JSON.parse(cleanedResponse);

      return {
        metadata: parsedResponse.metadata,
        confidence: parsedResponse.confidence,
        processingTime: Date.now() - startTime,
        modelVersion: this.config.modelName,
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
}
