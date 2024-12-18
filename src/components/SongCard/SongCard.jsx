import './SongCard.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function SongCard({
    name,
    artist,
    img,
    uri,
    setPlayItem,
    setIsPlaying,
    type = 'track',
    playlistUri = null
}) {
    function handlePlay() {
        setPlayItem({
            uri: uri,
            type: type,
            playlistUri: playlistUri
        });
        setIsPlaying(true);
    }
  return (
    <div className="songCard">
      <div className="songCardIcons">
        <button onClick={handlePlay}>
          <img src="src/assets/play_arrow_solid.svg" alt="Play" />
        </button>
        <button>
          <img src="src/assets/playlistAddIcon.svg" alt="Add to playlist" />
        </button>
      </div>
      <div className="songCardImg">
        <button onClick={handlePlay}>
          <LazyLoadImage effect="opacity" src={img} alt={name} />
        </button>
      </div>
      <div className="songDetails">
        <p className="songName">{name}</p>
        <p className="songArtist">{artist}</p>
      </div>
    </div>
  );
}

export default SongCard;
