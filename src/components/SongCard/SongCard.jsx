import './SongCard.css';

function SongCard({img, title, artist, setIsPlaying, setPlayItem, uri}) {
    function handlePlay(trackUri) {
        const jsonTracks = JSON.stringify({uris: [trackUri]})
        console.log(jsonTracks)
        setPlayItem(jsonTracks)
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
