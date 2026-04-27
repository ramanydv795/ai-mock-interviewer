import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { role, level, question, answer, questionNumber } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Evaluate answer and ${
            questionNumber < 5 ? "give next question" : "end interview"
          }.
          
          Return JSON with:
          feedback, score, correctAnswer, nextQuestion, questionNumber, totalQuestions, topic, interviewDone`
        },
        {
          role: "user",
          content: `Q: ${question}\nA: ${answer}`
        }
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to process answer" });
  }
}