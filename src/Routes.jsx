import { Navigate, Route, Routes } from 'react-router-dom'; // Importa Navigate para redirecionamento
import TelaFinanceiro from './components/TelaFinanceiro';
import TelaGames from './components/TelaGames';
import TelaHome from './components/TelaHome'; // Importa a tela home
import Login from './components/TelaLogin/Login'; // Importa seu componente de login
import TelaOperador from './components/TelaOperador';
import TelaPresenca from './components/TelaPresenca';
import TelaSettings from './components/TelaSettings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/TelaHome" element={<TelaHome />} />
      <Route path="/TelaOperador" element={<TelaOperador />} />
      <Route path="/TelaPresenca" element={<TelaPresenca />} />
      <Route path="/TelaFinanceiro" element={<TelaFinanceiro />} />
      <Route path="/TelaSettings" element={<TelaSettings />} />
      <Route path="/TelaGames" element={<TelaGames />} />
      {/* Rota catch-all para redirecionar para TelaHome se a rota não existir */}
      <Route path="*" element={<Navigate to="/TelaHome" replace />} />
    </Routes>
  );
};

export default AppRoutes;
