import { useState } from "react";
import axios from "axios";

export default function App() {
  const [stage, setStage] = useState("setup");
  const [role, setRole] = useState("Frontend Developer");
  const [level, setLevel] = useState("Junior");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  const startInterview = async () => {
    setLoading(true);
    const response = await axios.post("http://localhost:5001/api/start", {
      role,
      level,
    });
    setQuestion(response.data);
    setStage("interview");
    setFeedback(null);
    setLoading(false);
  };

  const submitAnswer = async () => {
    setLoading(true);
    const response = await axios.post("http://localhost:5001/api/next", {
      role,
      level,
      question: question.question,
      answer,
      questionNumber: question.questionNumber,
    });
    const data = response.data;
    setFeedback(data);
    setScores([...scores, data.score]);
    if (data.interviewDone) {
      setFinalReport(data.finalReport);
      setStage("result");
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    setQuestion({
      question: feedback.nextQuestion,
      questionNumber: feedback.questionNumber,
      totalQuestions: feedback.totalQuestions,
      topic: feedback.topic,
    });
    setAnswer("");
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          🔥 AI Mock Interviewer
        </h1>
        <p className="text-zinc-400">
          Practice real technical interviews with AI
        </p>
      </div>

      {/* Setup Stage */}
      {stage === "setup" && (
        <div className="bg-zinc-900 border border-orange-900/50 rounded-2xl p-8 space-y-6">
          <div>
            <p className="text-zinc-400 mb-2 text-sm">Select Role</p>
            <select
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-full outline-none text-white focus:border-orange-500 transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>AI Engineer</option>
              <option>System Design</option>
            </select>
          </div>

          <div>
            <p className="text-zinc-400 mb-2 text-sm">Select Level</p>
            <select
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 w-full outline-none text-white focus:border-orange-500 transition"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option>Junior</option>
              <option>Mid Level</option>
              <option>Senior</option>
            </select>
          </div>

          <button
            onClick={startInterview}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 
            hover:from-orange-600 hover:to-red-600
            disabled:opacity-50 py-3 rounded-xl font-semibold text-lg transition"
          >
            {loading ? "Preparing Interview..." : "Start Interview "}
          </button>
        </div>
      )}

      {/* Interview Stage */}
      {stage === "interview" && question && (
        <div className="space-y-4">

          {/* Progress */}
          <div className="flex justify-between text-sm text-zinc-400 mb-2">
            <span>{role} — {level}</span>
            <span>Question {question.questionNumber}/{question.totalQuestions}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${(question.questionNumber / question.totalQuestions) * 100}%` }}
            />
          </div>

          {/* Topic Badge */}
          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/30">
            {question.topic}
          </span>

          {/* Question */}
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
            <p className="text-lg leading-relaxed">{question.question}</p>
          </div>

          {/* Answer */}
          {!feedback && (
            <>
              <textarea
                className="bg-zinc-900 border border-zinc-700 focus:border-orange-500
                rounded-xl p-4 h-40 resize-none outline-none w-full text-sm transition"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button
                onClick={submitAnswer}
                disabled={loading || !answer}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500
                hover:from-orange-600 hover:to-red-600
                disabled:opacity-50 py-3 rounded-xl font-semibold transition"
              >
                {loading ? "AI Evaluating..." : "Submit Answer "}
              </button>
            </>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="space-y-4">

              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 flex justify-between items-center">
                <p className="text-zinc-400">Your Score</p>
                <p className="text-4xl font-bold text-orange-400">
                  {feedback.score}
                  <span className="text-xl text-zinc-400">/10</span>
                </p>
              </div>

              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6">
                <p className="text-zinc-400 text-sm mb-2">Feedback</p>
                <p className="text-zinc-300">{feedback.feedback}</p>
              </div>

              <div className="bg-orange-950/30 border border-orange-800/50 rounded-xl p-6">
                <p className="text-orange-400 text-sm mb-2">Ideal Answer</p>
                <p className="text-zinc-300 text-sm">{feedback.correctAnswer}</p>
              </div>

              {!feedback.interviewDone && (
                <button
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500
                  hover:from-orange-600 hover:to-red-600
                  py-3 rounded-xl font-semibold transition"
                >
                  Next Question →
                </button>
              )}

            </div>
          )}
        </div>
      )}

      {/* Result Stage */}
      {stage === "result" && finalReport && (
        <div className="space-y-4">

          <div className="bg-zinc-900 border border-orange-900/50 rounded-2xl p-8 text-center">
            <p className="text-zinc-400 mb-2">Overall Score</p>
            <p className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {finalReport.overallScore}
              <span className="text-3xl text-zinc-400">/10</span>
            </p>
            <p className="text-xl mt-2 text-zinc-300">{finalReport.verdict}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-green-800/50 rounded-xl p-6">
              <p className="text-green-400 font-bold mb-3">✅ Strengths</p>
              <ul className="space-y-2">
                {finalReport.strengths?.map((s, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-zinc-900 border border-red-800/50 rounded-xl p-6">
              <p className="text-red-400 font-bold mb-3">📈 Improve</p>
              <ul className="space-y-2">
                {finalReport.improvements?.map((imp, i) => (
                  <li key={i} className="text-zinc-300 text-sm">• {imp}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => {
              setStage("setup");
              setScores([]);
              setFinalReport(null);
              setAnswer("");
              setFeedback(null);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500
            hover:from-orange-600 hover:to-red-600
            py-3 rounded-xl font-semibold transition"
          >
            Start New Interview 🔄
          </button>

        </div>
      )}

    </div>
  );
}