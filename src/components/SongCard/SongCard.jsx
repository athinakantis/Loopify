import './SongCard.css';

function SongCard({img, id, title, artist, setIsPlaying, setPlayItem, uri}) {
    function handlePlay() {
        setPlayItem({
            id: id,
            artist: artist,
            uri: uri,
            title: title,
            img: img,
            isTrack: true
        })
        setIsPlaying(true)
    }

    return (
        <div className='songCard'>
            <button onClick={() => handlePlay(uri)}>
            <img src={img} alt={title} />
            </button>
            <div className='songDetails'>
            <p>{title}</p>
            <p>{artist}</p>
            </div>
        </div>
    );
}

export default SongCard;
