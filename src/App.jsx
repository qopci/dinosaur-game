import { useEffect, useState } from 'react';
import './App.css';
import Cactus from './components/Cactus';
import Dino from './components/Dino';

function App() {
  const [cactusPosition, setCactusPosition] = useState(150);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setCactusPosition((position) => {
        if (position < -50) {
          return 900;
        }

        return position - 5;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <main className="page">
      <div className="game">
        <div className="score">HI 00000&nbsp;&nbsp;00000</div>

        <Dino />

        <Cactus position={cactusPosition} />

        <div className="ground"></div>
      </div>
    </main>
  );
}

export default App;