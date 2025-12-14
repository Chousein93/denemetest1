import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.API_KEY;
    this.ai = new GoogleGenAI({ apiKey: this.apiKey });
  }

  // --- Utility ---
  public async checkAndSelectKey(): Promise<void> {
    const win = window as any;
    if (win.aistudio && win.aistudio.hasSelectedApiKey && win.aistudio.openSelectKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            await win.aistudio.openSelectKey();
        }
        // Re-init with potentially new key in environment or just proceed
        // The instructions say "The selected API key is available via process.env.API_KEY"
        // so we might need to re-instantiate if the process.env was updated by the sidebar widget implicitly.
        // However, usually we just proceed. We will create a new instance just in case.
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  // --- Text Generation (Chat) ---
  public async getFinancialAdvice(prompt: string, context?: string): Promise<string> {
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Context: ${context || 'General Finance'}\nUser Question: ${prompt}`,
            config: {
                systemInstruction: "You are a helpful and knowledgeable financial advisor. Keep answers concise and practical.",
                thinkingConfig: { thinkingBudget: 1024 } // Using thinking for complex reasoning
            }
        });
        return response.text || "I couldn't generate advice at this moment.";
    } catch (e) {
        console.error(e);
        return "Service unavailable.";
    }
  }

  // --- Grounding (Search) ---
  public async getMarketNews(query: string): Promise<{text: string, sources: any[]}> {
     try {
         const response = await this.ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: query,
             config: {
                 tools: [{ googleSearch: {} }]
             }
         });
         
         const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
         return { text: response.text || "No news found.", sources };
     } catch (e) {
         console.error(e);
         return { text: "Error fetching news.", sources: [] };
     }
  }

  // --- Maps Grounding ---
  public async findNearbyFinancialServices(lat: number, lng: number, query: string): Promise<string> {
      try {
          const response = await this.ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: query,
              config: {
                  tools: [{ googleMaps: {} }],
                  toolConfig: {
                      retrievalConfig: {
                          latLng: { latitude: lat, longitude: lng }
                      }
                  }
              }
          });
          return response.text || "No locations found.";
      } catch (e) {
          console.error(e);
          return "Error finding locations.";
      }
  }

  // --- Image Generation (Nano Banana Pro) ---
  public async generateVisualization(prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> {
      await this.checkAndSelectKey();
      try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: size
                }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
      } catch (e) {
          console.error("Image gen error", e);
          return null;
      }
  }

  // --- Video Generation (Veo) ---
  public async generateVideo(prompt: string): Promise<string | null> {
      await this.checkAndSelectKey();
      try {
          let operation = await this.ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: prompt,
              config: {
                  numberOfVideos: 1,
                  resolution: '720p',
                  aspectRatio: '16:9'
              }
          });

          while (!operation.done) {
              await new Promise(resolve => setTimeout(resolve, 5000));
              operation = await this.ai.operations.getVideosOperation({ operation });
          }

          const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
          if (uri) {
              // Fetch logic handled in component because we need to append API key
              return uri;
          }
          return null;
      } catch (e) {
          console.error("Video gen error", e);
          return null;
      }
  }

  // --- Live API Connector ---
  public getLiveSession(onMessage: (msg: LiveServerMessage) => void, onOpen: () => void, onClose: () => void, onError: (e: any) => void) {
      return this.ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
              onopen: onOpen,
              onmessage: onMessage,
              onclose: onClose,
              onerror: onError
          },
          config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                  voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }
              },
              systemInstruction: "You are an expert financial assistant. Help the user with budgeting, savings, and investment advice. Keep responses conversational and concise."
          }
      });
  }
}

// Global instance
export const geminiService = new GeminiService();