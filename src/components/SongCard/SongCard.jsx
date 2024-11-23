import "./SongCard.css";

function SongCard(props) {
  return (
    <div className="songCard">
      <img src={props.img} alt={props.songtitle} />
      <div className="songDetails">
        <p>{props.songTitle}</p>
        <p>{props.songArtist}</p>
      </div>
    </div>
  );
}

export default SongCard;
