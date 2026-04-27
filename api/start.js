import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { role, level } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer for ${role} at ${level}.
Return JSON with: question, questionNumber, totalQuestions, topic`,
        },
        {
          role: "user",
          content: "Start interview",
        },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);

    return res.status(200).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message || "Failed to start interview",
    });
  }
}