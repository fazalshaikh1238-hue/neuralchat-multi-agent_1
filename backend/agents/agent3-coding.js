const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Agent 3: Coding Agent
 * Generates code solutions when the question is programming-related.
 * If not a coding question, passes through with a note.
 */
async function codingAgent(userMessage, intentData, researchData) {
  // If not coding related, skip this agent
  if (!intentData.requires_code) {
    return {
      agentName: "Coding Agent",
      agentId: 3,
      input: { userMessage, intentData },
      output: null,
      skipped: true,
      skipReason: "Not a coding question — skipping code generation.",
      status: "skipped",
    };
  }

  const language = intentData.language || "the appropriate language";

  const systemPrompt = `You are an expert Coding Agent specializing in writing clean, correct, and well-commented code.

Based on the research context and user question, generate a complete code solution.

Research context available: ${researchData}

Requirements for your code:
- Write in ${language}
- Include clear comments explaining each section
- Handle edge cases appropriately
- Follow best practices and clean code principles
- Include example usage where applicable
- If multiple approaches exist, show the best one and briefly mention alternatives

Provide ONLY the code with comments. No prose explanations (those come from another agent).`;

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  return {
    agentName: "Coding Agent",
    agentId: 3,
    input: { userMessage, intentData, researchData },
    output: response.choices[0].message.content,
    status: "completed",
  };
}

module.exports = { codingAgent };
