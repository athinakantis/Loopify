import "./SongCard.css";

function SongCard({ name, artist, img, uri, setPlayItem }) {
  function handlePlay() {
    setPlayItem({
      uri: uri,
      type: "track",
    });
  }

  return (
    <div className="songCard">
      <button onClick={handlePlay}>
        <img src={img} alt={name} />
      </button>
      <div className="songDetails">
        <p>{name}</p>
        <p>{artist}</p>
      </div>
    </div>
  );
}

export default SongCard;
