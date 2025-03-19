import { useState, useEffect } from "react";
import "./create-user.css";
import loginImage from "../assets/login-image.jpg";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
      document.body.classList.add("create-user-page");
      return () => {
        document.body.classList.remove("create-user-page");
      };
    }, []);

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError("");

    if (password1 !== password2) {
      setError("Passwords do not match.");
      return;
    }

    // Logica Backend
    alert(`User ${username} registered successfully!`);
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
        <h2>Create Account</h2>
        {error && (
          <p className="error-message" style={{ color: "black" }}>
            {error}
          </p>
        )}
        <form onSubmit={handleCreateUser}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
