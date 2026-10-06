function Cloud({ position, top }) {
  return (
    <div
      className="cloud"
      style={{
        left: `${position}px`,
        top: `${top}px`,
      }}
    ></div>
  );
}

export default Cloud;