import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import useSpotifyToken from '../useSpotifyToken/useSpotifyToken.jsx';
import SongCard from '../SongCard/SongCard.jsx';
import './SearchAndDisplay.css'
import "./SearchBar.css";

export default function SearchAndDisplay(props) {
    const { type, placeholder, name, className, setPlayItem, setIsPlaying, player, ...rest } = props;
    const classes = clsx(className);

    const accessToken = useSpotifyToken();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);

    function handlePlay(artist, title, imgUrl, uri, isTrack = false) {
        setPlayItem({
            name: title,
            artist: artist,
            img: imgUrl,
            uri: uri,
            isTrack: isTrack
        })
        setIsPlaying(true)
    }

    useEffect(() => {
        const handler = debounce((value) => setDebouncedSearchTerm(value), 500);
        handler(searchTerm);
        return () => handler.cancel && handler.cancel();
    }, [searchTerm, debounce]);

    useEffect(() => {

        if (debouncedSearchTerm) {
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(debouncedSearchTerm)}&type=track&limit=50`,
                { headers: { Authorization: `Bearer ${accessToken}` } })
                .then(response => response.json())
                .then(data => setTracks(data.tracks.items))
                .catch(error => console.error('Error fetching tracks:', error))

            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(debouncedSearchTerm)}&type=album&limit=15`,
                { headers: { Authorization: `Bearer ${accessToken}` } })
                .then(response => response.json())
                .then(data => setAlbums(data.albums.items))
                .catch(error => console.error('Error fetching albums:', error))

            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(debouncedSearchTerm)}&type=playlist&limit=15`,
                { headers: { Authorization: `Bearer ${accessToken}` } })
                .then(response => response.json())
                .then(data => setPlaylists(data.playlists.items))
                .catch(error => console.error('Error fetching playlists:', error))
        }
    }, [debouncedSearchTerm, accessToken])

    function handleKeyUp(event) {
        event.preventDefault();
        const query = event.target.value;

        setSearchTerm(query)

        if (query.trim() === '') {
            setTracks([]);
            setAlbums([]);
            setPlaylists([]);
            return;
        }

    }

    return (
        <>
            <div className="search-bar">
                <input
                    onKeyUp={handleKeyUp}
                    className={classes}
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    {...rest}
                />
                <a href="#">
                    <span class="material-symbols-outlined">search</span>
                </a>
            </div>

            <div className="displaySongs">
                <h2>Top songs</h2>

                {tracks.length > 0 && (
                    <div className='top-songs'>
                        {tracks.map((track) => (
                            <SongCard
                                key={track.id}
                                setPlayItem={setPlayItem}
                                setIsPlaying={setIsPlaying}
                                uri={track.uri}
                                title={track.name}
                                artist={track.artists.map((artist) => artist.name).join(', ')}
                                img={track.album.images[0]?.url}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="displayAlbums">
                <h2>Albums</h2>
                <div className="albums">
                    {albums.map(album => (
                        <div className="album" key={album.id}>
                            <button onClick={() => {
                                handlePlay(album.artists[0].name, album.title, album.images[1].url, album.uri)
                            }}>
                                <img src={album.images[1]?.url} width="150px" height="150px" />
                            </button>
                            <p className='albumName'>{album.name}</p>
                            <p>{album.artists[0].name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="displayPlaylists">
                <h2>Playlists</h2>
                <div className="playlists">
                    {playlists.map(playlist => (
                        <div className="playlist" key={playlist.id}>
                            <img src={playlist.images[0]?.url} width="150px" height="150px" />
                            <p className='playlistName'>{playlist.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
