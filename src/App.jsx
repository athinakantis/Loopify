import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState } from 'react';
import Header from '../src/components/Header/Header.jsx';
import UserPlaylists from './components/UserPlaylists/UserPlaylists.jsx';
function App() {
    // using state to manage accesstoken, and set when page is finished loading
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if there is a token in localstorage and what the expiration of the token is.
        let token = window.localStorage.getItem('accessToken');
        let expiration = parseInt(
            window.localStorage.getItem('expiration'),
            10
        );
        const currentTime = Date.now();

        // When login is approved by user, the accesstoken can be found in the hash.
        const hash = window.location.hash;

        // If current time is more than the expiration of the accesstoken, remove the accesstoken.
        if (expiration && currentTime > expiration) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expiration');
            setAccessToken('');
        }

        // If there is still a token (Meaning it has not yet expired), set accesstoken
        if (token) {
            setAccessToken(token);
        } else if (!token && hash) {
            // else if there is no token but there is a hash, create the token from the hash.
            token = hash
                .substring(1)
                .split('&')
                .find((el) => el.startsWith('access_token'))
                .split('=')[1];

            window.location.hash = '';
            setAccessToken(token);
            localStorage.setItem('accessToken', token);
            localStorage.setItem(
                'expiration',
                (Date.now() + 3600000).toString()
            );
        }

        //Once the token is set or removed, set loading to false.
        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Header />
            <main>
                {!accessToken && <LandingPage />}
                <SearchAndDisplay
                    accesstoken={accessToken}
                    placeholder='Search...'
                />
                <UserPlaylists accessToken={accessToken}/>
            </main>
        </>
    );
}

export default App;
