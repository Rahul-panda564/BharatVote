"use server";

import { VertexAI } from "@google-cloud/vertexai";

/**
 * Vertex AI Integration for BharatVote
 * 
 * Specifically used for generating official Right to Information (RTI) drafts.
 * This demonstrates the usage of Vertex AI SDK as per mandatory requirements.
 */

const PROJECT_ID = process.env.GCP_PROJECT_ID || "bharatvote-demo";
const LOCATION = process.env.GCP_REGION || "us-central1";

// Initialize Vertex AI
const vertex_ai = new VertexAI({ project: PROJECT_ID, location: LOCATION });
const model = "gemini-1.5-flash-001";

// Instantiate the generative model
const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
});

/**
 * Generate a formal RTI draft based on a topic.
 * @param {string} topic - The subject of the RTI (e.g., 'evm', 'spending')
 * @returns {Promise<string>} The generated RTI draft
 */
export async function generateRTIDraft(topic) {
  const prompt = `Act as a legal expert in Indian administrative law. Create a formal Right to Information (RTI) application draft for the following topic related to the Election Commission of India: "${topic}".
  
  The draft must include:
  1. Standard RTI heading and address to the Public Information Officer (PIO).
  2. Clear, numbered points asking for specific data (e.g., procurement records, maintenance logs, expenditure reports).
  3. Reference to the RTI Act, 2005.
  4. Placeholder fields for Name, Address, and Date.
  
  Keep the tone professional and the requests precise. Do not provide legal advice, only the document structure.`;

  try {
    const resp = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const contentResponse = await resp.response;
    return contentResponse.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Vertex AI Error:", error);
    return fallbackRTIDraft(topic);
  }
}

/**
 * Static fallback for RTI drafts
 */
function fallbackRTIDraft(topic) {
  return `To,\nThe Public Information Officer,\nElection Commission of India,\nNirvachan Sadan, Ashoka Road, New Delhi.\n\nSubject: Information request under RTI Act, 2005 regarding ${topic}.\n\nDear Sir/Madam,\n\nI am a citizen of India. I wish to seek the following information under section 6(1) of the RTI Act, 2005...\n\n[DRAFT UNAVAILABLE: Please ensure GCP_PROJECT_ID and GCP_REGION are set for Vertex AI integration.]`;
}
