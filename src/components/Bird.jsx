function Bird({
  position,
  top,
  gameOver,
}) {

  return (
    <div
      className={`
        bird
        ${
          gameOver
            ? 'bird-stopped'
            : ''
        }
      `}
      style={{
        left: `${position}px`,
        bottom: `${top}px`,
      }}
    >

      <div className="bird-head"></div>

      <div className="bird-body"></div>

      <div className="bird-beak"></div>

      <div className="bird-wing"></div>

      <div className="bird-tail"></div>

    </div>
  );
}

export default Bird;