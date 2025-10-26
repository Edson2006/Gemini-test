
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { EmailCampaign } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatInstance: Chat | null = null;

const getChatInstance = () => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful and creative assistant.',
      },
    });
  }
  return chatInstance;
};

export const sendMessageToBot = async (message: string): Promise<string> => {
    try {
        const chat = getChatInstance();
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to bot:", error);
        throw new Error("Failed to get a response from the chatbot.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to generate image.");
    }
};

export const generateEmailCampaign = async (prompt: string): Promise<EmailCampaign> => {
    try {
        const textGenerationPrompt = `
        Generate an email marketing campaign for the following concept: "${prompt}".
        Provide a catchy subject line, engaging body copy (in markdown format), and a concise, descriptive prompt for an AI image generator to create a visually appealing banner image.
        The image prompt should describe a vibrant, high-quality scene relevant to the concept.
        `;

        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textGenerationPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                    },
                    required: ["subject", "body", "imagePrompt"]
                },
            },
        });

        const campaignText = JSON.parse(textResponse.text);
        
        const imageUrl = await generateImage(campaignText.imagePrompt);

        return {
            subject: campaignText.subject,
            body: campaignText.body,
            imageUrl: imageUrl,
        };

    } catch (error) {
        console.error("Error generating email campaign:", error);
        throw new Error("Failed to generate the email campaign.");
    }
};
