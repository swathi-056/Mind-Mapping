import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch questions
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const formattedQuestions = data.results.map((q) => {
          const incorrect = q.incorrect_answers.map((ans) => ({
            answerText: ans,
            isCorrect: false,
          }));
          const correct = { answerText: q.correct_answer, isCorrect: true };
          const allAnswers = [...incorrect, correct].sort(() => Math.random() - 0.5);
          return { questionText: q.question, answerOptions: allAnswers };
        });
        setQuestions(formattedQuestions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handleAnswerClick = (isCorrect, index) => {
    setSelectedAnswer(index);
    if (isCorrect) setScore(score + 1);
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const handleRestart = () => {
    window.location.reload(); // simpler reset
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div className="app" style={{ fontFamily: "Arial", padding: "20px", textAlign: "center" }}>
      {showScore ? (
        <div>
          <h1>Your Score: {score} / {questions.length}</h1>
          <button
            onClick={handleRestart}
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              fontSize: "16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div>
          {/* Progress bar */}
          <div
            style={{
              height: "20px",
              width: "80%",
              backgroundColor: "#ddd",
              margin: "20px auto",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: '${((currentQuestion + 1) / questions.length) * 100}%',
                backgroundColor: "#28a745",
                transition: "width 0.5s ease",
              }}
            ></div>
          </div>

          <h2>Question {currentQuestion + 1}/{questions.length}</h2>
          <h3 dangerouslySetInnerHTML={{ __html: questions[currentQuestion].questionText }} />
          {questions[currentQuestion].answerOptions.map((answerOption, index) => {
            let bgColor = "";
            if (selectedAnswer !== null) {
              if (index === selectedAnswer) bgColor = answerOption.isCorrect ? "green" : "red";
              else if (answerOption.isCorrect) bgColor = "green";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(answerOption.isCorrect, index)}
                disabled={selectedAnswer !== null}
                style={{
                  display: "block",
                  margin: "10px auto",
                  padding: "10px",
                  fontSize: "16px",
                  width: "250px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: bgColor || "#007bff",
                  color: "white",
                  cursor: "pointer",
                }}
                dangerouslySetInnerHTML={{ __html: answerOption.answerText }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;