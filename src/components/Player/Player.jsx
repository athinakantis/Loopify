import './Player.css';

function Player({ isOpen, player, playItem, setIsPlaying, isPlaying }) {
    // Toggle player
    function handlePlaying() {
        setIsPlaying((prev) => !prev);
        player.togglePlay()
    }

    return (
        <div id='player'>
            {playItem &&
            <div className='playerCard'>
                <p>{playItem.title}</p>
                <p>{playItem.artist}</p>
                <img src={playItem.img} alt={playItem.title} />
            </div>
            }

            <div className={isOpen ? 'Expanded' : 'Collapsed'} id='playerControls'>
                <button id='skipPrev' onClick={() => player.previousTrack()}>
                    <img
                        src='src/assets/player_skipPrevious.svg'
                        alt='Skip to previous song'
                    />
                </button>
                <button id='playPause' onClick={handlePlaying}>
                    {isPlaying ? (
                        <img
                            src='src/assets/player_pauseIcon.svg'
                            alt='Pause Icon'
                        />
                    ) : (
                        <img
                            src='src/assets/player_playIcon.svg'
                            alt='Play Icon'
                        />
                    )}
                </button>
                <button id='skipNext' onClick={() => player.nextTrack()}>
                    <img
                        src='src/assets/player_skipNext.svg'
                        alt='Skip to next song'
                    />
                </button>
            </div>
        </div>
    );
}

export default Player;
