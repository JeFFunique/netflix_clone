import '../VideoPlayer.css';
import demoVideo from '../images/city_at_night.mp4';
import { createPortal } from "react-dom";
import { useState } from 'react'; 
import axios from 'axios';
function VideoPlayer({ movieClicked, onClose }) {
  const [watchTime, setWatchTime] = useState(0);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const API_URL = process.env.REACT_APP_API_URL;
    const handleTimeUpdate = (e) => {
    setWatchTime(Math.floor(e.target.currentTime)); // seconds or minutes
  };
    const handleExit = async () => {
      if(userId) {
    try {
      await axios.post(`${API_URL}/api/watch/save`, {
        userId:userId,
        tmdbId: movieClicked.tmdbId,
        genreIds: movieClicked.genreIds,
        watchTime,
        watchedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error updating watch record", err);
    }
  }
  else {
    return null;
  }
  onClose(); // close the player
  };

  return createPortal(
    <div className="video-overlay">
      <div className="video-container">
        <video src={demoVideo} autoPlay controls muted loop onTimeUpdate={handleTimeUpdate} onEnded={handleExit}/>
        <button className="close-btn" onClick={handleExit}>✕</button>
      </div>
    </div>,
    document.body
  );
}

export default VideoPlayer;