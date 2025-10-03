import '../DisplayFilmList.css';
import VideoPlayer from './VideoPlayer';
import { useState, useRef, useEffect, useLayoutEffect} from 'react';
import add_50 from '../images/add_50.png';
import axios from 'axios';
import genres from "../genres";
function DisplayFilmList({favorites, user_recommendations, trending, general_recommendations, mostWatchedGenre}){
  const [movie_hovered, setMovie_hovered] = useState(null);
  const [isplaying, setIsPlaying] = useState(false);
  const timer = useRef(null);
  const [movieClicked, setMovieClicked] = useState(null);
  const rows = ["favorites", "user-recommendations", "trending", "general"];
  const API_URL = process.env.REACT_APP_API_URL;
  const defaultGenre = genres["10749"];
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const mostWatchedGenreName = genres[mostWatchedGenre] || "";
  const userId = storedUser?.id;
  const [showLeft, setShowLeft] = useState({
    favorites: false,
    "user-recommendations": false,
    trending: false,
    general: false,
  });
  const [showRight, setShowRight] = useState({
    "favorites": false,
    "user-recommendations": false,
    "trending": false,
    "general": false,
  });
const handleScrollUpdate = (rowKey, dir = 0) => {
  const el = document.getElementById(rowKey);
  if (!el) return;

  // If clicking arrows, move by a whole number of cards
  if (dir !== 0) {
    const firstCard = el.querySelector(".container");
    if (firstCard) {
      const gap = parseFloat(getComputedStyle(el).gap) || 0;
      const cardW = firstCard.getBoundingClientRect().width;
      const snap = cardW + gap;
      const perPage = Math.max(1, Math.floor(el.clientWidth / snap));
      let target = el.scrollLeft + dir * perPage * snap;
      target = Math.round(target / snap) * snap;
      target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  }

  // Update arrow visibility
  const eps = 2;
  const atStart = el.scrollLeft <= eps;
  const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - eps;

  setShowLeft(p => ({ ...p, [rowKey]: !atStart }));
  setShowRight(p => ({ ...p, [rowKey]: !atEnd }));
};


// initialize arrows on mount + on resize
useLayoutEffect(() => {
  const EPS = 6; // tolerate zoom/rounding
  const getRows = () => rows
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const recalcRow = (el) => {
    const atStart = el.scrollLeft <= EPS;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - EPS;
    setShowLeft(p => ({ ...p, [el.id]: !atStart }));
    setShowRight(p => ({ ...p, [el.id]: !atEnd }));
  };

  const recalcAll = () => getRows().forEach(recalcRow);

  // 1) run after first layout
  requestAnimationFrame(recalcAll);

  // 2) observe container size changes (responsive, zoom, scrollbars)
  const ro = new ResizeObserver(() => recalcAll());
  getRows().forEach(el => ro.observe(el));                     // observe each row
  ro.observe(document.documentElement);                        // catch viewport changes too

  // 3) when images finish, recalc
  const imgs = Array.from(document.querySelectorAll(".list-displayed img"));
  const onImg = () => recalcAll();
  imgs.forEach(img => img.complete ? null : img.addEventListener("load", onImg, { once:true }));

  // 4) when web-fonts finish, recalc (titles affect width)
  if (document.fonts?.ready) {
    document.fonts.ready.then(recalcAll);                      // CSS Font Loading API
  }

  // 5) also when visibility changes (tab restore)
  const onVis = () => recalcAll();
  document.addEventListener("visibilitychange", onVis);

  return () => {
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVis);
  };
}, []); 
  // Hover handlers
  const handleHoverEnter = (movie) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMovie_hovered(movie), 150);
  };
 const handleHoverLeave = (e) => {
  const rt = e.relatedTarget;
  if (rt && rt.closest && rt.closest('.scroll-btn')) return; // keep hover
  if (timer.current) clearTimeout(timer.current);
  timer.current = null;
  setMovie_hovered(null);
};

  // Favorite
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

  // Track watch
const handleClick = async (movie) => {
    setIsPlaying(true);
    setMovieClicked(movie);
  };

