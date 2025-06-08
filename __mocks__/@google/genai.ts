export class GoogleGenAI {
  // No constructor needed for mock

  models = {
    generateContent: async () => ({
      text: JSON.stringify({
        metadata: {
          name: 'Test Item',
          manufacturer: 'Test Manufacturer',
          year: 2024,
          category: 'Test Category',
          subCategory: 'Test SubCategory',
          condition: 'New',
          value: 100,
          description: 'Test Description',
          rarity: 'Common',
          additionalMetadata: {},
        },
        confidence: {
          overall: 0.9,
          itemIdentification: 0.9,
          manufacturer: 0.9,
          releaseYear: 0.9,
          category: 0.9,
          subCategory: 0.9,
          condition: 0.9,
          estimatedValue: 0.9,
        },
      }),
    }),
  };
}
