import clsx from 'clsx';
import { useState } from 'react';
import useSpotifyToken from '../useSpotifyToken/useSpotifyToken.jsx';
import SongCard from '../SongCard/SongCard.jsx';

export default function SearchAndDisplay(props) {
    const { type, placeholder, name, className, ...rest } = props;
    const classes = clsx(className);

    const accessToken = useSpotifyToken();
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);


    async function searchTracks(query) {
        if (!query || !accessToken) return;

        try {
            // encodeURIComponent(query) safely encodes query, so even if it contains spaces or special symbols, it won’t break the URL
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    query
                )}&type=track&limit=5`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.json();
            setTracks(data.tracks.items);
        } catch (error) {
            console.error('Error fetching tracks:', error);
        }
    }

    function handleKeyUp(event) {
        event.preventDefault();
        const query = event.target.value;

        setSearchTerm(query);

        if (query.trim() === '') {
            setTracks([]);
            return;
        }

        searchTracks(query);
    console.log(tracks)

    }

    return (
        <>
            <input
                onKeyUp={handleKeyUp}
                className={classes}
                type={type}
                placeholder={placeholder}
                name={name}
                {...rest}
            />

            {tracks.length > 0 && (
                 <div className='listOfTracks'>
                    {tracks.map((track) => (
                            <SongCard
                                key={track.id}
                                songTitle={track.name}
                                songArtist={track.artists.map((artist) => artist.name).join(', ')}
                                img={track.album.images[0]?.url}
                            />
                    ))}
                </div>
            )}
        </>
    );
}
