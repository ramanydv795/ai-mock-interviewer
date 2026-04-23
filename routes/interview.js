require('dotenv').config();
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Generate first question
router.post("/start", async (req, res) => {
  try {
    const { role, level } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer for ${role} position at ${level} level.
          Generate the first interview question.
          Return JSON with:
          - question (string)
          - questionNumber (1)
          - totalQuestions (5)
          - topic (string - what concept this tests)`
        },
        {
          role: "user",
          content: `Start the interview for ${role} at ${level} level`
        }
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start interview" });
  }
});


router.post("/next", async (req, res) => {
  try {
    const { role, level, question, answer, questionNumber } = req.body;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer for ${role} at ${level} level.
          Evaluate the answer and ${questionNumber < 5 ? 'provide next question' : 'end the interview'}.
          Return JSON with:
          - feedback (string - feedback on their answer)
          - score (0-10 for this answer)
          - correctAnswer (string - what the ideal answer was)
          - nextQuestion (string - next question, null if interview done)
          - questionNumber (number)
          - totalQuestions (5)
          - topic (string)
          - interviewDone (boolean)
          - ${questionNumber >= 5 ? 'finalReport: { overallScore, strengths: [], improvements: [], verdict: string }' : ''}`
        },
        {
          role: "user",
          content: `Question: ${question}\nCandidate Answer: ${answer}`
        }
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process answer" });
  }
});

module.exports = router;