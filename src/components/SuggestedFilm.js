import lecture from '../images/lecture_eda.png';
import infos from '../images/infos.png';
import '../SuggestedFilm.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from './VideoPlayer';
function SuggestedFilm({most_popular_movie}) {
const [trailer_most_popular_movie, setTrailer_most_popular_movie] = useState(null);
const [isplaying, setIsPlaying] = useState(false);
const [showPopup, setShowPopup] = useState(false);
const [movieClicked, setMovieClicked] = useState(null);
const API_URL = process.env.REACT_APP_API_URL;
const handleClick = async (movie) => {
    setIsPlaying(true);
    setMovieClicked(movie);
  };
useEffect(() => {
const fetchTrailer = async () => {
    try {
        if(!most_popular_movie?.tmdbId) return;
        const res = await axios.get(`${API_URL}/api/movies/trailer/${most_popular_movie.tmdbId}`);
        setTrailer_most_popular_movie(res.data);
    }
    catch(err){
        console.error("error fetching trailer", err);
    }
}
fetchTrailer();
}, [most_popular_movie]);
return (
<div className="film-panel">
    {trailer_most_popular_movie && trailer_most_popular_movie.key && (
        <div className="video-background">
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${trailer_most_popular_movie.key}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=${trailer_most_popular_movie.key}`}
          title="Trailer"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        >
        </iframe>
        </div>
    )}
<div className="front-panel">
    {most_popular_movie && (
    <>
    <h1>{most_popular_movie.title}</h1>
    <p className='description'>{most_popular_movie.overview}</p>
    </>
    )}
    <div className="buttons">
    <button className="play" onClick={() => handleClick(most_popular_movie)}>
    <img src={lecture}/>
    <span><b>Lecture</b></span>
    </button>
    <button className="play" onClick={() => setShowPopup(true)}>
    <img src={infos}/>
    <span>Plus d'infos</span>
    </button>
    </div>
</div>
 {/* Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2>{most_popular_movie.title}</h2>
            <p>{most_popular_movie.overview}</p>
            <button onClick={() => setShowPopup(false)}>Fermer</button>
          </div>
        </div>
      )}
{isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)}/>}
</div>
);
}

export default SuggestedFilm;