import './UserPlaylists.css';
import React, { useEffect, useState } from 'react';
import PlaylistCard from './PlaylistCard';
import SongCard from '../SongCard/SongCard';
import CreatePlaylist from './CreatePlaylist';
import UpdatePlaylist from './UpdatePlaylist';

const UserPlaylists = ({ accessToken }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [refreshList, setRefreshList] = useState(0); // State to trigger playlist refresh

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
                setPlaylists(data.items);
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
    const playlistClick = async (playlistId) => {
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
        setSelectedPlaylist(playlistId);
    };

    const backToPlaylists = () => {
        setSelectedPlaylist(null); // reset the selected playlist to show playlists again
        setTracks([]);
    };

    const selectedPlaylistDetails = playlists.find(
        (playlist) => playlist.id === selectedPlaylist
    );

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
                    <h2>{selectedPlaylistDetails.name}</h2>

                    <div>
                        <UpdatePlaylist
                            accessToken={accessToken}
                            playlist_id={selectedPlaylist}
                            playlist={selectedPlaylistDetails?.name}
                            description={selectedPlaylistDetails?.description}
                            isItPublic={selectedPlaylistDetails?.public}
                        />
                    </div>
                    <div className='songStyle'>
                        {tracks.length > 0 ? (
                            <div className='songStyle'>
                                {tracks.map((track) => (
                                    <SongCard
                                        key={track.track.id}
                                        name={track.track.name}
                                        artist={track.track.artists
                                            .map((artist) => artist.name)
                                            .join(', ')}
                                        img={track.track.album.images[0]?.url}
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
                    <h2>
                        Your Playlists{' '}
                        <CreatePlaylist
                            accessToken={accessToken}
                            refreshPlaylists={refreshPlaylists}
                        />
                    </h2>
                    <div className='playlistStyle'>
                        {playlists.length > 0 &&
                            playlists.map((playlist) => (
                                <PlaylistCard
                                    key={playlist.id}
                                    onClick={() => playlistClick(playlist.id)}
                                    playlistName={playlist.name}
                                    img={playlist?.images?.[0]?.url}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPlaylists;
