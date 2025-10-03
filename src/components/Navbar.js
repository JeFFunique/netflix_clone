import logo from '../images/netflix_transparent.png';
import '../Navbar.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import search_logo from '../images/search.png';
import axios from 'axios';
import account from '../images/account.png';
import { useState, useRef, useEffect } from 'react';
function Navbar({search, setSearch, resultSearch, setResultSearch}) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [activePath, setActivePath] = useState(location.pathname);
    const API_URL = process.env.REACT_APP_API_URL;
    const timer = useRef(null);
    const closeTimer = useRef(null);
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const userId = storedUser?.id;
      useEffect(() => {
    if(timer.current) clearTimeout(timer.current);
    if(search.trim() === ""){
      setResultSearch([]); 
    }
     timer.current = setTimeout(() => {
      axios
        .get(`${API_URL}/api/movies/search/${encodeURIComponent(search)}`)
        .then((res) => setResultSearch(res.data))
        .catch((err) => console.error("Search Error", err));
    }, 400); // waits 400ms after last keystroke
    return () => clearTimeout(timer.current);
  }, [search]);
     const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150) // small grace period
  }
  const handlePath = path => {
    setActivePath(path);
  }
  const handleChange = (e) =>{
    const value = e.target.value;
    setSearch(value);
    if(value.trim() !== "" && location.pathname !== "/search"){
     navigate("/search");
    }

  }
return (
<div className="navbar">
  {/* LEFT SIDE */}
  <ul className="nav-left">
    <ul>
    <li className="logo"><img src={logo} alt="Fakeflix" /></li></ul>
    <ul className='part-2'>
    <li><Link to="/"       className={activePath==='/'        ? 'active-link' : ''} onClick={() => handlePath('/')}>Accueil</Link></li>
    <li><Link to="/series" className={activePath==='/series'  ? 'active-link' : ''} onClick={() => handlePath('/series')}>Séries</Link></li>
    <li><Link to="/films"  className={activePath==='/films'   ? 'active-link' : ''} onClick={() => handlePath('/films')}>Films</Link></li>
    <li><Link to="/favoris"className={activePath==='/favoris' ? 'active-link' : ''} onClick={() => handlePath('/favoris')}>Mes favoris</Link></li>
    </ul>
  </ul>

  {/* RIGHT SIDE */}
  <ul className="nav-right">
    <li className="search">
      <Link to="/search"><img src={search_logo} alt="search" /></Link>
      <input value={search} onChange={handleChange}/>
    </li>
    <li className="account" onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
      <img src={account} alt="account"/>
      {open && (
        <div className="dropdown">
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/create">Create an account</Link></li>
            {userId ? <li><Link to="/logout">Log out</Link></li> : null }
            <li><Link to="/login">Change profile</Link></li>
          </ul>
        </div>
      )}
    </li>
  </ul>
</div>
);
}

export default Navbar;