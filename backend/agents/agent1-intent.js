const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Agent 1: Intent Detection Agent
 * Analyzes the user's question and classifies intent, extracts key topics,
 * and determines what kind of response is needed.
 */
async function intentDetectionAgent(userMessage) {
  const systemPrompt = `You are an Intent Detection Agent. Your job is to analyze user questions and classify them.

You must respond with a JSON object containing:
{
  "intent": "one of: coding | explanation | research | general | math | creative",
  "topics": ["array", "of", "key", "topics"],
  "requires_code": true/false,
  "complexity": "beginner | intermediate | advanced",
  "language": "programming language if coding related, else null",
  "summary": "one sentence summarizing what the user wants"
}

ONLY respond with valid JSON. No extra text.`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(clean);

  return {
    agentName: "Intent Detection Agent",
    agentId: 1,
    input: userMessage,
    output: parsed,
    status: "completed",
  };
}

module.exports = { intentDetectionAgent };
