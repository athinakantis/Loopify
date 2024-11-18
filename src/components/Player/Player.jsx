import { useEffect, useState } from 'react';
import AlbumCard from '../AlbumCard/AlbumCard'
import './Player.css';

function Player({ isOpen, setAccessToken, accessToken, playItem, setIsPlaying, isPlaying }) {
    const [deviceID, setDeviceID] = useState('');
    console.log(playItem)

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
        const { uri, isTrack } = playItem;
        let body;
        isTrack ? body = JSON.stringify({ uris: [uri] }) : body = JSON.stringify({ context_uri: uri })
        if (isPlaying) {
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            })
                .catch((error) => {
                    if (error.status === 401) {
                        localStorage.clear();
                        setAccessToken('')
                    }
                })
        } else if (!isPlaying) {
            fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .catch((error) => {
                    if (error.status === 401) {
                        localStorage.clear();
                        setAccessToken('')
                    }
                })
        }
    }, [isPlaying, playItem]);

    return (
        <div className='player'>
            <div className='playerCard'>
                <p>{playItem.title}</p>
                <p>{playItem.artist}</p>
                <img src={playItem.img} alt={playItem.title} />
            </div>

            <div className={isOpen ? 'Expanded' : 'Collapsed'} id='playerControls'>
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
