import './SongCard.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function SongCard({ name, artist, img, uri, setPlayItem }) {
    function handlePlay() {
        setPlayItem({
            uri: uri,
            type: 'track',
        });
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
                <p>{name}</p>
                <p>{artist}</p>
            </div>
        </div>
    );
}

export default SongCard;
