import './PlaylistCard.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

function PlaylistCard(props) {
    return (
        <div className='playlistCard'>
            <LazyLoadImage
                src={props.img}
                alt={props.playlistName}
                onClick={props.onClick}
                effect='opacity'
            />
            <p className='playlistName' onClick={props.onClick}>{props.playlistName}</p>
        </div>
    );
}

export default PlaylistCard;
