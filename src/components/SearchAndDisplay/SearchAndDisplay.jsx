import clsx from 'clsx';
import { useState, useEffect } from 'react';
import useSpotifyToken from '../useSpotifyToken/useSpotifyToken.jsx';
import SongCard from '../SongCard/SongCard.jsx';
import './SearchAndDisplay.css';
import './SearchBar.css';
import {
    LazyLoadComponent,
    LazyLoadImage,
} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

export default function SearchAndDisplay(props) {
    const {
        type,
        placeholder,
        name,
        className,
        setPlayItem,
        setIsPlaying,
        ...rest
    } = props;
    const classes = clsx(className);

    const accessToken = useSpotifyToken();
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    function handlePlay(uri, type = 'track') {
        setPlayItem({
            uri: uri,
            type: type,
        });
        setIsPlaying(true);
    }

    useEffect(() => {
        if (searchTerm) {
            fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    searchTerm
                )}&type=track&limit=50`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
                .then((response) => response.json())
                .then((data) => setTracks(data.tracks.items))
                .catch((error) =>
                    console.error('Error fetching tracks:', error)
                );

            fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    searchTerm
                )}&type=album&limit=15`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
                .then((response) => response.json())
                .then((data) => setAlbums(data.albums.items))
                .catch((error) =>
                    console.error('Error fetching albums:', error)
                );

            fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    searchTerm
                )}&type=playlist&limit=15`,
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
                .then((response) => response.json())
                .then((data) => setAlbums(data.playlists.items))
                .catch((error) =>
                    console.error('Error fetching playlists:', error)
                );
        }
    }, [searchTerm, accessToken]);

    function handleKeyUp(event) {
        event.preventDefault();
        const query = event.target.value;

        setSearchTerm(query);

        if (query.trim() === '') {
            setTracks([]);
            setAlbums([]);
            setPlaylists([]);
            return;
        }
    }

    return (
        <>
            <div className='search-bar'>
                <input
                    onKeyUp={handleKeyUp}
                    className={classes}
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    {...rest}
                />
                <img
                    src='src/assets/searchIcon.svg'
                    alt='Search Icon'
                />
            </div>

            <div className='displaySongs'>
                <h2>Top songs</h2>

                {tracks.length > 0 && (
                    <div className='top-songs'>
                        {tracks.map((track) => (
                            <SongCard
                                setPlayItem={setPlayItem}
                                key={track?.id}
                                uri={track?.uri}
                                name={track?.name}
                                artist={track?.artists
                                    ?.map((artist) => artist?.name)
                                    ?.join(', ')}
                                img={track?.album?.images?.[0]?.url}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className='displayAlbums'>
                <h2>Albums</h2>
                <div className='albums'>
                    {albums.map((album) => (
                        <div
                            className='album'
                            key={album?.id}
                        >
                            <button
                                onClick={() => {
                                    handlePlay(album?.uri, 'album');
                                }}
                            >
                                <LazyLoadImage
                                    effect='opacity'
                                    src={album?.images?.[0]?.url}
                                    width='150px'
                                    height='150px'
                                />
                            </button>
                            <p className='albumName'>{album?.name}</p>
                            <p>{album?.artists?.[0]?.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='displayPlaylists'>
                <h2>Playlists</h2>
                <div className='playlists'>
                    {playlists.map((playlist) => (
                        <div
                            className='playlist'
                            key={playlist?.id}
                        >
                            <button
                                onClick={() => {
                                    handlePlay(playlist?.uri, 'playlist');
                                }}
                            >
                                <img
                                    src={playlist?.images?.[0]?.url}
                                    width='150px'
                                    height='150px'
                                />
                            </button>
                            <p className='playlistName'>{playlist?.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
