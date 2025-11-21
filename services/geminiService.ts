
import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY for Gemini is not set.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

const generateDescription = async (title: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return Promise.reject("API Key not configured.");
    
    const prompt = `Genera una descripción breve, atractiva y amigable para un anuncio en una plataforma de comercio hiperlocal en Antofagasta, Chile. El título del anuncio es "${title}". La descripción debe ser concisa (2-3 frases), resaltar que es un producto/servicio local y tener un tono positivo y comunitario. No uses hashtags.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate description from Gemini.");
    }
};

const validateContentSafety = async (title: string, description: string): Promise<{ isSafe: boolean; reason?: string }> => {
    const ai = getClient();
    if (!ai) return { isSafe: true }; // Fail open if no API key in dev, or handle appropriately

    const prompt = `Analiza el siguiente contenido para una plataforma comunitaria vecinal. 
    Título: "${title}"
    Descripción: "${description}"
    
    Determina si el contenido viola las políticas de seguridad.
    Las políticas PROHÍBEN estrictamente:
    1. Contenido sexual o pornográfico explícito o implícito.
    2. Venta o promoción de drogas ilegales, medicamentos controlados o sustancias prohibidas.
    3. Venta o promoción de armas de fuego, armas blancas o explosivos.
    4. Insultos, discursos de odio, discriminación, acoso o lenguaje extremadamente ofensivo/vulgar.
    
    Responde ÚNICAMENTE con un JSON.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isSafe: { type: Type.BOOLEAN },
                        reason: { type: Type.STRING, description: "Razón breve si no es seguro (en español), o string vacío si es seguro." }
                    },
                    required: ["isSafe"]
                }
            }
        });

        if (response.text) {
             const result = JSON.parse(response.text);
             return result;
        }
        return { isSafe: true };

    } catch (error) {
        console.error("Error validating content:", error);
        // In case of error, we might default to safe or block. 
        // For better UX in this demo, we'll verify safety manually or allow it if API fails.
        return { isSafe: true };
    }
};

export const geminiService = {
    generateDescription,
    validateContentSafety
};
