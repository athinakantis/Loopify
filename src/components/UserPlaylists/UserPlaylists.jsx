import './UserPlaylists.css';
import React, { useEffect, useState } from 'react';
import PlaylistCard from './PlaylistCard';
import SongCard from '../SongCard/SongCard';
import CreatePlaylist from './CreatePlaylist';
import UpdatePlaylist from './UpdatePlaylist';
import loopifyLogoDark from '../../assets/loopifyLogo_dark.svg';
import Spinner from '../Spinner/Spinner';

const UserPlaylists = ({ accessToken, setPlayItem, setIsPlaying }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tracks, setTracks] = useState([]);
    const [refreshList, setRefreshList] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const defaultImage = loopifyLogoDark;

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                // to add a limit, add => ?limit=10
                const response = await fetch(
                    'https://api.spotify.com/v1/me/playlists',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                setPlaylists(data.items.filter((item) => item !== null));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        if (accessToken) {
            fetchPlaylists();
        }
    }, [accessToken, refreshList]); // re-runs useEffect function when accessToken or playlists change

    const refreshPlaylists = () => {
        setRefreshList((prev) => !prev);
    };

    // Fetch tracks of the selected playlist
    const playlistClick = async (playlistId, playlistUri) => {
        const response = await fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();
        setTracks(data.items);
        setSelectedPlaylist({
            id: playlistId,
            uri: playlistUri,
        });
        setIsEditing(false);
    };

    const backToPlaylists = () => {
        setSelectedPlaylist(null); // reset the selected playlist to show playlists again
        setTracks([]);
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleUpdate = (message) => {
        setIsEditing(false); // exit edit mode
        setSuccessMsg(message); //show success message
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const selectedPlaylistDetails = playlists.find(
        (playlist) => playlist?.id === selectedPlaylist?.id
    );

    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); 

    const handleCreatePlaylistClick = () => {
        setShowCreatePlaylist(!showCreatePlaylist);
    };

    return (
        <div className='containerStyle'>
            {selectedPlaylist ? (
                <div>
                    <button
                        className='playlistBtn'
                        onClick={backToPlaylists}
                    >
                        &larr; Back To Playlists
                    </button>

                    {successMsg && <div className='success'>{successMsg}</div>}

                    <h2>{selectedPlaylistDetails.name}</h2>

                    <div>
                        <button
                            className='editBtn'
                            onClick={toggleEdit}
                        >
                            {isEditing ? 'Close Edit' : 'Edit Playlist'}
                        </button>
                    </div>

                    {isEditing && (
                        <UpdatePlaylist
                            accessToken={accessToken}
                            playlist_id={selectedPlaylist?.id}
                            playlist={selectedPlaylistDetails?.name}
                            description={selectedPlaylistDetails?.description}
                            isItPublic={selectedPlaylistDetails?.public}
                            onUpdate={handleUpdate}
                        />
                    )}

                    <div className='songStyle'>
                        {tracks.length > 0 ? (
                            <div className='songStyle'>
                                {tracks.map((track) => (
                                    <SongCard
                                        playlistUri={selectedPlaylist.uri}
                                        type='playlist'
                                        setIsPlaying={setIsPlaying}
                                        setPlayItem={setPlayItem}
                                        key={track?.track?.id}
                                        uri={track?.track?.uri}
                                        name={track?.track?.name}
                                        artist={track?.track?.artists
                                            .map((artist) => artist?.name)
                                            .join(', ')}
                                        img={
                                            track?.track?.album?.images[0]?.url
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No tracks available.</p>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div className='playlistHeader'>
                        <h2>Your Playlists</h2>
                        {successMsg && (
                            <div className='success'>{successMsg}</div>
                        )}

                        <div className='createBtn'>
                            <CreatePlaylist
                                accessToken={accessToken}
                                refreshPlaylists={refreshPlaylists}
                                playlistCreated={handleUpdate}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div id='spinnerContainer'>
                            <Spinner />
                        </div>
                    ) : (
                        <div className='playlistStyle'>
                            {playlists.length > 0 &&
                                playlists.map((playlist) => (
                                    <PlaylistCard
                                        key={playlist?.id}
                                        onClick={() =>
                                            playlistClick(
                                                playlist?.id,
                                                playlist?.uri
                                            )
                                        }
                                        playlistName={playlist?.name}
                                        img={
                                            playlist?.images?.[0]?.url ||
                                            defaultImage
                                        }
                                    />
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserPlaylists;