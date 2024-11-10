import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState } from 'react';
import Header from '../src/components/Header/Header.jsx';

function App() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('accessToken');
        let expiration = window.localStorage.getItem('expiration');

        const currentTime = new Date()

        if (currentTime > expiration) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('expiration')
            setAccessToken('')
        };

        if (token) {
            setAccessToken(token)
        } else if (!token && hash) {
            token = hash
                .substring(1)
                .split('&')
                .find((el) => el.startsWith('access_token'))
                .split('=')[1];

            window.location.hash = '';
            setAccessToken(token);
            localStorage.setItem('accessToken', token);
            localStorage.setItem('expiration', currentTime.setHours(currentTime.getHours() + 1))
        }
    }, []);

    return (
        <>
            <Header />
            <main>
                    {!accessToken && <LandingPage />}
                    <SearchAndDisplay placeholder='Search...' />
            </main>
        </>
    );
}

export default App;
