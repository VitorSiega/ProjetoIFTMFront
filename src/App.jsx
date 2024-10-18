import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import AppRoutes from './Routes';

const { Header, Sider, Content } = Layout;

async function validateToken(token) {
  // Faça uma chamada para a API para validar o token
  const response = await fetch('/api/token/verify', {
    method: 'GET', // Use GET para verificar o token
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // A resposta estará ok se o token for válido
  return response.ok; 
}

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para monitorar a localização

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      const isValid = await validateToken(token);
      if (!isValid) {
        localStorage.removeItem('token'); // Remove token inválido
        navigate('/login');
      }
    } else {
      navigate('/login'); // Navega para login se o token estiver vazio
    }
  };

  useEffect(() => {
    checkAuthentication(); // Verifica a autenticação ao carregar o componente

    const interval = setInterval(checkAuthentication, 10000); // Verifica a cada 10 segundos
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [navigate, location]);

  // Verifica o tamanho da tela ao carregar a página
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Deseja sair?',
      content: 'Tem certeza de que deseja deslogar?',
      onOk: () => {
        localStorage.removeItem('token');
        navigate('/login'); // Redireciona para a página de login após logout
      },
    });
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100%' }}>
      {localStorage.getItem('token') ? ( // Verifica se o usuário está autenticado
        <>
          <Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            theme={darkTheme ? 'dark' : 'light'}
            className='sidebar'
            style={{
              overflowY: isSmallScreen ? 'auto' : 'hidden',
              maxHeight: '100vh',
            }}
          >
            <Logo />
            <MenuList darkTheme={darkTheme} onLogout={handleLogout} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
              <div>
                <Button
                  type="text"
                  className="toggle"
                  onClick={() => setCollapsed(!collapsed)}
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                />
              </div>
              <Button type="primary" onClick={handleLogout} style={{ marginRight: '16px' }}>
                Logout
              </Button>
            </Header>
            <Content style={{ margin: '16px', overflow: 'auto', height: '100vh' }}>
              <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                <AppRoutes />
              </div>
            </Content>
          </Layout>
        </>
      ) : (
        <Layout style={{ padding: 0 }}>
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <AppRoutes />
          </Content>
        </Layout>
      )}
    </Layout>
  );
}

export default App;
