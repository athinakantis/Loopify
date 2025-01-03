import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState, createContext } from 'react';
import Header from '../src/components/Header/Header.jsx';
import UserPlaylists from './components/UserPlaylists/UserPlaylists.jsx';
import { playSong } from './utils/requests/requests.js';
import Spinner from './components/Spinner/Spinner.jsx';
export const ThemeContext = createContext(null);

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('Search');
  const [playItem, setPlayItem] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [device, setDevice] = useState('');
  const [displayItem, setDisplayItem] = useState({});
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem('themePreference')) || 'light'
  );

  function handleLogOut() {
    setAccessToken('');
    localStorage.clear();
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Effect that gets accesstoken on mount
  useEffect(() => {
    let token = window.localStorage.getItem('accessToken');
    let expiration = parseInt(window.localStorage.getItem('expiration'), 10);
    const currentTime = Date.now();

    const hash = window.location.hash;

    if (!token) {
      setAccessToken('');
    } else if (expiration && currentTime > expiration) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expiration');
      setAccessToken('');
    }

    if (token) {
      setAccessToken(token);
    } else if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((el) => el.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      setAccessToken(token);
      localStorage.setItem('accessToken', token);
      localStorage.setItem('expiration', (Date.now() + 3600000).toString());
    }
    setLoading(false);
  }, []);

  const SpotifyPlayer = () => {
    useEffect(() => {
      const loadSpotifySDK = () => {
        if (!document.getElementById('spotify-sdk')) {
          const script = document.createElement('script');
          script.id = 'spotify-sdk';
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          document.body.appendChild(script);
        }
      };

      loadSpotifySDK();

      window.onSpotifyWebPlaybackSDKReady = () => {
        const spotifyPlayer = new Spotify.Player({
          name: 'Loopify Player',
          getOAuthToken: (cb) => {
            cb(accessToken);
          },
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          setDevice(device_id);
          spotifyPlayer.setVolume(0.3);
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
      };

      // Cleanup on unmount
      return () => {
        if (player) {
          player.disconnect();
        }
      };
    }, [player]);
  };

  useEffect(() => {
    if (device) {
      fetch(
        `https://api.spotify.com/v1/me/player/repeat?state=context&device_id=${device}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }
  }, [device]);

  useEffect(() => {
    const interval = setInterval(() => {
      player
        .getCurrentState()
        .then((state) => {
          if (!state) return;

          const currentTrack = state.track_window.current_track;
          setDisplayItem({
            name: currentTrack?.name,
            artist: currentTrack?.artists?.[0]?.name,
            img: currentTrack?.album?.images?.[0]?.url,
            position: state.position,
            songLength: currentTrack?.duration_ms,
            isPlaying: !state.paused,
          });
        })
        .catch((error) => {
          console.error('Error fetching Spotify player state:', error);
        });
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  // When the playItem is updated, a fetch request is sent with the song/context
  useEffect(() => {
    if (isPlaying) {
      try {
        playSong(playItem, device);
      } catch (err) {
        console.error(err);
      }
    }
  }, [playItem, isPlaying]);

  // Set themepreference upon change
  useEffect(() => {
    const html = document.querySelector('html');
    html.setAttribute('data-theme', theme);
    localStorage.setItem('themePreference', JSON.stringify(theme));
  }, [theme]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {loading && <Spinner />}
        <Header
          setPage={setPage}
          player={player}
          displayItem={displayItem}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          handleLogOut={handleLogOut}
          setPlayItem={setPlayItem}
          playItem={playItem}
        ></Header>
        <SpotifyPlayer />
        <main>
          {!accessToken && <LandingPage />}
          {page === 'Search' && (
            <SearchAndDisplay
              theme={theme}
              setPlayItem={setPlayItem}
              setIsPlaying={setIsPlaying}
              accessToken={accessToken}
              placeholder='Search...'
            />
          )}

          {page === 'Playlists' && (
            <UserPlaylists
              accessToken={accessToken}
              setPlayItem={setPlayItem}
              setIsPlaying={setIsPlaying}
            />
          )}
        </main>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
