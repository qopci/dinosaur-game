import './App.css';

import { useEffect, useRef, useState } from 'react';
import Dino from './components/Dino';
import Cactus from './components/Cactus';
import Cloud from './components/Cloud';
import Bird from './components/Bird';

function App() {
  const [obstacles, setObstacles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem('dinoHighScore')) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(11);

  const obstacleId = useRef(0);
  const cloudId = useRef(0);
  const recentPatterns = useRef([]);
  const scoreRef = useRef(0);

  // -----------------------------
  // CREATE OBSTACLE PATTERNS
  // -----------------------------

  function createPattern(startX, currentScore) {
    const singleCactus = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
    ];

    const doubleCactus = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 34,
      },
    ];

    const tripleCactus = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 34,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 68,
      },
    ];

    const lowBird = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 70,
      },
    ];

    const highBird = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 125,
      },
    ];

    const cactusThenLowBird = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX + 360,
        height: 70,
      },
    ];

    const cactusThenHighBird = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX + 360,
        height: 125,
      },
    ];

    const highBirdThenCactus = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 125,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 360,
      },
    ];

    const lowBirdThenCactus = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 70,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 360,
      },
    ];

    const doubleCactusThenHighBird = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 34,
      },
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX + 390,
        height: 125,
      },
    ];

    const highBirdThenDoubleCactus = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 125,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 360,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 394,
      },
    ];

    let patterns = [];

    // --------------------------------
    // VERY EASY BEGINNING
    // --------------------------------

    if (currentScore < 100) {
      patterns = [
        'singleCactus',
        'singleCactus',
        'singleCactus',
        'doubleCactus',
      ];
    }

    // --------------------------------
    // BIRDS START APPEARING
    // --------------------------------

    else if (currentScore < 300) {
      patterns = [
        'singleCactus',
        'singleCactus',
        'doubleCactus',
        'lowBird',
        'highBird',
        'singleCactus',
        'cactusThenLowBird',
        'lowBirdThenCactus',
      ];
    }

    // --------------------------------
    // MORE VARIETY
    // --------------------------------

    else if (currentScore < 600) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'lowBird',
        'highBird',
        'cactusThenLowBird',
        'cactusThenHighBird',
        'highBirdThenCactus',
        'lowBirdThenCactus',
      ];
    }

    // --------------------------------
    // LATE GAME
    // --------------------------------

    else if (currentScore < 1000) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'lowBird',
        'highBird',
        'cactusThenLowBird',
        'cactusThenHighBird',
        'highBirdThenCactus',
        'lowBirdThenCactus',
        'doubleCactusThenHighBird',
      ];
    }

    // --------------------------------
    // VERY LATE GAME
    // --------------------------------

    else {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'lowBird',
        'highBird',
        'cactusThenLowBird',
        'cactusThenHighBird',
        'highBirdThenCactus',
        'lowBirdThenCactus',
        'doubleCactusThenHighBird',
        'highBirdThenDoubleCactus',
      ];
    }

    // Don't repeatedly choose the same patterns
    let availablePatterns = patterns.filter(
      (pattern) => !recentPatterns.current.includes(pattern)
    );

    if (availablePatterns.length === 0) {
      availablePatterns = patterns;
    }

    const patternName =
      availablePatterns[
        Math.floor(Math.random() * availablePatterns.length)
      ];

    recentPatterns.current.push(patternName);

    if (recentPatterns.current.length > 3) {
      recentPatterns.current.shift();
    }

    switch (patternName) {
      case 'doubleCactus':
        return doubleCactus();

      case 'tripleCactus':
        return tripleCactus();

      case 'lowBird':
        return lowBird();

      case 'highBird':
        return highBird();

      case 'cactusThenLowBird':
        return cactusThenLowBird();

      case 'cactusThenHighBird':
        return cactusThenHighBird();

      case 'highBirdThenCactus':
        return highBirdThenCactus();

      case 'lowBirdThenCactus':
        return lowBirdThenCactus();

      case 'doubleCactusThenHighBird':
        return doubleCactusThenHighBird();

      case 'highBirdThenDoubleCactus':
        return highBirdThenDoubleCactus();

      case 'singleCactus':
      default:
        return singleCactus();
    }
  }

  // -----------------------------
  // CREATE CLOUD
  // -----------------------------

  function createCloud(startX) {
    return {
      id: cloudId.current++,
      position: startX,
      top: 40 + Math.random() * 100,
    };
  }

  // -----------------------------
  // SET UP / RESET GAME
  // -----------------------------

  function setupGame() {
    obstacleId.current = 0;
    cloudId.current = 0;
    recentPatterns.current = [];
    scoreRef.current = 0;

    const startingObstacles = [];

    // Start obstacles far apart
    let startX = 850;

    for (let i = 0; i < 4; i++) {
      const pattern = createPattern(startX, 0);

      startingObstacles.push(...pattern);

      // Lots of space between starting patterns
      startX += 450 + Math.random() * 220;
    }

    const startingClouds = [];

    for (let i = 0; i < 7; i++) {
      startingClouds.push(
        createCloud(
          100 + i * 180 + Math.random() * 150
        )
      );
    }

    setObstacles(startingObstacles);
    setClouds(startingClouds);
    setScore(0);
    setGameOver(false);

    // Start slow
    setGameSpeed(11);
  }

  // -----------------------------
  // INITIAL GAME
  // -----------------------------

  useEffect(() => {
    setupGame();
  }, []);

  // -----------------------------
  // KEEP SCORE REF UPDATED
  // -----------------------------

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // -----------------------------
  // RESTART WITH SPACE
  // -----------------------------

  useEffect(() => {
    function handleRestart(event) {
      if (
        event.code === 'Space' &&
        gameOver
      ) {
        setupGame();
      }
    }

    window.addEventListener(
      'keydown',
      handleRestart
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleRestart
      );
    };
  }, [gameOver]);

  // -----------------------------
  // INCREASE GAME SPEED SLOWLY
  // -----------------------------

  useEffect(() => {
    /*
      Start at 11.

      Every 200 points:
      +1 speed

      Maximum speed:
      18

      This keeps the game playable
      for longer runs.
    */

    const newSpeed =
      11 + Math.floor(score / 200);

    setGameSpeed(
      Math.min(newSpeed, 18)
    );
  }, [score]);

  // -----------------------------
  // MOVE OBSTACLES
  // -----------------------------

  useEffect(() => {
    if (gameOver) return;

    const movement = setInterval(() => {
      setObstacles(
        (currentObstacles) =>
          currentObstacles
            .map((obstacle) => ({
              ...obstacle,
              position:
                obstacle.position - gameSpeed,
            }))
            .filter(
              (obstacle) =>
                obstacle.position > -100
            )
      );
    }, 30);

    return () => {
      clearInterval(movement);
    };
  }, [gameSpeed, gameOver]);

  // -----------------------------
  // SPAWN NEW OBSTACLES
  // -----------------------------

  useEffect(() => {
    if (gameOver) return;

    const spawn = setInterval(() => {
      setObstacles(
        (currentObstacles) => {
          if (
            currentObstacles.length === 0
          ) {
            return currentObstacles;
          }

          const furthestRight =
            Math.max(
              ...currentObstacles.map(
                (obstacle) =>
                  obstacle.position
              )
            );

          /*
            Don't spawn another obstacle
            while one is still too far right.

            This creates more breathing room.
          */
          if (furthestRight > 620) {
            return currentObstacles;
          }

          const newPattern =
            createPattern(
              1100 +
                Math.random() * 180,
              scoreRef.current
            );

          return [
            ...currentObstacles,
            ...newPattern,
          ];
        }
      );
    }, 100);

    return () => {
      clearInterval(spawn);
    };
  }, [gameSpeed, gameOver]);

  // -----------------------------
  // MOVE CLOUDS
  // -----------------------------

  useEffect(() => {
    if (gameOver) return;

    const cloudMovement =
      setInterval(() => {
        setClouds(
          (currentClouds) => {
            let updatedClouds =
              currentClouds
                .map((cloud) => ({
                  ...cloud,
                  position:
                    cloud.position -
                    gameSpeed * 0.18,
                }))
                .filter(
                  (cloud) =>
                    cloud.position > -100
                );

            const furthestCloud =
              updatedClouds.length > 0
                ? Math.max(
                    ...updatedClouds.map(
                      (cloud) =>
                        cloud.position
                    )
                  )
                : 0;

            if (furthestCloud < 760) {
              const numberOfClouds =
                1 +
                Math.floor(
                  Math.random() * 3
                );

              for (
                let i = 0;
                i < numberOfClouds;
                i++
              ) {
                updatedClouds.push(
                  createCloud(
                    1000 +
                      i *
                        (80 +
                          Math.random() *
                            80)
                  )
                );
              }
            }

            return updatedClouds;
          }
        );
      }, 50);

    return () => {
      clearInterval(cloudMovement);
    };
  }, [gameSpeed, gameOver]);

  // -----------------------------
  // SCORE
  // -----------------------------

  useEffect(() => {
    if (gameOver) return;

    const scoreTimer =
      setInterval(() => {
        setScore(
          (currentScore) =>
            currentScore + 1
        );
      }, 100);

    return () => {
      clearInterval(scoreTimer);
    };
  }, [gameOver]);

  // -----------------------------
  // HIGH SCORE
  // -----------------------------

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);

      localStorage.setItem(
        'dinoHighScore',
        score
      );
    }
  }, [score, highScore]);

  // -----------------------------
  // COLLISION DETECTION
  // -----------------------------

  useEffect(() => {
    if (gameOver) return;

    const collisionCheck =
      setInterval(() => {
        const dino =
          document.querySelector(
            '.dino'
          );

        if (!dino) return;

        const dinoRect =
          dino.getBoundingClientRect();

        const obstaclesOnScreen =
          document.querySelectorAll(
            '.cactus, .bird'
          );

        obstaclesOnScreen.forEach(
          (obstacle) => {
            const obstacleRect =
              obstacle.getBoundingClientRect();

            // Make collision slightly forgiving
            const dinoPaddingX = 8;
            const dinoPaddingY = 6;

            const obstaclePaddingX = 3;
            const obstaclePaddingY = 3;

            const horizontalCollision =
              dinoRect.right -
                  dinoPaddingX >
                obstacleRect.left +
                  obstaclePaddingX &&
              dinoRect.left +
                  dinoPaddingX <
                obstacleRect.right -
                  obstaclePaddingX;

            const verticalCollision =
              dinoRect.bottom -
                  dinoPaddingY >
                obstacleRect.top +
                  obstaclePaddingY &&
              dinoRect.top +
                  dinoPaddingY <
                obstacleRect.bottom -
                  obstaclePaddingY;

            if (
              horizontalCollision &&
              verticalCollision
            ) {
              setGameOver(true);
            }
          }
        );
      }, 10);

    return () => {
      clearInterval(
        collisionCheck
      );
    };
  }, [gameOver]);

  // -----------------------------
  // GAME SCREEN
  // -----------------------------

  return (
    <div className="game">

      {/* CLOUDS */}
      <div className="cloud-layer">
        {clouds.map((cloud) => (
          <Cloud
            key={cloud.id}
            position={cloud.position}
            top={cloud.top}
          />
        ))}
      </div>

      {/* SCORE */}
      <div className="score">
        HI{' '}
        {String(highScore).padStart(
          5,
          '0'
        )}{' '}
        {String(score).padStart(
          5,
          '0'
        )}
      </div>

      {/* DINO */}
      <Dino gameOver={gameOver} />

      {/* OBSTACLES */}
      {obstacles.map((obstacle) => {
        if (
          obstacle.type ===
          'cactus'
        ) {
          return (
            <Cactus
              key={obstacle.id}
              position={
                obstacle.position
              }
            />
          );
        }

        if (
          obstacle.type ===
          'bird'
        ) {
          return (
            <Bird
              key={obstacle.id}
              position={
                obstacle.position
              }
              top={obstacle.height}
              gameOver={gameOver}
            />
          );
        }

        return null;
      })}

      {/* GAME OVER */}
      {gameOver && (
        <div className="game-over">
          <div>
            GAME OVER
          </div>

          <div className="restart-text">
            PRESS SPACE TO RESTART
          </div>
        </div>
      )}

      {/* GROUND */}
      <div className="ground"></div>

    </div>
  );
}

export default App;