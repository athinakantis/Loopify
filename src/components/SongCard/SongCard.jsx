import "./SongCard.css";

function SongCard(props) {
  return (
    <div className="songCard">
      <img src={props.img} alt={props.songtitle} />
      <div className="songDetails">
        <p className="songName">{props.songTitle}</p>
        <p className="songArtist">{props.songArtist}</p>
      </div>
    </div>
  );
}

export default SongCard;
