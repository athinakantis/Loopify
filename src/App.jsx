import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx'

function App() {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('accessToken');

        if (!token && hash) {
            token = hash
                .substring(1)
                .split('&')
                .find((el) => el.startsWith('access_token'))
                .split('=')[1];

            console.log('accesstoken: ', token);

            window.location.hash = '';
            setAccessToken(token);
            localStorage.setItem('accessToken', token);
        } else if (token) {
            setAccessToken(token);
        }
    });

    return (
        <>
            <Header/>
            <main>
                {!accessToken && <LandingPage />}
                <SearchAndDisplay placeholder='Search...' />
            </main>
        </>
    );
}

export default App;
