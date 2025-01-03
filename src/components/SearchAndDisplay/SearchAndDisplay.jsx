import clsx from 'clsx';
import { useState, useEffect } from 'react';
import SongCard from '../SongCard/SongCard.jsx';
import './SearchAndDisplay.css';
import './SearchBar.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import moods from '../../moods.js';
import {
  fetchMoods,
  fetchSearch,
  initialFetch,
} from '../../utils/requests/requests.js';
import Spinner from '../Spinner/Spinner.jsx';

export default function SearchAndDisplay(props) {
  const {
    type,
    placeholder,
    name,
    accessToken,
    className,
    setPlayItem,
    setIsPlaying,
    ...rest
  } = props;
  const classes = clsx(className);
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [moodId, setMoodId] = useState();
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);

  function handlePlay(uri, type = 'track') {
    setPlayItem({
      uri: uri,
      type: type,
    });
    setIsPlaying(true);
  }

  function handleMoodClick(id) {
    if (moodId == id) {
      setMoodId();
      getInitialItems();
    } else {
      setMoodId(id.toString());
      setOffset(0);
    }
  }

  async function getInitialItems() {
    try {
      const results = await initialFetch();
      setTracks(results.tracks);
      setAlbums(results.albums);
      setPlaylists(results.playlists);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  // Effect to fetch initial play items.
  // Runs on mount
  useEffect(() => {
    if (accessToken) {
      getInitialItems();
    }
  }, [accessToken]);

  //Effect to fetch mood-based playlists
  useEffect(() => {
    if (moodId) {
      async function getMoodPlaylists() {
        try {
          setLoading(true);
          setPlaylists(await fetchMoods(+moodId, offset));
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
      getMoodPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [moodId, offset]);

  useEffect(() => {
    if (searchTerm) {
      async function getSearchResults() {
        try {
          setLoading(true);
          setMoodId();
          const results = await fetchSearch(searchTerm);
          setTracks(results.tracks);
          setAlbums(results.albums);
          setPlaylists(results.playlists);
          setLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
      getSearchResults();
    } else {
      getInitialItems();
    }
  }, [searchTerm, accessToken]);

  function handleKeyUp(event) {
    event.preventDefault();
    const query = event.target.value;

    setSearchTerm(query);

    if (query.trim() === '') {
      getInitialItems();
    }
  }

  return (
    <>
      <div>
        <div className='search-bar'>
          <input
            onKeyUp={handleKeyUp}
            className={classes}
            type={type}
            placeholder={placeholder}
            name={name}
            {...rest}
          />
          <img
            src='src/assets/searchIcon.svg'
            alt='Search Icon'
          />
        </div>
      </div>

      <div id='moodsContainer'>
        {moods.map((mood) => (
          <button
            className={moodId == mood.id ? 'currentMood' : 'moodButton'}
            onClick={() => handleMoodClick(mood?.id)}
            key={mood?.id}
          >
            {mood?.name}
          </button>
        ))}
      </div>

      {moodId ? (
        <div className='displayMoods'>
          <div className='moodsTitle'>
            <h2>{moods[moodId]?.name}</h2>
            {!loading && (
              <button
                className='refreshBtn'
                onClick={() => setOffset((prev) => prev + 8)}
              >
                <img
                  src='src/assets/refresh.svg'
                  alt='Refresh'
                />
              </button>
            )}
          </div>
          {loading ? (
            <div id='spinnerContainer'>
              <Spinner />
            </div>
          ) : (
            <>
              <div className='playlists'>
                {playlists.map((playlist) => (
                  <div
                    className='playlist'
                    key={playlist?.id}
                  >
                    <button
                      onClick={() => {
                        handlePlay(playlist?.uri, 'playlist');
                      }}
                    >
                      <LazyLoadImage
                        effect='opacity'
                        src={playlist?.images?.[0]?.url}
                        width='150px'
                        height='150px'
                      />
                    </button>
                    <p className='playlistName'>{playlist?.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <div id='spinnerContainer'>
              <Spinner />
            </div>
          ) : (
            <>
              <div className='displaySongs'>
                <h2>Top songs</h2>

                <div className='top-songs'>
                  {tracks.map((track) => (
                    <SongCard
                      setPlayItem={setPlayItem}
                      setIsPlaying={setIsPlaying}
                      key={track?.id}
                      uri={track?.uri}
                      name={track?.name}
                      artist={track?.artists
                        ?.map((artist) => artist?.name)
                        ?.join(', ')}
                      img={track?.album?.images?.[0]?.url}
                    />
                  ))}
                </div>
              </div>

              <div className='displayAlbums'>
                <h2>Albums</h2>
                <div className='albums'>
                  {albums.map((album) => (
                    <div
                      className='album'
                      key={album?.id}
                    >
                      <div className='albumImgContainer'>
                        <div className='albumIcons'>
                          <button
                            onClick={() => {
                              handlePlay(album?.uri, 'album');
                            }}
                          >
                            <img
                              src='src/assets/play_arrow_solid.svg'
                              alt='Play'
                            />
                          </button>
                          <button>
                            <img
                              src='src/assets/playlistAddIcon.svg'
                              alt='Add to playlist'
                            />
                          </button>
                        </div>
                        <LazyLoadImage
                          effect='opacity'
                          src={album?.images?.[0]?.url}
                          width='150px'
                          height='150px'
                        />
                      </div>
                      <p className='albumName'>{album?.name}</p>
                      <p>{album?.artists?.[0]?.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='displayPlaylists'>
                <h2>Playlists</h2>
                <div className='playlists'>
                  {playlists.map((playlist) => (
                    <div
                      className='playlist'
                      key={playlist?.id}
                    >
                      <button
                        onClick={() => {
                          handlePlay(playlist?.uri, 'playlist');
                        }}
                      >
                        <LazyLoadImage
                          effect='opacity'
                          src={playlist?.images?.[0]?.url}
                          width='150px'
                          height='150px'
                        />
                      </button>
                      <p className='playlistName'>{playlist?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
