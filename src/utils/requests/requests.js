import moods from '../../moods';

// GET requests
export async function fetchMoods(moodId, offset) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const genres = moods[moodId].genres;
        const limit = 3;
        const type = 'playlist';
        const playlistItems = [];
        for (const genre of genres) {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${genre}&type=${type}&limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.json();
            playlistItems.push(
                data.playlists.items.filter((item) => item !== null)
            );
        }

        return playlistItems.flat();
    } catch (err) {
        console.error(err);
    }
}

export async function fetchSearch(query) {
    const searchResults = {};

    try {
        const [tracks, albums, playlists] = await Promise.all([
            searchSongs(query),
            searchAlbums(query),
            searchPlaylists(query),
        ]);

        Object.assign(searchResults, { tracks, albums, playlists });
        return searchResults;
    } catch (err) {
        console.error(err);
    }
}

async function searchSongs(query) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                query
            )}&type=track&limit=50`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.tracks.items.filter((item) => item !== null);
    } catch (err) {
        console.error(err);
    }
}

async function searchAlbums(query) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                query
            )}&type=album&limit=15`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.albums.items.filter((item) => item !== null);
    } catch (err) {
        console.error(err);
    }
}

async function searchPlaylists(query) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                query
            )}&type=playlist&limit=15`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.playlists.items.filter((item) => item !== null);
    } catch (err) {
        console.error(err);
    }
}

export async function initialFetch() {
    const accessToken = localStorage.getItem('accessToken');
    const searchResults = {};

    const initialTracks = async () => {
        const response = await fetch(
            `https://api.spotify.com/v1/me/top/tracks`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.items.filter((item) => item !== null);
    };

    const initialAlbums = async () => {
        const response = await fetch(
            `https://api.spotify.com/v1/me/albums?limit=20`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.items
            .filter((item) => item !== null)
            .map((item) => item.album);
    };

    const initialPlaylists = async () => {
        const response = await fetch(
            `https://api.spotify.com/v1/me/playlists?limit=20`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        const data = await response.json();
        return data.items.filter((item) => item !== null);
    };
    try {
        const [tracks, albums, playlists] = await Promise.all([
            initialTracks(),
            initialAlbums(),
            initialPlaylists(),
        ]);
        Object.assign(searchResults, { tracks, albums, playlists });
        return searchResults;
    } catch (err) {
        console.error(err);
    }
}

// PUT requests
export async function playSong(playItem, device) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const { type, uri, playlistUri } = playItem
        let body;

        if (type === 'playlist' && playlistUri) {
            body = JSON.stringify({
                context_uri: playlistUri,
                offset: {
                    uri: uri
                }
            })
        } else if (type === 'album' || type === 'playlist' && !playlistUri) {
            body = JSON.stringify({ context_uri: uri })
        } else {
            body = JSON.stringify({ uris: [uri] })
        }

        console.log(body)

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: body,
        });
    } catch (err) {
        console.error(err);
    }
}
