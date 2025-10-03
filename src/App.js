import './App.css';
import Homepage from './components/Homepage';
import { Routes, Route } from "react-router-dom";
import Series from './components/Series';
import Films from './components/Films';
import Favoris from './components/Favoris';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './components/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Logout from './components/Logout';
import CreateNewAccount from './components/CreateNewAccount';
function App() {
const [favorites, setFavorites] = useState([]);
const [user_recommendations, setUser_recommendations] = useState([]);
const [trending, setTrending] = useState([]);
const [general_recommendations, setGeneral_recommendations] = useState([]);
const [most_popular_movie, setMost_popular_movie] = useState(null);
const [search, setSearch] = useState("");
const [resultSearch, setResultSearch] = useState([]);
const [mostWatchedGenre, setMostWatchedGenre] = useState("");
 const defaultGenre = genres["10749"];
const API_URL = process.env.REACT_APP_API_URL;
const [user, setUser] = useState(
  JSON.parse(sessionStorage.getItem("user")) || null
);
const [isLoggedOut, setIsLoggedOut] = useState(false);
const userId = user?.id; // directly from state
 const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsLoggedOut(true);
  };
useEffect(() => {
  const fetchAll = async () => {
    if (userId) {
      try {
        const now = new Date().toISOString();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        const from = fromDate.toISOString();

        const userRes = await axios.post(
          `${API_URL}/api/watch/recommendations/genre`,
          {
            userId: userId,
            fromDate: from,
            toDate: now,
          }
        );
        let genre = userRes?.data;
         if (!genre || genre.length === 0) {
          console.warn("No user history found, falling back to default genres.");
          genre = 28; // Action for example (or pick randomly from a list)
        }
          setMostWatchedGenre(genre);

          const [allData, popularRes] = await Promise.all([
            axios.get(`${API_URL}/api/movies/all/${genre}/${defaultGenre}/${userId}`),
            axios.get(`${API_URL}/api/movies/movie_most_popular`),
          ]);

          setFavorites(allData.data.favorites);
          setUser_recommendations(allData.data.userBased);
          setTrending(allData.data.trending);
          setGeneral_recommendations(allData.data.generalBased);
          setMost_popular_movie(popularRes.data);
        
      } catch (err) {
        console.error("Error fetching recommendations", err);
      }
    } else {
      try {
        const [allData, popularRes] = await Promise.all([
          axios.get(`${API_URL}/api/movies/all/28/878`),
          axios.get(`${API_URL}/api/movies/movie_most_popular`),
        ]);

        setFavorites([]);
        setUser_recommendations(allData.data.userBased);
        setTrending(allData.data.trending);
        setGeneral_recommendations(allData.data.generalBased);
        setMost_popular_movie(popularRes.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    }
  };
fetchAll();
}, [user]);
  return (
  <>
  <Navbar search={search} setSearch={setSearch} resultSearch={resultSearch} setResultSearch={setResultSearch}/>
  <Routes>
     <Route path="/" element={<Homepage
     favorites={favorites}
     user_recommendations={user_recommendations}
     trending={trending}
     general_recommendations={general_recommendations}
     most_popular_movie={most_popular_movie}
     mostWatchedGenre={mostWatchedGenre}
     />} />
     <Route path="/series" element={<Series/>} />
     <Route path="/films" element={<Films/>} />
     <Route path="/favoris" element={<Favoris favoris={favorites}/>} />
     <Route path="/search" element={<Search movie_searched={resultSearch}/>} />
     <Route path="/login" element={<Login setUser={setUser}/>} />
     <Route path="/create" element ={<CreateNewAccount/>}/>
     <Route path="/logout" element ={<Logout onLogout={handleLogout} isLoggedOut={isLoggedOut}/>}/>
  </Routes>
  <Footer/>
  </>
  );
}

export default App;
