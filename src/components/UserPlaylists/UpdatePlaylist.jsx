import React, { useState } from 'react';
import './UpdatePlaylist.css'

const UpdatePlaylist = ({ accessToken, playlist }) => {
    // State for editable playlist details
    const [playlistName, setPlaylistName] = useState(playlist.name);
    console.log(playlist.name)
    const [playlistDescription, setPlaylistDescription] = useState(playlist.description || '');
    const [isPublic, setIsPublic] = useState(playlist.public);

    const handleUpdatePlaylist = async () => {
        if (!playlistName.trim()) {
            alert('Playlist name is required!');
            return;
        }

        try {
            // Spotify API request to update playlist details
            const response = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
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
                alert('Error updating playlist. See console for details.');
                return;
            }
            alert(`Playlist "${playlistName}" updated successfully!`);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the playlist.');
        }
    };

    return (
        <div className='container'>
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
            <br />

            <label>
                Description:
                <textarea
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    placeholder="Enter playlist description (optional)"
                />
            </label>
            <br />

            <label>
                <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make Playlist Public
            </label>
            <br />

            <button
              className='updateButton'
              onClick={handleUpdatePlaylist}
            >
            Update Playlist
            </button>
        </div>
    );
};

// Basic styling
const styles = {
    input: {
        width: '90%',
        padding: '8px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    textarea: {
        width: '90%',
        padding: '8px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        resize: 'none',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default UpdatePlaylist;