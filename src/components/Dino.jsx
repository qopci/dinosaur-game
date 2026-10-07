import {
  useEffect,
  useRef,
  useState,
} from 'react';


function Dino({
  gameOver,
  isCrouching,
  reset,
  soundEnabled,
  getAudioContext,
}) {

  const [isJumping, setIsJumping] =
    useState(false);

  const [jumpHeight, setJumpHeight] =
    useState(0);

  const isJumpingRef =
    useRef(false);


  /* ========================================
     JUMP SOUND
  ======================================== */

  function playJumpSound() {

    if (!soundEnabled) {

      return;

    }


    const audioContext =
      getAudioContext();


    if (
      audioContext.state === 'suspended'
    ) {

      audioContext.resume();

    }


    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();


    oscillator.type = 'square';


    oscillator.frequency.setValueAtTime(
      520,
      audioContext.currentTime
    );


    oscillator.frequency.exponentialRampToValueAtTime(
      760,
      audioContext.currentTime + 0.12
    );


    gain.gain.setValueAtTime(
      0.08,
      audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.12
    );


    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.12
    );

  }


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

      playJumpSound();

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

  }, [
    gameOver,
    soundEnabled,
  ]);


  /* ========================================
     JUMP MOVEMENT
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
     GAME OVER
     
     IMPORTANT:
     Do NOT reset jumpHeight here.
     This keeps the dino exactly where
     it was when it collided.
  ======================================== */

  useEffect(() => {

    if (gameOver) {

      setIsJumping(false);

      isJumpingRef.current = false;

    }

  }, [gameOver]);


  /* ========================================
     RESET DINO
  ======================================== */

  useEffect(() => {

    setJumpHeight(0);

    setIsJumping(false);

    isJumpingRef.current = false;

  }, [reset]);


  /* ========================================
     DINO CLASSES
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