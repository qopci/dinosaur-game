import { useEffect, useState } from 'react';
import './App.css';
import Cactus from './components/Cactus';
import Dino from './components/Dino';

function App() {
  const [cactusPosition, setCactusPosition] = useState(750);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Move cactus from right to left
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setCactusPosition((position) => {
        if (position < -50) {
          return 750;
        }

        return position - 5;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver]);

  // Increase score and update high score
  useEffect(() => {
    if (gameOver) return;

    const scoreTimer = setInterval(() => {
      setScore((currentScore) => {
        const newScore = currentScore + 1;

        setHighScore((currentHighScore) =>
          Math.max(currentHighScore, newScore)
        );

        return newScore;
      });
    }, 100);

    return () => clearInterval(scoreTimer);
  }, [gameOver]);

  // Check for collision
  useEffect(() => {
    if (gameOver) return;

    const collisionCheck = setInterval(() => {
      const dino = document.querySelector('.dino');
      const cactus = document.querySelector('.cactus');

      if (!dino || !cactus) return;

      const dinoRect = dino.getBoundingClientRect();
      const cactusRect = cactus.getBoundingClientRect();

      const collision =
        dinoRect.left + 10 < cactusRect.right - 5 &&
        dinoRect.right - 10 > cactusRect.left + 5 &&
        dinoRect.top + 8 < cactusRect.bottom &&
        dinoRect.bottom - 5 > cactusRect.top;

      if (collision) {
        setGameOver(true);
      }
    }, 30);

    return () => clearInterval(collisionCheck);
  }, [gameOver]);

  // Restart the game
  useEffect(() => {
    function handleRestart(event) {
      if (event.code === 'Space' && gameOver) {
        setCactusPosition(750);
        setScore(0);
        setGameOver(false);
      }
    }

    window.addEventListener('keydown', handleRestart);

    return () => {
      window.removeEventListener('keydown', handleRestart);
    };
  }, [gameOver]);

  return (
    <main className="page">
      <div className="game">
        <div className="score">
          HI {String(highScore).padStart(5, '0')}&nbsp;&nbsp;
          {String(score).padStart(5, '0')}
        </div>

        <Dino />

        <Cactus position={cactusPosition} />

        <div className="ground"></div>

        {gameOver && (
          <div className="game-over">
            GAME OVER
            <div className="restart">PRESS SPACE TO RESTART</div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;