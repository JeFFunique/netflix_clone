import { useState, useEffect, useRef } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import '../Series.css';
import add_50 from '../images/add_50.png';
function Series() {
const [series, setSeries] = useState([]);
const [movie_hovered, setMovie_hovered] = useState(null);
const [isplaying, setIsPlaying] = useState(false);
const timer = useRef(null);
const API_URL = process.env.REACT_APP_API_URL;
const [movieClicked, setMovieClicked] = useState(null);
const storedUser = JSON.parse(sessionStorage.getItem("user"));
const userId = storedUser?.id;
useEffect(() => {
const fetchSeries = async () => {
    axios.get(`${API_URL}/api/movies/only/series`)
    .then(res => res.data)
    .then(res => setSeries(res));
}
fetchSeries();
}, []);
const handleHoverEnter = (movie) => {
    if(timer.current) clearTimeout(timer.current);
timer.current = window.setTimeout(() => {
    setMovie_hovered(movie);
}, 150);
}
const handleHoverLeave = ()=> {
if(timer.current) {
clearTimeout(timer.current);
timer.current=null;
}
    setMovie_hovered(null);
}
  const handleFavorite = async (movie) => {
    if(userId) {
    try {
      await axios.post(`${API_URL}/api/favorites/add/${userId}`, {
        tmdbId:movie.tmdbId,
        title:movie.title,
        overview:movie.overview,
        imageUrl:movie.imageUrl,
        backgroundImageUrl:movie.backgroundImageUrl,
        category:"FAVORITES",
        genreIds:movie.genreIds
      });
    } catch (err) {
      console.error("Error adding favorites:", err);
    }
  }
    else{
      return null;
    }
  };
const handleClick = async (movie) => {
    setIsPlaying(true);
    setMovieClicked(movie);
  };

return(
    <>
<div className="series-page">
   <h1>Series</h1>
<div className='list-displayed'>
{series.map(movie => {
  const isActive = movie_hovered?.tmdbId === movie.tmdbId;
            return (
              <div
                key={movie.tmdbId}
                className={`container ${isActive ? "container-active" : ""}`}
                onMouseEnter={() => handleHoverEnter(movie)}
                onMouseLeave={(e) => handleHoverLeave(e)}
                onClick={() => handleClick(movie)}
              >
                <div className="card-inner">
                  <img src={movie.imageUrl} alt={movie.name} />
                  <div className="movie-card">
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(movie);
                      }}
                    >
                      <img src={add_50} alt="Add to favorites" />
                    </button>
                    <h3>{movie.name}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>
        </div>
        </>
);
}

export default Series;