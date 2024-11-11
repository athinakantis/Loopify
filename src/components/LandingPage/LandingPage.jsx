import { useEffect, useState } from 'react';
import './LandingPage.css';
import moods from '../../moods';

function LandingPage() {
    const [mood, setMood] = useState(0);

    const clientID = '31b7c8cccb774c259278744de0c20018';
    const redirectURI = 'http://localhost:5173/'; // Update after deployment

    useEffect(() => {
        const carouselInterval = setInterval(() => {
            setMood((mood) => (mood === moods.length - 1 ? 0 : mood + 1));
        }, 1000);

        return () => clearInterval(carouselInterval);
    }, []);

    return (
        <section id='landingPage'>
            <div className='landingContainer'>
                <h2>Music to match your<br/> {moods[mood]} mood</h2>
                <p>
                    Loopify is your virtual assistant to finding just the right
                    songs for your particular mood
                </p>

                <a
                    href={`https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token`}
                >
                    <button>Get Started</button>
                </a>
            </div>
        </section>
    );
}

export default LandingPage;
