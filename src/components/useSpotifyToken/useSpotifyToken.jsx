import {useState, useEffect} from "react";

export default function useSpotifyToken() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {

        // ATTENTION! This is a temporary storage of these two variables. Later we can put them into .env (environmental variables file)
        const clientId = '31b7c8cccb774c259278744de0c20018';
        const clientSecret = `fd28f231d3eb4001a3e233c68f634d1d`;

        // Spotify API expects an authorization header that contains the clientId and clientSecret encoded in Base64 (btoa encodes it)
        const credentials = btoa(`${clientId}:${clientSecret}`);

        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                // x-www-form-urlencoded indicates that the body will be URL-encoded
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            // 'grant_type=client_credentials' requests an access token
            body: 'grant_type=client_credentials'
        })
        .then(response => response.json())
        .then(data => {
            setAccessToken(data.access_token)
        })
        .catch(error => console.error('Error fetching access token:', error));
    }, []) // [] means that the effect will only run once — when the component first mounts

    return accessToken;
}