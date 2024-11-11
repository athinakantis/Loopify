import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState } from 'react';
import Header from '../src/components/Header/Header.jsx';

function App() {
    // using state to manage accesstoken, and set when page is finished loading
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if there is a token in localstorage and what the expiration of the token is.
        let token = window.localStorage.getItem('accessToken');
        let expiration = window.localStorage.getItem('expiration');
        const currentTime = new Date();

        // When login is approved by user, the accesstoken can be found in the hash.
        const hash = window.location.hash;

        // If current time is more than the expiration of the accesstoken, remove the accesstoken.
        if (currentTime > expiration) {
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
                currentTime.setHours(currentTime.getHours() + 1)
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
                <SearchAndDisplay accesstoken={accessToken} placeholder='Search...' />
            </main>
        </>
    );
}

export default App;
