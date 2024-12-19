import React, { useState } from 'react';
import './CreatePlaylist.css';

const CreatePlaylist = ({ accessToken, refreshPlaylists, playlistCreated }) => {
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [formIsShowing, setFormIsShowing] = useState(false);

    const createPlaylist = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            const userId = data.id;

            // Create a new playlist through POST method with name, description, and public/private in the request body
            const playlistResponse = await fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: playlistName,
                        description: playlistDescription,
                        public: !isPrivate,
                    }),
                }
            );

            if (playlistResponse.ok) {
                const playlistData = await playlistResponse.json();
                playlistCreated(`Playlist ${playlistName} created`);
                refreshPlaylists(); // Trigger refresh
            } else {
                const errorData = await playlistResponse.json();
                console.error('Failed to create playlist:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='create-container'>
            <button
                className='addButton'
                onClick={() => setFormIsShowing(true)}
            >
                <img src='src/assets/addCircle.svg' alt='New Playlist' />
                <span>Create a New Playlist</span>
            </button>

            {formIsShowing && (
                <>
                    {/* Overlay background that dims the screen */}
                    <div
                        className='create-overlay'
                        onClick={() => setFormIsShowing(false)}
                    ></div>

                    <div className='form-container'>
                        <h3>Create a New Playlist</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                createPlaylist();
                                setFormIsShowing(false);
                            }}
                        >
                            <label>
                                Playlist Name:
                                <input
                                    type='text'
                                    value={playlistName}
                                    onChange={(e) =>
                                        setPlaylistName(e.target.value)
                                    }
                                    required
                                />
                            </label>
                            <label>
                                Description:
                                <textarea
                                    value={playlistDescription}
                                    onChange={(e) =>
                                        setPlaylistDescription(e.target.value)
                                    }
                                    placeholder='Description (optional)'
                                />
                            </label>
                            <label className='checkbox'>
                                <input
                                    type='checkbox'
                                    checked={isPrivate}
                                    onChange={(e) =>
                                        setIsPrivate(e.target.checked)
                                    }
                                />
                                Make Playlist Private
                            </label>
                            <div className='buttonContainer'>
                                <button
                                    onClick={() => setFormIsShowing(false)}
                                    className='formButton'
                                >
                                    &larr; Back
                                </button>
                                <button type='submit' className='formButton'>
                                    Create Playlist
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default CreatePlaylist;
