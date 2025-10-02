import SuggestedFilm from "./SuggestedFilm";
import DisplayFilmList from "./DisplayFilmList";
import '../Homepage.css';
function Homepage({favorites, user_recommendations, trending, general_recommendations, most_popular_movie, mostWatchedGenre}) {
return(
<>
<SuggestedFilm most_popular_movie={most_popular_movie}/>
<DisplayFilmList favorites={favorites} user_recommendations={user_recommendations} trending={trending} general_recommendations={general_recommendations} mostWatchedGenre={mostWatchedGenre}/>
</>
);
}

export default Homepage;