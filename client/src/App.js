import React, { useState, useEffect } from 'react';
import db from './db';
import './App.css';

const quizData = [
  { question: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], answer: 'Mercury' },
  { question: 'Which data structure organizes items in a FIFO manner?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 'Queue' },
  { question: 'Which of the following is primarily used for structuring web pages?', options: ['Python', 'Java', 'HTML', 'C++'], answer: 'HTML' },
  { question: 'Which chemical symbol stands for Gold?', options: ['Au', 'Gd', 'Ag', 'Pt'], answer: 'Au' },
  { question: 'Which of these processes is not typically involved in refining petroleum?', options: ['Fractional distillation', 'Cracking', 'Polymerization', 'Filtration'], answer: 'Filtration' },
  { question: 'What is the value of 12 + 28?', answer: 40 },
  { question: 'How many states are there in the United States?', answer: 50 },
  { question: 'In which year was the Declaration of Independence signed?', answer: 1776 },
  { question: 'What is the value of pi rounded to the nearest integer?', answer: 3 },
  { question: 'If a car travels at 60 mph for 2 hours, how many miles does it travel?', answer: 120 }
];

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    const history = await db.quizHistory.toArray();
    setQuizHistory(history);
  };

  const handleAnswer = async (answer) => {
    const isCorrect = answer.toString().toLowerCase() === quizData[currentQuestion].answer.toString().toLowerCase();
    if (isCorrect) setScore(score + 1);
    setUserAnswers([...userAnswers, { question: quizData[currentQuestion].question, answer, isCorrect }]);
    setTimeLeft(30);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const quizRecord = {
        date: new Date().toLocaleString(),
        score: score + (isCorrect ? 1 : 0),
        answers: [...userAnswers, { question: quizData[currentQuestion].question, answer, isCorrect }]
      };
      await db.quizHistory.add(quizRecord);
      fetchQuizHistory();
      alert(`Quiz completed! Your score: ${quizRecord.score}/${quizData.length}`);
      resetQuiz();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setTimeLeft(30);
  };

  return (
    <div className="quiz-container">
      <h2>Quiz Platform</h2>
      <p className="timer">Time Left: {timeLeft}s</p>
      <div className="question-box">
        <h3>{quizData[currentQuestion].question}</h3>
        {quizData[currentQuestion].options ? (
          <div className="options">
            {quizData[currentQuestion].options.map((option, index) => (
              <button key={index} className="option-button" onClick={() => handleAnswer(option)}>{option}</button>
            ))}
          </div>
        ) : (
          <input
            className="input-box"
            type="number"
            onBlur={(e) => handleAnswer(e.target.value)}
            placeholder="Enter your answer"
          />
        )}
      </div>
      <p className="score">Score: {score}/{quizData.length}</p>

      <h3>Quiz History</h3>
      <ul className="history-list">
        {quizHistory.map((record) => (
          <li key={record.id}>
            <strong>Date:</strong> {record.date} | <strong>Score:</strong> {record.score}/{quizData.length}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