return(
    <>
 <div className="film-display">
      <h2>Favorites</h2>
      <div className="carousel">
        {showLeft["favorites"] && (
          <button className="scroll-btn left" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("favorites", -1)}}>‹</button>
        )}

        <div
          id="favorites"
          className="list-displayed"
          onScroll={() => handleScrollUpdate("favorites")}
        >
         {userId ? (favorites.map((movie) => {
            const isActive = movie_hovered?.tmdbId === movie.tmdbId;
            return (
              <div
                key={movie.tmdbId}
                className={`container ${isActive ? "container-active" : ""}`}
                onMouseEnter={() => handleHoverEnter(movie)}
                onMouseLeave={(e) => handleHoverLeave(e)}
                onClick={() => {
                  handleClick(movie)}}
              >
                <div className="card-inner">
                  <img src={movie.imageUrl} alt={movie.title} />
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
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            );
          })) : <p>Login to see your list</p>}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>

        {showRight["favorites"] && (
          <button className="scroll-btn right" onClick={(e) =>  {
            e.stopPropagation();
            handleScrollUpdate("favorites", 1)}}>›</button>
        )}
      </div>
    </div>
  <div className="film-display">
       {userId ? <h2>Because you have watched {mostWatchedGenreName} movies</h2> : <h2>Because you have watched {defaultGenre} movies</h2>}
      <div className="carousel">
        {showLeft["user-recommendations"] && (
          <button className="scroll-btn left" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("user-recommendations", -1)}}>‹</button>
        )}

        <div
          id="user-recommendations"
          className="list-displayed"
          onScroll={() => handleScrollUpdate("user-recommendations")}
        >
          {user_recommendations.map((movie) => {
            const isActive = movie_hovered?.tmdbId === movie.tmdbId;
            return (
              <div
                key={movie.tmdbId}
                className={`container ${isActive ? "container-active" : ""}`}
                onMouseEnter={() => handleHoverEnter(movie)}
                onMouseLeave={(e) => handleHoverLeave(e)}
                   onClick={() => {
                  handleClick(movie)}}
              >
                <div className="card-inner">
                  <img src={movie.imageUrl} alt={movie.title} />
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
                  <div className="movie-card__content">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>

        {showRight["user-recommendations"] && (
          <button className="scroll-btn right" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("user-recommendations", 1)}}>›</button>
        )}
      </div>
    </div>
  
  <div className="film-display">
      <h2>Trending</h2>
      <div className="carousel">
        {showLeft["trending"] && (
          <button className="scroll-btn left" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("trending", -1)}}>‹</button>
        )}

        <div
          id="trending"
          className="list-displayed"
          onScroll={() => handleScrollUpdate("trending")}
        >
          {trending.map((movie) => {
            const isActive = movie_hovered?.tmdbId === movie.tmdbId;
            return (
              <div
                key={movie.tmdbId}
                className={`container ${isActive ? "container-active" : ""}`}
                onMouseEnter={() => handleHoverEnter(movie)}
                onMouseLeave={(e) => handleHoverLeave(e)}
                   onClick={() => {
                  handleClick(movie)}}
              >
                <div className="card-inner">
                  <img src={movie.imageUrl} alt={movie.title} />
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
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>

        {showRight["trending"] && (
          <button className="scroll-btn right" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("trending", 1)}}>›</button>
        )}
      </div>
    </div>
  <div className="film-display">
      <h2>Your Recommendations</h2>
      <div className="carousel">
        {showLeft["general"] && (
          <button className="scroll-btn left" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("general", -1)}}>‹</button>
        )}

        <div
          id="general"
          className="list-displayed"
          onScroll={() => handleScrollUpdate("general")}
        >
          {general_recommendations.map((movie) => {
            const isActive = movie_hovered?.tmdbId === movie.tmdbId;
            return (
              <div
                key={movie.tmdbId}
                className={`container ${isActive ? "container-active" : ""}`}
                onMouseEnter={() => handleHoverEnter(movie)}
                onMouseLeave={(e) => handleHoverLeave(e)}
                   onClick={() => {
                  handleClick(movie)}}
              >
                <div className="card-inner">
                  <img src={movie.imageUrl} alt={movie.title} />
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
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {isplaying && <VideoPlayer movieClicked={movieClicked} onClose={() => setIsPlaying(false)} />}
        </div>

        {showRight["general"] && (
          <button className="scroll-btn right" onClick={(e) => {
            e.stopPropagation();
            handleScrollUpdate("general", 1)}}>›</button>
        )}
      </div>
    </div>
</>
);
}

export default DisplayFilmList;