import { useEffect, useState } from 'react';

function Dino() {
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === 'Space' && !isJumping) {
        setIsJumping(true);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isJumping]);

  useEffect(() => {
    if (!isJumping) return;

    let height = 0;
    let goingUp = true;

    const jump = setInterval(() => {
      if (goingUp) {
        height += 10;

        if (height >= 100) {
          goingUp = false;
        }
      } else {
        height -= 10;

        if (height <= 0) {
          height = 0;
          setIsJumping(false);
          clearInterval(jump);
        }
      }

      setJumpHeight(height);
    }, 30);

    return () => clearInterval(jump);
  }, [isJumping]);

  return (
    <img
      className="dino"
      src="/dino-icon.png"
      alt="Dinosaur"
      style={{ bottom: `${42 + jumpHeight}px` }}
    />
  );
}

export default Dino;