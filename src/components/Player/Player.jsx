import './Player.css';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function Player({ isOpen, player, setIsPlaying, displayItem, isPlaying }) {
    const [isSetting, setIsSetting] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [position, setPosition] = useState(0);

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

    const handlePosition = (e) => {
        setIsSetting(true);
        setPosition(e.target.value);
    };

    const handleSetPosition = () => {
        player.seek(position);
        setIsSetting(false);
    };

    useEffect(() => {
        if (!isSetting) {
            setPosition(displayItem.position);
        }
    }, [displayItem.position]);

    return (
        <div id='player'>
            <div className='playerCard'>
                {isOpen && (
                    <>
                        <p>{displayItem.name}</p>
                        <p>{displayItem.artist}</p>
                    </>
                )}
                <div className='frame'>
                    <LazyLoadImage
                        className={isOpen ? 'expanded' : 'collapsed'}
                        effect='opacity'
                        src={displayItem.img}
                        alt={displayItem.name}
                    />
                </div>
            </div>
            <input
                className={isOpen ? 'Expanded' : 'Collapsed'}
                type='range'
                name='progressSlider'
                id='progressSlider'
                value={position}
                max={displayItem.songLength}
                onChange={handlePosition}
                onMouseUp={handleSetPosition}
            />
            <div
                className={isOpen ? 'Expanded' : 'Collapsed'}
                id='playerControls'
            >
                <div className='playPause'>
                    <button
                        id='skipPrev'
                        onClick={handleSkipPrevious}
                    >
                        <img
                            src='src/assets/player_skipPrevious.svg'
                            alt='Skip to previous song'
                        />
                    </button>
                    <button
                        id='playPause'
                        onClick={handlePlay}
                    >
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
                    <button
                        id='skipNext'
                        onClick={handleSkipNext}
                    >
                        <img
                            src='src/assets/player_skipNext.svg'
                            alt='Skip to next song'
                        />
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
