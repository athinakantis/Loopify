import './AlbumCard.css'

function AlbumCard({img, title}) {
    return (
        <div className='albumCard'>
            <img src={img} alt={title}/>
            <p>{title}</p>
        </div>
    )
}

export default AlbumCard