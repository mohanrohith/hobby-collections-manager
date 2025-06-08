import { LLMService } from './llmService';
import { config } from '../../config/llm-vlm';

describe('LLMService', () => {
  let llmService: LLMService;

  beforeEach(() => {
    llmService = new LLMService(config);
  });

  it('should analyze image and return metadata', async () => {
    const base64Image = 'test-image-base64';
    const result = await llmService.analyzeImage(base64Image);

    expect(result).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata.name).toBe('Test Item');
    expect(result.metadata.manufacturer).toBe('Test Manufacturer');
    expect(result.metadata.year).toBe(2024);
    expect(result.confidence).toBeDefined();
    expect(result.confidence.overall).toBe(0.9);
  });
});
