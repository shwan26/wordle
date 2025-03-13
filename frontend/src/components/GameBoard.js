import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GameBoard.css';

const GameBoard = () => {
  const [solution, setSolution] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/new-game')
      .then(res => {
        if (res.data.solution) {
          console.log("Received solution from backend:", res.data.solution);
          setSolution(res.data.solution); // Ensure solution is set
        } else {
          console.error("Error: No solution received from backend.");
          setMessage("Error: No solution received from server.");
        }
      })
      .catch(err => {
        console.error("Error fetching solution:", err);
        setMessage("Error fetching solution from server.");
      });
  }, []);
  
  const handleGuess = () => {
    if (!solution || currentGuess.length !== solution.length) {
      setMessage("Error: Enter a valid guess.");
      return;
    }
    
    let result = [];
    for (let i = 0; i < solution.length; i++) {
      if (currentGuess[i] === solution[i]) {
        result.push("correct");
      } else if (solution.includes(currentGuess[i])) {
        result.push("present");
      } else {
        result.push("absent");
      }
    }
    
    const newAttempts = [...attempts, { word: currentGuess, result }];
    setAttempts(newAttempts);
    setCurrentGuess("");

    if (newAttempts.length >= 3 && !result.every((res) => res === "correct")) {
      setMessage("❌ No more attempts left!");
      setShowSolution(true);
    } else {
      setMessage(result.every((res) => res === "correct") ? "🎉 You guessed it!" : "Try again!");
    }
  };

  return (
    <div className="game-board">
      <h1 className="game-title">🍍 Fruit Wordle Game 🍓</h1>
      <div className="input-container">
        {[...Array(solution.length || 5)].map((_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={currentGuess[i] || ""}
            onChange={(e) => {
              let newGuess = currentGuess.split("");
              newGuess[i] = e.target.value.toUpperCase();
              setCurrentGuess(newGuess.join(""));
            }}
            className="word-input"
          />
        ))}
      </div>
      <br />
      <button onClick={handleGuess} className="submit-button">Submit</button>

      {message && (
        <p className={`message ${message.includes("Error") || message.includes("❌") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      <div className="attempts-container">
        {attempts.map((attempt, i) => (
          <div key={i} className="attempt-row">
            {attempt.word.split("").map((char, j) => (
              <span 
                key={j} 
                className="letter-box"
                style={{ backgroundColor: attempt.result[j] === "correct" ? "green" : attempt.result[j] === "present" ? "yellow" : "red" }}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>

      {showSolution && (
        <div className="solution-container">
          <h3>Correct Answer:</h3>
          <div className="attempt-row">
            {solution.split("").map((char, i) => (
              <span key={i} className="letter-box" style={{ backgroundColor: "green" }}>
                {char}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
