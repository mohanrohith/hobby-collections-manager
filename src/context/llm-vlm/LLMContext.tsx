import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LLMService } from '../../services/llm-vlm/llmService';
import { ImageAnalysisResult } from '../../types/llm-vlm/types';
import { config } from '../../config/llm-vlm';

interface LLMContextType {
  analyzeImage: (imageData: string, category?: string) => Promise<ImageAnalysisResult>;
  isAnalyzing: boolean;
  error: string | null;
}

const LLMContext = createContext<LLMContextType | undefined>(undefined);

export const useLLM = () => {
  const context = useContext(LLMContext);
  if (!context) {
    throw new Error('useLLM must be used within an LLMProvider');
  }
  return context;
};

interface LLMProviderProps {
  children: ReactNode;
}

export const LLMProvider: React.FC<LLMProviderProps> = ({ children }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const llmService = new LLMService(config);

  const analyzeImage = async (
    imageData: string,
    category?: string
  ): Promise<ImageAnalysisResult> => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await llmService.analyzeImage(imageData, category);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during analysis';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <LLMContext.Provider value={{ analyzeImage, isAnalyzing, error }}>
      {children}
    </LLMContext.Provider>
  );
};
