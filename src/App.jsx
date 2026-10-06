import { useEffect, useState } from 'react';
import './App.css';
import Cactus from './components/Cactus';

function App() {
  const [cactusPosition, setCactusPosition] = useState(150);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setCactusPosition((position) => position - 5);
    }, 50);

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <main className="page">
      <div className="game">
        <div className="score">HI 00000&nbsp;&nbsp;00000</div>

        <img
          className="dino"
          src="/dino-icon.png"
          alt="Dinosaur"
        />

        <Cactus position={cactusPosition} />

        <div className="ground"></div>
      </div>
    </main>
  );
}

export default App;