import { useEffect, useState } from 'react';
import AlbumCard from '../AlbumCard/AlbumCard'
import './Player.css';

function Player({ accessToken, playItem, setIsPlaying, isPlaying }) {
    const [deviceID, setDeviceID] = useState('');

    function handlePlaying() {
        setIsPlaying((prev) => !prev);
    }

    useEffect(() => {
        fetch(`https://api.spotify.com/v1/me/player/devices`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                setDeviceID(data.devices?.[0]?.id);
            });

        [accessToken];
    });

    useEffect(() => {
        if (isPlaying) {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ context_uri: playItem }),
            });
        } else if (!isPlaying) {
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
    }, [isPlaying, playItem]);

    return (
        <div className='player'>
            
            <div id='playerControls'>
                <button id='skipPrev'>
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
                <button id='skipNext'>
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
