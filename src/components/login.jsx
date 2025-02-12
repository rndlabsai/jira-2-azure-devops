import { useState } from 'react'
import './login.css'

function Login() {

  return (
    <div class = "login">
        <h1>Login</h1>
        <form>
            <input type="text" placeholder="Username" required/>
            <input type="password" placeholder="Password" required/>
            <button type="submit">Entrar</button>
        </form>
        </div>
  )
}

export default Login