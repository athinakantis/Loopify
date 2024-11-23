import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { useEffect, useState } from 'react';
import Header from '../src/components/Header/Header.jsx';
import UserPlaylists from './components/UserPlaylists/UserPlaylists.jsx';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('Search');
  const [playItem, setPlayItem] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [device, setDevice] = useState('');
  const [displayItem, setDisplayItem] = useState({});

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

        spotifyPlayer.addListener('player_state_changed', (state) => {
          const currentTrack = state.track_window.current_track;
          setDisplayItem({
            name: currentTrack?.name,
            artist: currentTrack?.artists?.[0]?.name,
            img: currentTrack?.album?.images?.[0]?.url,
          });
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDevice(device_id);

          spotifyPlayer.setVolume(0.3);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
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

  // When the playItem is updated, a fetch request is sent with the song/context
  useEffect(() => {
    if (isPlaying) {
      let body;
      playItem.type === 'track'
        ? (body = JSON.stringify({ uris: [playItem.uri] }))
        : (body = JSON.stringify({ context_uri: playItem.uri }));

      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      fetch(`https://api.spotify.com/v1/me/player/repeat?state=context`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  }, [playItem, isPlaying]);
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header
        setPage={setPage}
        player={player}
        displayItem={displayItem}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
      ></Header>
      <SpotifyPlayer />
      <main>
        {!accessToken && <LandingPage />}
        {page === 'Search' && (
          <SearchAndDisplay
            setPlayItem={setPlayItem}
            setIsPlaying={setIsPlaying}
            accesstoken={accessToken}
            placeholder='Search...'
          />
        )}

        {page === 'Playlists' && <UserPlaylists accessToken={accessToken} />}
      </main>
    </>
  );
}

export default App;
