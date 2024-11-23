import './Player.css';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function Player({ isOpen, player, setIsPlaying, displayItem, isPlaying }) {
  const [volume, setVolume] = useState(0.3);

  function handleVolume(e) {
    setVolume(e.target.value);
    player.setVolume(e.target.value);
  }

  function handlePlay() {
    setIsPlaying((prev) => !prev);
    player.togglePlay();
  }

  function handleSkipNext() {
    player.nextTrack();
    setIsPlaying(true);
  }

  function handleSkipPrevious() {
    player.previousTrack();
    setIsPlaying(true);
  }

  return (
    <div id='player'>
      {isOpen && displayItem && (
        <div className='playerCard'>
          <p>{displayItem.name}</p>
          <p>{displayItem.artist}</p>
          <LazyLoadImage
            effect='opacity'
            src={displayItem.img}
            alt={displayItem.name}
          />
        </div>
      )}

      <div className={isOpen ? 'Expanded' : 'Collapsed'} id='playerControls'>
        <div className='playPause'>
          <button id='skipPrev' onClick={handleSkipPrevious}>
            <img
              src='src/assets/player_skipPrevious.svg'
              alt='Skip to previous song'
            />
          </button>
          <button id='playPause' onClick={handlePlay}>
            {isPlaying ? (
              <img src='src/assets/player_pauseIcon.svg' alt='Pause Icon' />
            ) : (
              <img src='src/assets/player_playIcon.svg' alt='Play Icon' />
            )}
          </button>
          <button id='skipNext' onClick={handleSkipNext}>
            <img src='src/assets/player_skipNext.svg' alt='Skip to next song' />
          </button>
        </div>

        <input
          type='range'
          onChange={handleVolume}
          name='volume'
          id='volume'
          min='0'
          max='1'
          step='0.01'
          value={volume}
        />
      </div>
    </div>
  );
}

export default Player;
