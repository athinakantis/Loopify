import './AlbumCard.css'

function AlbumCard(props) {
    return (
        <div className="albumCard">
            <img src={props.img} alt={props.songTitle}/>
            <p>{props.albumName}</p>
        </div>
    )
}

export default AlbumCard