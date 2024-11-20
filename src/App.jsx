import "./App.css";
import SearchAndDisplay from "./components/SearchAndDisplay/SearchAndDisplay.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import { useEffect, useState } from "react";
import Header from "../src/components/Header/Header.jsx";
import UserPlaylists from "./components/UserPlaylists/UserPlaylists.jsx";

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('Search')
  const [playItem, setPlayItem] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [player, setPlayer] = useState(null)
  const [isReady, setIsReady] = useState(false);
  const [device, setDevice] = useState('')


  const [track, setTrack] = useState();
  const [paused, setPaused] = useState()

  // Effect that gets accesstoken on mount
  useEffect(() => {
    let token = window.localStorage.getItem("accessToken");
    let expiration = parseInt(window.localStorage.getItem("expiration"), 10);
    const currentTime = Date.now();

    const hash = window.location.hash;

    if (!token) {
      setAccessToken('')
    } else if (expiration && currentTime > expiration) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiration");
      setAccessToken("");
    }

    if (token) {
      setAccessToken(token);
    } else if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((el) => el.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      setAccessToken(token);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("expiration", (Date.now() + 3600000).toString());
    }

    setLoading(false);
  }, []);


  // Player component and effect to set it up/listen for events.
  const SpotifyPlayer = () => {
    const [isReady, setIsReady] = useState(false);
    const [active, setActive] = useState(false);

    useEffect(() => {
      const loadSpotifySDK = () => {
        // Check if the SDK script already exists
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
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(accessToken); },
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDevice(device_id)
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        spotifyPlayer.addListener('player_state_changed', (state => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          setPaused(state.paused);


          spotifyPlayer.getCurrentState().then(state => {
            (!state) ? setActive(false) : setActive(true)
          });

        }));

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

    return (
      <div id='player'>
      </div>
    )
  };

  // When playItem is updated, a fetch request is sent with the song/context uri.
  useEffect(() => {
    if (isPlaying) {
      let body;
      playItem.isTrack ? body = JSON.stringify({ uris: [playItem.uri] }) : body = JSON.stringify({ context_uri: playItem.uri })
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: body
      })
    }
  }, [playItem, isPlaying])



  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header
        setPage={setPage}
        player={player}
        playItem={playItem}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}>
      </Header>
      <SpotifyPlayer />
      <main>
        {!accessToken && <LandingPage />}
        {page === 'Search' && <SearchAndDisplay
          setPlayItem={setPlayItem}
          setIsPlaying={setIsPlaying}
          accesstoken={accessToken}
          placeholder='Search...'
          player={player}
        />}

        {page === 'Playlists' && <UserPlaylists accessToken={accessToken} />}
      </main>
    </>
  );
}

export default App;
