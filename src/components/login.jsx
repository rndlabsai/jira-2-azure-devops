import { useState } from 'react'

{/*Importacion de los css necesarios*/}
import './login.css'
import '../styles/global.css'

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