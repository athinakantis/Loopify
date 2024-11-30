import moods from '../../moods';
const accessToken = localStorage.getItem('accessToken');

// GET requests
export async function fetchMoods(moodId) {
    try {
        const genres = moods[moodId].genres;
        const limit = 3;
        const type = 'playlist';
        const playlistItems = [];
        for (const genre of genres) {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${genre}&type=${type}&limit=${limit}`,
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
        Object.assign(searchResults, { tracks: await searchSongs(query) });
        Object.assign(searchResults, { albums: await searchAlbums(query) });
        Object.assign(searchResults, {
            playlists: await searchPlaylists(query),
        });

        return searchResults;
    } catch (err) {
        console.error(err);
    }
}

async function searchSongs(query) {
    try {
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
