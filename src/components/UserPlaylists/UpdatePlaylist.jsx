import React, { useState } from 'react';
import './UpdatePlaylist.css'

const UpdatePlaylist = ({ accessToken, playlist_id, playlist, description, isItPublic, onUpdate }) => {
    // State for editable playlist details
    const [playlistName, setPlaylistName] = useState(playlist);
    const [playlistDescription, setPlaylistDescription] = useState(description || '');
    const [isPublic, setIsPublic] = useState(isItPublic);

    const handleUpdatePlaylist = async () => {
        if (!playlistName.trim()) {
            alert('Playlist name is required!');
            return;
        }

        try {
            // Spotify API request to update playlist details
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playlistName,
                    description: playlistDescription,
                    public: isPublic,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to update playlist:', errorData);
                return;
            }
            onUpdate(`Playlist ${playlistName} updated`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='container editPlaylist'>
            <h3>Edit Playlist Details</h3>
            <label htmlFor='playlistName'>
                Playlist Name:
                <input
                    name="playlistName"
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    required
                />
            </label>
            <label>
                Description:
                <textarea
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                />
            </label>
            <label className='checkbox'>
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make Playlist Public
            </label>            
            <button
              className='updateButton'
              onClick={handleUpdatePlaylist}
            >
            Update Playlist
            </button>
        </div>
    );
};

export default UpdatePlaylist;