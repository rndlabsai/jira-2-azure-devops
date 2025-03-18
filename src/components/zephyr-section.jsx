import { useState, useEffect } from "react";
import axios from "axios";
import "./zephyr-section.css";
import "../styles/global.css";
import { postTokens } from "../../utils/api";

function ZephyrSection() {
  // Estados para almacenar los valores ingresados
  const [apiToken, setApiToken] = useState("");
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");

  // Obtener los tokens del usuario al cargar el componente
  useEffect(() => {
    const fetchTokens = async () => {
      const username = localStorage.getItem("username");
      if (!username) {
        console.log("Usuario no ha iniciado sesión.");
        return;
      }

      try {
        // Hacer la solicitud para obtener los tokens
        const response = await axios.get("http://localhost:4000/api/tokens", {
          params: { username },
        });

        if (response.data.success && response.data.tokens) {
          // Buscar el token de Zephyr
          const zephyrToken = response.data.tokens.find(
            (token) => token.Application === "Zephyr"
          );
          if (zephyrToken) {
            // Llenar los campos con los datos del token de Zephyr
            setApiToken(zephyrToken.Number);
            setEmail(zephyrToken.email);
            setUrl(zephyrToken.url);
          }
        }
      } catch (error) {
        console.error("Error al obtener los tokens:", error);
      }
    };

    fetchTokens();
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez al montar el componente

  const handleSaveToken = async () => {
    const username = localStorage.getItem("username");
    if (!apiToken || !username) {
      alert("Falta ingresar el API Token o el usuario no ha iniciado sesión.");
      return;
    }

    try {
      const data = await postTokens(
        username,
        apiToken,
        "Zephyr",
        email || null,
        url || null
      );

      if (data[0]) {
        alert(data[1] || "Token saved successfully!");
      } else {
        alert("Error: " + (data[1] || "Unknown error"));
      }
    } catch (error) {
      console.error("Error while saving credentials:", error);
      alert(
        "Unable to save your credentials: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const deleteToken = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("El usuario no ha iniciado sesión.");
      return;
    }

    try {
      // Obtener el ID del token de Zephyr del usuario
      const response = await axios.get("http://localhost:4000/api/tokens", {
        params: { username },
      });

      console.log("Respuesta del backend en deleteToken:", response.data); // Debug

      if (response.data.success && response.data.tokens) {
        // Buscar el token de zephyr
        const zephyrToken = response.data.tokens.find(
          (token) => token.Application === "Zephyr"
        );

        console.log("Token encontrado en deleteToken:", zephyrToken); // Debug

        if (!zephyrToken || !zephyrToken.id) {
          alert("No se encontró un token de Zephyr para este usuario.");
          return;
        }

        console.log("Intentando eliminar el token con ID:", zephyrToken.id); // Debug

        // Enviar solicitud para eliminar el token
        const deleteResponse = await axios.delete(
          "http://localhost:4000/api/delete-token",
          {
            data: { username, tokenId: zephyrToken.id },
          }
        );

        if (deleteResponse.data.success) {
          alert("Token eliminado correctamente!");
          // Limpiar los campos del formulario
          setApiToken("");
          setEmail("");
          setUrl("");
        } else {
          alert("Error: " + deleteResponse.data.message);
        }
      }
    } catch (error) {
      console.error("Error al eliminar el token:", error);
      alert(
        "No se pudo eliminar el token: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="zephyr-section">
      <h2>Zephyr</h2>
      <div className="input-group">
        <label htmlFor="api-token">API Token:</label>
        <input
          type="password"
          id="api-token"
          placeholder="Enter your Zephyr API token"
        />
      </div>
      <button className="save-button" onClick={handleSaveToken}>
        Save Zephyr Token
      </button>
      <button className="save-button" onClick={deleteToken}>
        Delete Zephyr Token
      </button>
    </div>
  );
}

export default ZephyrSection;
