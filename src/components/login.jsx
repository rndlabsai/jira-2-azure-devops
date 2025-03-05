import { useState, useEffect } from "react";
import "./login.css";
import loginImage from "../assets/login-image.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  const error = "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await api.post('/login', { username, password });
      console.log("Login exitoso:", response.data);
      alert("Inicio de sesión exitoso");
  
      // Store username in localStorage
      localStorage.setItem('username', username);
  
      // Navigate to the migrate page
      navigate("/migrate");
    } catch (err) {
      setError(err.response?.data?.message || "Error en el login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img
          src={loginImage}
          alt="UPB Migration Tool"
          className="login-image"
        />
        <h1>UPB Migration Tool</h1>
      </div>
      <div className="login-box">
        <h2>Log in</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              placeholder="Enter your email/username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
