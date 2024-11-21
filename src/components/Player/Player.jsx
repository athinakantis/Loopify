import "./Player.css";
import { useState } from "react";

function Player({ isOpen, player, playItem, setIsPlaying, isPlaying }) {
  const [volume, setVolume] = useState(0.3);
  // Toggle player
  function handlePlaying() {
    player.togglePlay();
    setIsPlaying((prev) => !prev);
  }

  function handleVolume(e) {
    setVolume(e.target.value);
    player.setVolume(e.target.value);
  }

  return (
    <div id="player">
      {playItem && isOpen && (
        <div className="playerCard">
          <p>{playItem.name}</p>
          <p>{playItem.artist}</p>
          <img src={playItem.img} alt={playItem.title} />
        </div>
      )}

      <div className={isOpen ? "Expanded" : "Collapsed"} id="playerControls">
        <div className="playPause">
          <button id="skipPrev" onClick={() => player.previousTrack()}>
            <img
              src="src/assets/player_skipPrevious.svg"
              alt="Skip to previous song"
            />
          </button>
          <button id="playPause" onClick={handlePlaying}>
            {isPlaying ? (
              <img src="src/assets/player_pauseIcon.svg" alt="Pause Icon" />
            ) : (
              <img src="src/assets/player_playIcon.svg" alt="Play Icon" />
            )}
          </button>
          <button id="skipNext" onClick={() => player.nextTrack()}>
            <img src="src/assets/player_skipNext.svg" alt="Skip to next song" />
          </button>
        </div>

        <input
          type="range"
          onChange={handleVolume}
          name="volume"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          value={volume}
        />
      </div>
    </div>
  );
}

export default Player;
