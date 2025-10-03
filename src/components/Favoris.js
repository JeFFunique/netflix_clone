import { useState, useRef } from "react";
import '../DisplayFilmList.css';
import '../Series.css';
import VideoPlayer from "./VideoPlayer";
function Favoris({favoris}) {
    const [movie_hovered, setMovie_hovered] = useState(null);
    const [isplaying, setIsPlaying] = useState(false);
    const timer = useRef(null);
    const [movieClicked, setMovieClicked] = useState(null);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const userId = storedUser?.id;
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
const handleClick = async (movie) => {
    setIsPlaying(true);
    setMovieClicked(movie);
  };
return(
<>
<div className="series-page">
  <h1>My List</h1>
<div className='list-displayed'>
{userId && (favoris.map(movie => {
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
                  <img src={movie.imageUrl} alt={movie.title} />
                  <div className="movie-card">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            );
          }))}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>
        </div>
</>
);
}

export default Favoris