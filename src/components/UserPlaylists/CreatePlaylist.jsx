import React, { useState } from 'react';
import './CreatePlaylist.css';

const CreatePlaylist = ({ accessToken }) => {

    /*
    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    */

    const[isNotifVisible, setIsNotifVisible] = useState(false);

    // get user profile
    const createPlaylist = async () => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            const userId = data.id;

            // create a new playlist through POST method with name, description and public/private in the request body
            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": 'Loopify Playlist',
                    "description": 'Created via Loopify',
                    "public": true,
                }),
            });

            if (playlistResponse.ok) {
                const playlistData = await playlistResponse.json();
                console.log('Playlist created:', playlistData);
                alert('Playlist created!');
            } else {
                const errorData = await playlistResponse.json();
                console.error('Failed to create playlist:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <button
                className='addButton' 
                onClick={createPlaylist}
            ><img className='addButton' src="src/assets/addCircle.svg" alt="New Playlist" />
            <span>Create a New Playlist</span>
            </button>
        </div>
    );
};

export default CreatePlaylist;