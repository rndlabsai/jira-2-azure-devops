import { useEffect } from "react";
import "./login.css";
import loginImage from "../assets/login-image.jpg";

function Login() {
  useEffect(() => {

    document.body.classList.add("login-page");

    
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  return (
    <div className="login-container">
      <div className="login-header">
        <img src={loginImage} alt="UPB Migration Tool" className="login-image" />
        <h1>UPB Migration Tool</h1>
      </div>
      <div className="login-box">
        <h2>Log in</h2>
        <form>
          <div className="input-group">
            <input type="text" id="username" placeholder="Enter your email/username" required />
          </div>
          <div className="input-group">
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
