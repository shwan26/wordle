import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './GameBoard.css';

const GameBoard = () => {
  const [solution, setSolution] = useState('');
  const [solutionImage, setSolutionImage] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [message, setMessage] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [animation, setAnimation] = useState(null);

  const resetGame = useCallback(() => {
    setCurrentGuess('');
    setAttempts([]);
    setMessage('');
    setShowSolution(false);
    setAnimation(null);
  }, []);

  const fetchNewGame = useCallback(() => {
    axios.get('http://127.0.0.1:5000/new-game')
      .then(res => {
        if (res.data.solution) {
          console.log("Received solution from backend:", res.data.solution);
          console.log("Image URL:", res.data.image_url);
          setSolution(res.data.solution);
          setSolutionImage(res.data.image_url || '');
          resetGame();  // ✅ Ensure resetGame is stable using useCallback
        } else {
          console.error("Error: No solution received from backend.");
          setMessage("Error: No solution received from server.");
        }
      })
      .catch(err => {
        console.error("Error fetching solution:", err);
        setMessage("Error fetching solution from server.");
      });
  }, [resetGame]); // ✅ Add resetGame as a dependency to keep it stable

  useEffect(() => {
    fetchNewGame();
  }, [fetchNewGame]); // ✅ Now only runs ONCE per component mount


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

    if (newAttempts.length >= 3 || result.every((res) => res === "correct")) {
      setMessage("🎉 Here is the correct answer!");
      setShowSolution(true);
      setAnimation("fruits");
      setTimeout(() => setAnimation(null), 2000);
    } else {
      setMessage("Try again!");
      setAnimation("chilies");
      setTimeout(() => setAnimation(null), 2000);
    }
  };

  return (
    <div className={`game-board ${animation === "fruits" ? "fruit-pop" : animation === "chilies" ? "chili-pop" : ""}`}>
      <h1 className="game-title">🍍 Fruit Wordle Game 🍓</h1>
      <div className="input-container">
        {[...Array(solution.length || 5)].map((_, i) => (
          <input
            key={i}
            id={`char-${i}`}
            name={`char-${i}`}
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
      <br />
      {showSolution && (
        <button onClick={fetchNewGame} className="restart-button">Restart Game</button>
      )}

      {message && (
        <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
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

      {showSolution && solutionImage && (
        <div className="solution-image">
            <h4>{solution}</h4>
            <img
            src={solutionImage}
            alt={solution}
            className="fruit-image"
            onError={(e) => {
                console.error("Image failed to load:", e.target.src);
                e.target.style.display = 'none';
            }}
            />
        </div>
        )}
    </div>
  );
};

export default GameBoard;
