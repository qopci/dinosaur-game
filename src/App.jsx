import './App.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Dino from './components/Dino';
import Cactus from './components/Cactus';
import Cloud from './components/Cloud';
import Bird from './components/Bird';

function App() {
  const [obstacles, setObstacles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(17);
  const [isCrouching, setIsCrouching] = useState(false);
  const [dinoReset, setDinoReset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [colorMode, setColorMode] = useState(false);
  const [weather, setWeather] = useState('clear');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState('en');

  const obstacleId = useRef(0);
  const cloudId = useRef(0);
  const recentPatterns = useRef([]);
  const scoreRef = useRef(0);
  const spawnTimer = useRef(0);
  const audioContextRef = useRef(null);

  const translations = {
    en: {
      title: 'Dinosaur Game - Chrome',
      jump: 'Jump',
      crouch: 'Crouch',

      dark: '☾ DARK',
      light: '☀ LIGHT',

      soundOn: '🔊 SOUND ON',
      muted: '🔇 MUTED',

      classic: '🌑 CLASSIC',
      color: '🎨 COLOR',

      clear: '☁️ CLEAR',
      rain: '🌧️ RAIN',
      sunny: '☀️ SUNNY',

      fullscreen: '⛶ FULLSCREEN',
      exitFullscreen: '⛶ EXIT FULLSCREEN',

      startTitle: 'DINO RUN',
      start: 'START',
      pressEnterStart: 'PRESS ENTER TO START',

      gameOver: 'GAME OVER',
      restart: 'RESTART',
      pressEnterRestart: 'PRESS ENTER TO RESTART',

      aboutTitle: 'ABOUT DINO RUN',

      intro: (
        <>
          Welcome to <strong>Dino Run</strong> — a custom endless runner
          built from scratch with React and JavaScript.
        </>
      ),

      runTitle: 'RUN & SURVIVE',
      runText:
        'Run as far as you can while avoiding cacti and flying birds. The longer you survive, the higher your score gets.',

      fasterTitle: 'GET FASTER',
      fasterText:
        'The game gradually increases in speed as your score grows, making each run more challenging than the last.',

      controlsTitle: 'CONTROLS',
      controlsText:
        "Press SPACE or UP to jump. Hold DOWN to crouch underneath flying obstacles and react to what's coming next.",

      customizeTitle: 'CUSTOMIZE',
      customizeText:
        'Switch between Classic and Color modes, change the weather, toggle sounds, use Dark Mode, or play in Fullscreen.',

      highScoreTitle: 'HIGH SCORE',
      highScoreText:
        'Your current score and best score are displayed above the game. Keep playing and try to beat your personal record.',

      dynamicTitle: 'DYNAMIC WORLD',
      dynamicText:
        'Clouds move across the sky while different weather conditions create rain or bring out the sun during your run.',

      infoFooter:
        'Built as a personal coding project to practice React, JavaScript, CSS, animations, game logic, and UI design.',

      language: 'Language:',
      madeBy: 'Made by Diana',
      contact: 'Contact Me',
    },

    es: {
      title: 'Juego de Dinosaurio - Chrome',
      jump: 'Saltar',
      crouch: 'Agacharse',

      dark: '☾ OSCURO',
      light: '☀ CLARO',

      soundOn: '🔊 SONIDO',
      muted: '🔇 SILENCIADO',

      classic: '🌑 CLÁSICO',
      color: '🎨 COLOR',

      clear: '☁️ DESPEJADO',
      rain: '🌧️ LLUVIA',
      sunny: '☀️ SOLEADO',

      fullscreen: '⛶ PANTALLA COMPLETA',
      exitFullscreen: '⛶ SALIR DE PANTALLA COMPLETA',

      startTitle: 'DINO RUN',
      start: 'INICIAR',
      pressEnterStart: 'PULSA ENTER PARA INICIAR',

      gameOver: 'FIN DEL JUEGO',
      restart: 'REINICIAR',
      pressEnterRestart: 'PULSA ENTER PARA REINICIAR',

      aboutTitle: 'SOBRE DINO RUN',

      intro: (
        <>
          Bienvenido a <strong>Dino Run</strong> — un juego de carrera
          infinita creado desde cero con React y JavaScript.
        </>
      ),

      runTitle: 'CORRE Y SOBREVIVE',
      runText:
        'Corre lo más lejos que puedas mientras evitas cactus y pájaros voladores. Cuanto más sobrevivas, mayor será tu puntuación.',

      fasterTitle: 'AUMENTA LA VELOCIDAD',
      fasterText:
        'El juego aumenta gradualmente su velocidad a medida que sube tu puntuación, haciendo que cada partida sea más difícil.',

      controlsTitle: 'CONTROLES',
      controlsText:
        'Pulsa ESPACIO o ARRIBA para saltar. Mantén ABAJO para agacharte debajo de los obstáculos voladores y reaccionar a lo que viene.',

      customizeTitle: 'PERSONALIZA',
      customizeText:
        'Cambia entre los modos Clásico y Color, cambia el clima, activa o desactiva los sonidos, usa el Modo Oscuro o juega en pantalla completa.',

      highScoreTitle: 'PUNTUACIÓN MÁXIMA',
      highScoreText:
        'Tu puntuación actual y tu mejor puntuación aparecen encima del juego. Sigue jugando e intenta superar tu récord personal.',

      dynamicTitle: 'MUNDO DINÁMICO',
      dynamicText:
        'Las nubes se mueven por el cielo mientras las diferentes condiciones climáticas crean lluvia o hacen aparecer el sol durante tu partida.',

      infoFooter:
        'Creado como proyecto personal de programación para practicar React, JavaScript, CSS, animaciones, lógica de juegos y diseño de interfaces.',

      language: 'Idioma:',
      madeBy: 'Hecho por Diana',
      contact: 'Contáctame',
    },

    ru: {
      title: 'Игра с динозавром - Chrome',
      jump: 'Прыжок',
      crouch: 'Приседание',

      dark: '☾ ТЕМНАЯ',
      light: '☀ СВЕТЛАЯ',

      soundOn: '🔊 ЗВУК ВКЛ',
      muted: '🔇 БЕЗ ЗВУКА',

      classic: '🌑 КЛАССИКА',
      color: '🎨 ЦВЕТ',

      clear: '☁️ ЯСНО',
      rain: '🌧️ ДОЖДЬ',
      sunny: '☀️ СОЛНЕЧНО',

      fullscreen: '⛶ ПОЛНЫЙ ЭКРАН',
      exitFullscreen: '⛶ ВЫЙТИ ИЗ ПОЛНОГО ЭКРАНА',

      startTitle: 'DINO RUN',
      start: 'НАЧАТЬ',
      pressEnterStart: 'НАЖМИТЕ ENTER, ЧТОБЫ НАЧАТЬ',

      gameOver: 'ИГРА ОКОНЧЕНА',
      restart: 'ЗАНОВО',
      pressEnterRestart: 'НАЖМИТЕ ENTER, ЧТОБЫ НАЧАТЬ ЗАНОВО',

      aboutTitle: 'О DINO RUN',

      intro: (
        <>
          Добро пожаловать в <strong>Dino Run</strong> — бесконечную игру,
          созданную с нуля с помощью React и JavaScript.
        </>
      ),

      runTitle: 'БЕГИ И ВЫЖИВАЙ',
      runText:
        'Беги как можно дальше, избегая кактусов и летающих птиц. Чем дольше ты выживаешь, тем выше становится твой счет.',

      fasterTitle: 'СТАНОВИСЬ БЫСТРЕЕ',
      fasterText:
        'Скорость игры постепенно увеличивается вместе с твоим счетом, делая каждую попытку сложнее предыдущей.',

      controlsTitle: 'УПРАВЛЕНИЕ',
      controlsText:
        'Нажми ПРОБЕЛ или ВВЕРХ, чтобы прыгнуть. Удерживай ВНИЗ, чтобы присесть под летающими препятствиями.',

      customizeTitle: 'НАСТРОЙКИ',
      customizeText:
        'Переключайся между классическим и цветным режимами, меняй погоду, включай или выключай звук, используй темный режим или полный экран.',

      highScoreTitle: 'РЕКОРД',
      highScoreText:
        'Текущий счет и лучший результат отображаются над игрой. Продолжай играть и попробуй побить свой личный рекорд.',

      dynamicTitle: 'ДИНАМИЧНЫЙ МИР',
      dynamicText:
        'Облака движутся по небу, а разные погодные условия создают дождь или показывают солнце во время игры.',

      infoFooter:
        'Создано как личный проект для практики React, JavaScript, CSS, анимаций, игровой логики и дизайна интерфейса.',

      language: 'Язык:',
      madeBy: 'Автор: Diana',
      contact: 'Связаться',
    },
  };

  const t = translations[language];

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();
    }

    return audioContextRef.current;
  }

  function playDeathSound() {
    if (!soundEnabled) return;

    const audioContext = getAudioContext();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'square';

    oscillator.frequency.setValueAtTime(
      220,
      audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      80,
      audioContext.currentTime + 0.35
    );

    gain.gain.setValueAtTime(
      0.12,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.35
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(
      audioContext.currentTime + 0.35
    );
  }

  function cycleWeather() {
    setWeather((currentWeather) => {
      if (currentWeather === 'clear') return 'rain';
      if (currentWeather === 'rain') return 'sunny';
      return 'clear';
    });
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    }

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

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
        position: startX + 36,
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
        position: startX + 36,
      },
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX + 72,
      },
    ];

    const highBird = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 150,
      },
    ];

    const lowBird = () => [
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX,
        height: 100,
      },
    ];

    const cactusThenBird = () => [
      {
        id: obstacleId.current++,
        type: 'cactus',
        position: startX,
      },
      {
        id: obstacleId.current++,
        type: 'bird',
        position: startX + 500,
        height: 150,
      },
    ];

    let patterns;

    if (currentScore < 100) {
      patterns = [
        'singleCactus',
        'singleCactus',
        'singleCactus',
        'singleCactus',
        'doubleCactus',
      ];
    } else if (currentScore < 200) {
      patterns = [
        'singleCactus',
        'singleCactus',
        'doubleCactus',
        'doubleCactus',
        'highBird',
      ];
    } else if (currentScore < 300) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'lowBird',
      ];
    } else if (currentScore < 500) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'highBird',
        'lowBird',
        'cactusThenBird',
      ];
    } else if (currentScore < 700) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'highBird',
        'lowBird',
        'lowBird',
        'cactusThenBird',
      ];
    } else if (currentScore < 850) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'highBird',
        'lowBird',
        'lowBird',
        'cactusThenBird',
      ];
    } else if (currentScore < 1000) {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'highBird',
        'highBird',
        'lowBird',
        'lowBird',
        'cactusThenBird',
      ];
    } else {
      patterns = [
        'singleCactus',
        'doubleCactus',
        'tripleCactus',
        'highBird',
        'highBird',
        'highBird',
        'lowBird',
        'lowBird',
        'cactusThenBird',
        'cactusThenBird',
      ];
    }

    let availablePatterns = patterns.filter(
      (pattern) =>
        !recentPatterns.current.includes(pattern)
    );

    if (availablePatterns.length === 0) {
      availablePatterns = patterns;
    }

    const patternName =
      availablePatterns[
      Math.floor(
        Math.random() * availablePatterns.length
      )
      ];

    recentPatterns.current.push(patternName);

    if (recentPatterns.current.length > 2) {
      recentPatterns.current.shift();
    }

    switch (patternName) {
      case 'doubleCactus':
        return doubleCactus();

      case 'tripleCactus':
        return tripleCactus();

      case 'highBird':
        return highBird();

      case 'lowBird':
        return lowBird();

      case 'cactusThenBird':
        return cactusThenBird();

      default:
        return singleCactus();
    }
  }

  function createCloud(startX) {
    return {
      id: cloudId.current++,
      position: startX,
      top: 40 + Math.random() * 100,
    };
  }

  function setupGame() {
    obstacleId.current = 0;
    cloudId.current = 0;
    recentPatterns.current = [];
    scoreRef.current = 0;
    spawnTimer.current = 0;

    setDinoReset(
      (current) => current + 1
    );

    const startingObstacles = [];
    let startX = 1000;

    for (let i = 0; i < 3; i++) {
      const pattern = createPattern(
        startX,
        0
      );

      startingObstacles.push(
        ...pattern
      );

      startX += 900;
    }

    const startingClouds = [];

    for (let i = 0; i < 7; i++) {
      startingClouds.push(
        createCloud(
          100 +
          i * 180 +
          Math.random() * 150
        )
      );
    }

    setObstacles(
      startingObstacles
    );

    setClouds(startingClouds);
    setScore(0);
    setGameSpeed(17);
    setIsCrouching(false);
    setGameOver(false);
    setGameStarted(true);
  }

  useEffect(() => {
    setObstacles([]);
    setClouds([]);
    setScore(0);
    setHighScore(0);
    setGameSpeed(17);
    setGameOver(false);
    setIsCrouching(false);
    setGameStarted(false);
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.code === 'Space' ||
        event.code === 'ArrowUp' ||
        event.code === 'ArrowDown'
      ) {
        event.preventDefault();
      }

      if (
        event.code === 'Enter' &&
        !gameStarted &&
        !gameOver
      ) {
        setupGame();
        return;
      }

      if (
        event.code === 'Enter' &&
        gameOver
      ) {
        setupGame();
        return;
      }

      if (
        event.code === 'ArrowDown' &&
        gameStarted &&
        !gameOver
      ) {
        setIsCrouching(true);
      }
    }

    function handleKeyUp(event) {
      if (
        event.code === 'ArrowDown' &&
        gameStarted &&
        !gameOver
      ) {
        setIsCrouching(false);
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    window.addEventListener(
      'keyup',
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );

      window.removeEventListener(
        'keyup',
        handleKeyUp
      );
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted) return;

    const newSpeed =
      17 + score * 0.015;

    setGameSpeed(
      Math.min(newSpeed, 30)
    );
  }, [score, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const movement = setInterval(() => {
      setObstacles(
        (currentObstacles) =>
          currentObstacles
            .map((obstacle) => ({
              ...obstacle,
              position:
                obstacle.position -
                gameSpeed * 0.53,
            }))
            .filter(
              (obstacle) =>
                obstacle.position >
                -120
            )
      );
    }, 16);

    return () =>
      clearInterval(movement);
  }, [
    gameStarted,
    gameOver,
    gameSpeed,
  ]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    spawnTimer.current = 0;

    const spawn = setInterval(() => {
      spawnTimer.current += 50;

      const currentScore =
        scoreRef.current;

      let spawnDelay;

      if (currentScore < 100) {
        spawnDelay = 2400;
      } else if (currentScore < 200) {
        spawnDelay = 2100;
      } else if (currentScore < 300) {
        spawnDelay = 1600;
      } else if (currentScore < 500) {
        spawnDelay = 1450;
      } else if (currentScore < 600) {
        spawnDelay = 1250;
      } else if (currentScore < 700) {
        spawnDelay = 1150;
      } else if (currentScore < 800) {
        spawnDelay = 1050;
      } else if (currentScore < 900) {
        spawnDelay = 950;
      } else if (currentScore < 1000) {
        spawnDelay = 875;
      } else if (currentScore < 1200) {
        spawnDelay = 800;
      } else if (currentScore < 1500) {
        spawnDelay = 750;
      } else {
        spawnDelay = 700;
      }

      if (
        spawnTimer.current >=
        spawnDelay
      ) {
        spawnTimer.current = 0;

        const newPattern =
          createPattern(
            1050,
            currentScore
          );

        setObstacles(
          (currentObstacles) => [
            ...currentObstacles,
            ...newPattern,
          ]
        );
      }
    }, 50);

    return () =>
      clearInterval(spawn);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

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
                    gameSpeed *
                    0.18 *
                    0.53,
                }))
                .filter(
                  (cloud) =>
                    cloud.position >
                    -120
                );

            const furthestCloud =
              updatedClouds.length >
                0
                ? Math.max(
                  ...updatedClouds.map(
                    (cloud) =>
                      cloud.position
                  )
                )
                : 0;

            if (
              furthestCloud <
              760
            ) {
              const numberOfClouds =
                1 +
                Math.floor(
                  Math.random() * 2
                );

              for (
                let i = 0;
                i <
                numberOfClouds;
                i++
              ) {
                updatedClouds.push(
                  createCloud(
                    1000 +
                    i * 120
                  )
                );
              }
            }

            return updatedClouds;
          }
        );
      }, 16);

    return () =>
      clearInterval(
        cloudMovement
      );
  }, [
    gameStarted,
    gameOver,
    gameSpeed,
  ]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const scoreTimer =
      setInterval(() => {
        setScore(
          (currentScore) =>
            currentScore + 1
        );
      }, 100);

    return () =>
      clearInterval(scoreTimer);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    if (gameOver) {
      playDeathSound();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

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

            const dinoPaddingX =
              isCrouching
                ? 20
                : 18;

            const dinoPaddingY =
              isCrouching
                ? 18
                : 12;

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

    return () =>
      clearInterval(
        collisionCheck
      );
  }, [
    gameStarted,
    gameOver,
    isCrouching,
  ]);

  return (
    <div
      className={`
        page
        ${darkMode ? 'dark-mode' : ''}
        ${colorMode ? 'color-mode' : ''}
        ${gameOver ? 'game-over-active' : ''}
        ${isFullscreen ? 'fullscreen-active' : ''}
        weather-${weather}
      `}
    >
      <header className="game-header">
        <h1>{t.title}</h1>

        <p className="controls">
          <span>SPACE / ↑</span>{' '}
          {t.jump}
          {'   '}
          <span>↓</span>{' '}
          {t.crouch}
        </p>

        <button
          type="button"
          className="dark-mode-button"
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            setDarkMode(
              (current) => !current
            )
          }
        >
          {darkMode
            ? t.light
            : t.dark}
        </button>
      </header>

      <main className="game-container">
        <div className="game">

          {gameStarted &&
            weather === 'sunny' && (
              <div className="sun">
                <div className="sun-rays"></div>
              </div>
            )}

          {gameStarted &&
            weather === 'rain' && (
              <div className="rain-layer">
                {Array.from({
                  length: 70,
                }).map(
                  (_, index) => (
                    <span
                      key={index}
                      className="rain-drop"
                      style={{
                        left: `${(index * 37) %
                          100
                          }%`,
                        animationDelay: `${(index * 0.13) %
                          1.5
                          }s`,
                        animationDuration: `${0.55 +
                          ((index * 7) %
                            5) *
                          0.1
                          }s`,
                      }}
                    />
                  )
                )}
              </div>
            )}

          {gameStarted &&
            weather !== 'sunny' && (
              <div className="cloud-layer">
                {clouds.map(
                  (cloud) => (
                    <Cloud
                      key={cloud.id}
                      position={
                        cloud.position
                      }
                      top={
                        cloud.top
                      }
                    />
                  )
                )}
              </div>
            )}

          <div className="score">
            HI{' '}
            {String(
              highScore
            ).padStart(5, '0')}{' '}
            {String(score).padStart(
              5,
              '0'
            )}
          </div>

          {gameStarted && (
            <Dino
              gameOver={gameOver}
              isCrouching={
                isCrouching
              }
              reset={dinoReset}
              soundEnabled={
                soundEnabled
              }
              getAudioContext={
                getAudioContext
              }
            />
          )}

          {obstacles.map(
            (obstacle) => {
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
                    top={
                      obstacle.height
                    }
                    gameOver={
                      gameOver
                    }
                  />
                );
              }

              return null;
            }
          )}

          {!gameStarted && (
            <div className="start-screen">
              <div className="start-title">
                {t.startTitle}
              </div>

              <button
                className="start-button"
                onClick={setupGame}
              >
                {t.start}
              </button>

              <div className="start-hint">
                {t.pressEnterStart}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="game-over">
              <div className="game-over-title">
                {t.gameOver}
              </div>

              <button
                className="restart-button"
                onClick={setupGame}
              >
                {t.restart}
              </button>

              <div className="restart-hint">
                {t.pressEnterRestart}
              </div>
            </div>
          )}

          {gameStarted && (
            <div className="ground"></div>
          )}
        </div>

        <div className="game-controls">
          <button
            type="button"
            className="sound-button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={() =>
              setSoundEnabled(
                (current) => !current
              )
            }
          >
            {soundEnabled
              ? t.soundOn
              : t.muted}
          </button>

          <button
            type="button"
            className="color-mode-button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={() =>
              setColorMode(
                (current) => !current
              )
            }
          >
            {colorMode
              ? t.classic
              : t.color}
          </button>

          <button
            type="button"
            className="weather-button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={cycleWeather}
          >
            {weather === 'clear'
              ? t.clear
              : weather === 'rain'
                ? t.rain
                : t.sunny}
          </button>

          <button
            type="button"
            className="fullscreen-button"
            onMouseDown={(event) =>
              event.preventDefault()
            }
            onClick={
              toggleFullscreen
            }
          >
            {isFullscreen
              ? t.exitFullscreen
              : t.fullscreen}
          </button>
        </div>

        <div className="game-info">
          <h2>{t.aboutTitle}</h2>

          <p className="game-info-intro">
            {t.intro}
          </p>

          <div className="game-info-grid">
            <div className="game-info-item">
              <h3>{t.runTitle}</h3>
              <p>{t.runText}</p>
            </div>

            <div className="game-info-item">
              <h3>{t.fasterTitle}</h3>
              <p>{t.fasterText}</p>
            </div>

            <div className="game-info-item">
              <h3>{t.controlsTitle}</h3>
              <p>{t.controlsText}</p>
            </div>

            <div className="game-info-item">
              <h3>{t.customizeTitle}</h3>
              <p>{t.customizeText}</p>
            </div>

            <div className="game-info-item">
              <h3>{t.highScoreTitle}</h3>
              <p>{t.highScoreText}</p>
            </div>

            <div className="game-info-item">
              <h3>{t.dynamicTitle}</h3>
              <p>{t.dynamicText}</p>
            </div>
          </div>

          <div className="game-info-footer">
            <p>{t.infoFooter}</p>
          </div>
        </div>

        <footer className="game-footer">
          <div className="footer-language">
            <span>{t.language}</span>

            <button
              type="button"
              className={
                language === 'en'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setLanguage('en')
              }
            >
              English
            </button>

            <span>·</span>

            <button
              type="button"
              className={
                language === 'es'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setLanguage('es')
              }
            >
              Español
            </button>

            <span>·</span>

            <button
              type="button"
              className={
                language === 'ru'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setLanguage('ru')
              }
            >
              Русский
            </button>
          </div>

          <div className="footer-credit">
            {t.madeBy} ·{' '}
            <a
              href="https://www.linkedin.com/in/qopci/"
              target="_blank"
              rel="noreferrer"
            >
              {t.contact}
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;