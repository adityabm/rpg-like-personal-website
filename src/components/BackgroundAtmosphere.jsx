export function BackgroundAtmosphere({ isDarkMode }) {
  return (
    <div
      aria-hidden="true"
      className={`background-atmosphere ${isDarkMode ? 'atmosphere--dark' : 'atmosphere--light'}`}
    >
      <div className="atmosphere-grid" />
      <div className="atmosphere-orb atmosphere-orb--north" />
      <div className="atmosphere-orb atmosphere-orb--south" />
      <div className="atmosphere-stars" />
    </div>
  );
}
