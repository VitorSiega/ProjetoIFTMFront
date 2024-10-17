import { Navigate, Route, Routes } from 'react-router-dom'; // Importa Navigate para redirecionamento
import TelaHome from './components/TelaHome'; // Importa a tela home
import Login from './components/TelaLogin/Login'; // Importa seu componente de login
import TelaOperador from './components/TelaOperador';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/TelaHome" element={<TelaHome />} />
      <Route path="/TelaOperador" element={<TelaOperador />} />
      
      {/* Rota catch-all para redirecionar para TelaHome se a rota não existir */}
      <Route path="*" element={<Navigate to="/TelaHome" replace />} />
    </Routes>
  );
};

export default AppRoutes;
