import { message } from "antd";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Arquivo de estilo
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("dark-mode");
  const [loading, setLoading] = useState(false); 
  const [loginError, setLoginError] = useState(""); 

  const navigate = useNavigate(); 

  // Verifique se o usuário já está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/TelaHome"); // Redireciona para a página inicial se o token existir
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 100); 
    document.body.className = theme; 
  }, [theme, navigate]);

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    if (!email) {
      isValid = false;
      formErrors.email = "O campo e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      formErrors.email = "Formato de e-mail inválido";
    }

    if (!password) {
      isValid = false;
      formErrors.password = "O campo senha é obrigatório";
    } else if (password.length < 0) {
      isValid = false;
      formErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); 
    if (validate()) {
      setLoading(true); 
      try {
        const response = await fetch("https://api.airsoftcontrol.com.br/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha: password, 
          }),
        });

        if (response.ok) {
          const data = await response.json();
          message.success("Login realizado com sucesso!");
          localStorage.setItem("token", data.token);
          console.log(data.token)
          navigate("/TelaHome"); // Redireciona para a página home após o login
        } else if (response.status === 401) {
          const errorData = await response.json();
          setLoginError(errorData.message || "Credenciais inválidas");
        } else {
          const errorData = await response.json();
          setLoginError(errorData.message || "Erro ao realizar o login");
        }
      } catch (error) {
        setLoginError("Falha ao conectar ao servidor");
      } finally {
        setLoading(false); 
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "dark-mode" ? "light-mode" : "dark-mode"
    );
  };

  return (
    <div>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "dark-mode" ? <FaSun /> : <FaMoon />}
      </button>
      <div className={`login-container ${isLoaded ? "loaded" : ""}`}>
        <div className="logo">
          <img src="/logo.png" alt="Força Tática Paracatu Airsoft" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error-input" : ""}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
            />
            <label htmlFor="rememberMe">Relembrar login e senha</label>
          </div>

          {loginError && <p className="error">{loginError}</p>} 

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Carregando..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;