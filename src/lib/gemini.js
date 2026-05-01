"use server";

/**
 * Gemini AI Integration for BharatVote
 * 
 * Provides AI-powered responses for the Chunav Mitra chatbot.
 * Uses Google Gemini API (free tier) with safety settings.
 * Falls back to static responses when API key is not configured.
 * 
 * Security: API key is server-side only (no NEXT_PUBLIC_ prefix).
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const SYSTEM_PROMPT = `You are Chunav Mitra, an expert AI assistant for Indian election literacy. You help citizens understand:
- Voter registration (Form 6, 6A, 8)
- Electoral processes (EVM, VVPAT, counting)
- Their democratic rights
- How to find polling booths
- Understanding candidates and manifestos
- Filing grievances and RTI applications

Always provide accurate information based on the Election Commission of India's official guidelines.
Respond in a friendly, helpful manner. Keep answers concise but thorough.
If unsure, direct users to official ECI resources (eci.gov.in, voters.eci.gov.in, 1950 helpline).
You can respond in Hindi, English, or any Indian language the user prefers.`;

/**
 * Send a message to Gemini API and get a response.
 * @param {string} userMessage - The user's question
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} AI response text
 */
export async function getChunavMitraResponse(userMessage, conversationHistory = []) {
  // If no API key, return a helpful static response
  if (!GEMINI_API_KEY) {
    return getStaticResponse(userMessage);
  }

  try {
    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am Chunav Mitra, ready to assist with election literacy." }],
      },
      // Include conversation history for context
      ...conversationHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return getStaticResponse(userMessage);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || getStaticResponse(userMessage);
  } catch (error) {
    console.error("Gemini API error:", error);
    return getStaticResponse(userMessage);
  }
}

/**
 * Static fallback responses when Gemini API is unavailable.
 */
function getStaticResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes("register") || lower.includes("registration")) {
    return "To register as a voter:\n\n1. Visit voters.eci.gov.in\n2. Fill Form 6 with your details\n3. Upload proof of age and address\n4. Submit and note your reference number\n5. Wait for BLO verification\n\n📞 Helpline: 1950";
  }
  if (lower.includes("evm") || lower.includes("voting machine")) {
    return "The EVM (Electronic Voting Machine) has two units:\n\n1. **Ballot Unit** - Where you press the button next to your candidate\n2. **Control Unit** - Operated by the Presiding Officer\n\nThe VVPAT prints a slip showing your vote for 7 seconds for verification.\n\nTry our EVM Simulator in the Polling Day section!";
  }
  if (lower.includes("booth") || lower.includes("polling station")) {
    return "To find your polling booth:\n\n1. Visit electoralsearch.eci.gov.in\n2. Search by Name or EPIC Number\n3. Your booth address will be displayed\n\nYou can also use our Booth Locator in the Journey section!";
  }
  if (lower.includes("candidate") || lower.includes("manifesto")) {
    return "To learn about your candidates:\n\n1. Visit the ECI website during election season\n2. Check ADR India for candidate affidavits\n3. Use our Representation Tracker to see MP/MLA performance\n\nWould you like to explore the Representation section?";
  }

  return "Thank you for your question! For the most accurate information:\n\n1. Visit eci.gov.in\n2. Call helpline 1950\n3. Use the Voter Helpline App\n\nI can help with registration, EVM process, booth finding, and more. What would you like to know?";
}
