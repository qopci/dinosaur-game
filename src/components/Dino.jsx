import {
  useEffect,
  useRef,
  useState,
} from 'react';


function Dino({
  gameOver,
  isCrouching,
  reset,
}) {

  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);

  const isJumpingRef = useRef(false);


  /* ========================================
     JUMP CONTROLS
  ======================================== */

  useEffect(() => {

    function handleKeyDown(event) {

      if (
        event.code !== 'Space' &&
        event.code !== 'ArrowUp'
      ) {

        return;

      }


      event.preventDefault();


      if (
        isJumpingRef.current ||
        gameOver
      ) {

        return;

      }


      isJumpingRef.current = true;

      setIsJumping(true);

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

  }, [gameOver]);


  /* ========================================
     JUMP PHYSICS
  ======================================== */

  useEffect(() => {

    if (
      !isJumping ||
      gameOver
    ) {

      return;

    }


    let height = 0;

    let velocity = 17;


    const jump =
      setInterval(() => {

        height += velocity;

        velocity -= 1.1;


        if (height <= 0) {

          height = 0;


          setJumpHeight(0);

          setIsJumping(false);

          isJumpingRef.current = false;


          clearInterval(jump);

          return;

        }


        setJumpHeight(height);

      }, 30);


    return () => {

      clearInterval(jump);

    };

  }, [
    isJumping,
    gameOver,
  ]);


  /* ========================================
     STOP JUMPING ON GAME OVER
  ======================================== */

  useEffect(() => {

    if (gameOver) {

      setIsJumping(false);

      setJumpHeight(0);

      isJumpingRef.current = false;

    }

  }, [
    gameOver,
  ]);


  /* ========================================
     RESET DINO POSITION
  ======================================== */

  useEffect(() => {

    setJumpHeight(0);

    setIsJumping(false);

    isJumpingRef.current = false;

  }, [
    reset,
  ]);


  /* ========================================
     NORMAL DINO
  ======================================== */

  const normalDinoClass = `
    dino-image
    ${
      !isCrouching
        ? isJumping
          ? 'dino-jumping'
          : gameOver
            ? 'dino-stopped'
            : 'dino-running'
        : 'dino-hidden'
    }
  `;


  /* ========================================
     CROUCHING DINO
  ======================================== */

  const crouchDinoClass = `
    dino-image
    dino-crouch-image
    ${
      isCrouching
        ? gameOver
          ? 'dino-stopped'
          : 'dino-running'
        : 'dino-hidden'
    }
  `;


  /* ========================================
     RENDER
  ======================================== */

  return (

    <div
      className="dino"
      style={{
        bottom: `${33 + jumpHeight}px`,
      }}
    >

      <img
        className={normalDinoClass}
        src="/dino-icon.png"
        alt="Dinosaur"
        draggable="false"
      />


      <img
        className={crouchDinoClass}
        src="/dino-crouch.png"
        alt="Crouching dinosaur"
        draggable="false"
      />

    </div>

  );

}


export default Dino;