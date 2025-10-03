import { useState } from "react";
import '../Login.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
function Login({setUser}) {
    const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const timer = useRef(null);
  const [messageLogin, setMessageLogin] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!userId) {
      try {
       const response = await axios.post(`${API_URL}/api/users/login`, formData);
       if(response.data.success===true){
        const loggedUser = {
          id:response.data.userId,
          username:response.data.username
        }
        setUser(loggedUser);
        sessionStorage.setItem("user", JSON.stringify(loggedUser));
        setMessageLogin("✅ Login Successful");
        if (timer.current) clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          navigate("/")
        }, 500);
      }
      else {
        setMessageLogin("❌ Invalid Credentials");
      }
      }
      catch(err){
        console.error("Login Error", err);
        setMessageLogin("Something went wrong, try again.");
      }
    }
    else {
      setMessageLogin("⚠️ You are already logged in");
    }
  };
    return (
         <div className="login-container">
      <form className="login-form login-page" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="signup-link">
        <p>No account yet ? <Link to="/create">Create an account</Link></p>
        </div>
        <button type="submit">Login
        </button>
        <div className="message">
         {messageLogin && (
         <p>{messageLogin}</p>
        )}
          </div>
       
      </form>
    </div>
    );
}

export default Login;