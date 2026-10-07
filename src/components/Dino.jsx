import { useEffect, useState } from 'react';

function Dino({ gameOver }) {
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);

  useEffect(() => {
    function handleKeyDown(event) {
      if (
        (
          event.code === 'Space' ||
          event.code === 'ArrowUp'
        ) &&
        !isJumping &&
        !gameOver
      ) {
        setIsJumping(true);
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [isJumping, gameOver]);

  /*
    Jump movement.

    IMPORTANT:
    When gameOver becomes true, the interval
    is cleaned up immediately.

    We DO NOT reset jumpHeight here.

    This means the dino stays exactly where
    it was when the collision happened.
  */

  useEffect(() => {
    if (!isJumping || gameOver) return;

    let height = jumpHeight;
    let velocity = 18;

    const jump = setInterval(() => {
      height += velocity;
      velocity -= 1.1;

      if (height <= 0) {
        height = 0;

        setJumpHeight(0);
        setIsJumping(false);

        clearInterval(jump);
        return;
      }

      setJumpHeight(height);
    }, 30);

    return () => {
      clearInterval(jump);
    };
  }, [isJumping, gameOver]);

  return (
    <img
      className={`
        dino
        ${
          isJumping
            ? 'dino-jumping'
            : gameOver
            ? 'dino-stopped'
            : 'dino-running'
        }
      `}
      src="/dino-icon.png"
      alt="Dinosaur"
      style={{
        bottom: `${33 + jumpHeight}px`,
      }}
    />
  );
}

export default Dino;