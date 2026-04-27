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
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer for ${role} at ${level} level. Give 1 question in JSON format.`
        },
        {
          role: "user",
          content: "Start interview"
        }
      ],
    });

    res.status(200).json(response.choices[0].message);

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
}