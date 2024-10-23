import { StrictMode } from 'react'; // Adicione esta linha para importar o StrictMode
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importa o BrowserRouter
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Envolve o App com BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
