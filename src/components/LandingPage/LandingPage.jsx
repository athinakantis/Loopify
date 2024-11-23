import { useEffect, useState } from 'react';
import './LandingPage.css';
import moods from '../../moods';

function LandingPage() {
    const [mood, setMood] = useState(0);

    const clientID = '31b7c8cccb774c259278744de0c20018';
    const redirectURI = 'http://localhost:5173/'; // Update URI after deployment
    const scopes = [
        'playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'user-modify-playback-state', 'user-read-playback-state', 'streaming', 'user-read-email', 'user-read-private'
    ];

    // Updates the mood every 1000ms, resets the mood if it's reached the full length of moods array
    useEffect(() => {
        const carouselInterval = setInterval(() => {
            setMood((mood) => (mood === moods.length - 1 ? 0 : mood + 1));
        }, 1000);

        return () => clearInterval(carouselInterval);
    }, []);

    return (
        <section id='landingPage'>
            <div className='landingContainer'>
                <h2>
                    Music to match your
                    <br /> {moods[mood]} mood
                </h2>
                <p>
                    Loopify is your virtual assistant to finding just the right
                    songs for your particular mood
                </p>

                <a
                    href={`https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token&scope=${scopes.join('+')}`}
                >
                    <button>Get Started</button>
                </a>
            </div>
        </section>
    );
}

export default LandingPage;
