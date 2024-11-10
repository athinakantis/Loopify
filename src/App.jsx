import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState, Suspense } from 'react';
import Header from '../src/components/Header/Header.jsx';

function App() {
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let token = window.localStorage.getItem('accessToken');
        let expiration = window.localStorage.getItem('expiration');
        const hash = window.location.hash;

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

        setLoading(false);
    }, []);

    if (loading) return <p>Loading...</p>

    return (
        <>
            <Suspense fallback={<p>Loading...</p>}>
                <Header />
                <main>
                    {!accessToken && <LandingPage />}
                    <SearchAndDisplay placeholder='Search...' />
                </main>
            </Suspense>
        </>
    );
}

export default App;
