import { useState, useEffect } from "react"; 
import axios from 'axios';
import "./jira-section.css";
import "../styles/global.css";

function ZephyrSection() {
  // Estados para almacenar los valores ingresados
  const [apiToken, setApiToken] = useState('');
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');

  // Obtener los tokens del usuario al cargar el componente
  useEffect(() => {
    const fetchTokens = async () => {
      const username = localStorage.getItem('username');
      if (!username) {
        console.log("Usuario no ha iniciado sesión.");
        return;
      }

      try {
        // Hacer la solicitud para obtener los tokens
        const response = await axios.get('http://localhost:4000/api/tokens', {
          params: { username }
        });

        if (response.data.success && response.data.tokens) {
          // Buscar el token de Jira
          const jiraToken = response.data.tokens.find(token => token.Application === 'Jira');
          if (jiraToken) {
            // Llenar los campos con los datos del token de Jira
            setApiToken(jiraToken.Number);
            setEmail(jiraToken.email);
            setUrl(jiraToken.url);
          }
        }
      } catch (error) {
        console.error("Error al obtener los tokens:", error);
      }
    };

    fetchTokens();
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez al montar el componente

  const handleSaveToken = async () => {
    const username = localStorage.getItem('username');
    if (!apiToken || !username) {
      alert("Falta ingresar el API Token o el usuario no ha iniciado sesión.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/save-token', {
        username,
        token: apiToken,
        email: email || null, // Enviar null si email no está definido
        url: url || null, // Enviar null si url no está definido
      });

      if (response.data.success) {
        alert("Token guardado exitosamente!");
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error al guardar el token:", error);
      alert("No se pudo guardar el token: " + (error.response?.data?.message || error.message));
    }
  };


  return (
    <div className="zephyr-section">
      <h2>Zephyr</h2>
      <div className="input-group">
        <label htmlFor="api-token">API Token:</label>
        <input
          type="text"
          id="api-token"
          placeholder="Enter your Zephyr API token"
        />

      </div>
      <button className="save-button" onClick={handleSaveToken}>
        Save Zephyr Token
      </button>
    </div>
  );
}

export default ZephyrSection;