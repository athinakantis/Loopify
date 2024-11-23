import './PlaylistCard.css'

function PlaylistCard(props) {
    return (
        <div className="playlistCard">
            <img onClick={props.onClick} src={props.img} alt={props.playlistName}/>
            <p onClick={props.onClick}>{props.playlistName}</p>
        </div>
    )
}

export default PlaylistCard;