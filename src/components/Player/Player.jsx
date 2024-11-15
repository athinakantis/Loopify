import { useEffect, useState } from 'react';
import SongCard from '../SongCard/SongCard';
import './Player.css';

function Player({ accessToken }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [deviceID, setDeviceID] = useState('');
    const [playItem, setPlayItem] = useState(
        'spotify:album:4vg4m0qGPeoNTLyJkjBsBs'
    );

    const playEndpoint = `https://api.spotify.com/v1/me/player/play`;
    const deviceEndpoint = `https://api.spotify.com/v1/me/player/devices`;
    const pauseEndpoint = `https://api.spotify.com/v1/me/player/pause`;

    function handlePlaying() {
        setIsPlaying((prev) => !prev);
    }

    const playOption = {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    useEffect(() => {
        fetch(deviceEndpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                setDeviceID(data.devices?.[0]?.id);
            });

        [accessToken];
    });

    useEffect(() => {
        if (!isPlaying) {
            fetch(`${playEndpoint}?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ context_uri: playItem }),
            });
        } else if (isPlaying) {
            fetch(`${pauseEndpoint}?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }
    }, [isPlaying]);

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
