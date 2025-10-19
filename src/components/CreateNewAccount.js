import '../Login.css';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CreateNewAccount() {
 const [formData, setFormData] = useState({
        firstname:"",
        lastname:"",
        username: "",
        email: "",
        password: "",
        role:"USER"
      });
const storedUser = JSON.parse(sessionStorage.getItem("user"));
const userId = storedUser?.id;
const API_URL = process.env.REACT_APP_API_URL;
const timer = useRef(null);
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState("");
const [messageCreate, setMessageCreate] = useState({
  type:"error",
  text:""
});
const handleChange= (e) => {
    setFormData(prevState => ({
        ...prevState,
        [e.target.name]:e.target.value
    }))
}
const checkDbReady = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/health/db`, { timeout: 2000 });
    return res.status === 200;
  } catch (err) {
    return false;
  }
};
const handleSubmit = async (e) => {
e.preventDefault();
setMessageCreate(null);
if(!userId) {
    setMessageCreate({
    type: "info",
    text: "⏳ Checking server status..."
  });
  let ready = await checkDbReady();
    if (!ready) {
    setMessageCreate({
      type: "info",
      text: "💤 Waking up the server, please wait 5–10s..."
    });
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 2000)); // wait 2s
      ready = await checkDbReady();
      if (ready) break;
    }
  }
  setMessageCreate({
    type: "info",
    text: "🚀 Server ready! Creating your account..."
  });
try{
    const response = await axios.post(`${API_URL}/api/users/create`, formData)
    if(response.data.success===true){
        setMessageCreate({
          type:"success",
          text:"New account successfully created ✅"
        });
         if (timer.current) clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          navigate("/login")
        }, 500);
    }
}
catch(err){
   if (err.response && err.response.data) {
   setMessageCreate({
    type:"error",
    text:`Failed to create a new account: ${err.response.data.message}`
   });
   }
   else{
    setMessageCreate({
      type:"error",
      text:"An unexpected error occur"
    });
   }
}
}
else {
  return null;
}
}

    return (
 <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>
        <input
          type="text"
          name="firstname"
          placeholder="Firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

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
        <button type="submit">Create an account</button>
        <div className='message'>
         {messageCreate && (
         <p className={
    messageCreate.type === "success"
      ? "success-msg"
      : messageCreate.type === "error"
      ? "error-msg"
      : "info-msg"
  }>{messageCreate.text}</p>
        )}
        </div>
      </form>
    </div>
    );
}

export default CreateNewAccount;