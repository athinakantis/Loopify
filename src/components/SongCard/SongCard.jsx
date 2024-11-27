import './SongCard.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function SongCard({ name, artist, img, uri, setPlayItem, setIsPlaying }) {
    function handlePlay() {
        setPlayItem({
            uri: uri,
            type: 'track',
        });
        setIsPlaying(true);
    }

    return (
        <div className='songCard'>
            <button onClick={handlePlay}>
                <LazyLoadImage
                    effect='opacity'
                    src={img}
                    alt={name}
                />
            </button>
            <div className='songDetails'>
                <p className='songName'>{name}</p>
                <p className='songArtist'>{artist}</p>
            </div>
        </div>
    );
}

export default SongCard;
