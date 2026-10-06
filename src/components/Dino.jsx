import { useEffect, useState } from 'react';

function Dino() {
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        (event.code === 'Space' || event.code === 'ArrowUp') &&
        !isJumping
      ) {
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
    let velocity = 18;

    const jump = setInterval(() => {
      height += velocity;
      velocity -= 1.5;

      if (height <= 0) {
        height = 0;
        setJumpHeight(0);
        setIsJumping(false);
        clearInterval(jump);
        return;
      }

      setJumpHeight(height);
    }, 30);

    return () => clearInterval(jump);
  }, [isJumping]);

  return (
    <img
      className={`dino ${isJumping ? 'dino-jumping' : 'dino-running'}`}
      src="/dino-icon.png"
      alt="Dinosaur"
      style={{ bottom: `${33 + jumpHeight}px` }}
    />
  );
}

export default Dino;