import moods from "../../moods"

export async function fetchMoods(moodId) {
    try {
        const genres = moods[moodId].genres
        const limit = 3
        const type = 'playlist'
        const playlistItems = []
        for (const genre of genres) {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${genre}&type=${type}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            const data = await response.json()
            playlistItems.push(data.playlists.items.filter(item => item !== null))
        }

        return playlistItems.flat()
    } catch (err) {
        console.error(err)
    }
}