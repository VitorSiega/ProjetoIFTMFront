import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Modal, theme } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import AppRoutes from './Routes';

const { Header, Sider, Content } = Layout;

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Para detectar telas menores que 1200px
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Verifica o tamanho da tela ao carregar a página
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    // Define o estado inicial
    handleResize();

    // Adiciona o evento para monitorar o redimensionamento
    window.addEventListener('resize', handleResize);

    // Limpa o evento ao desmontar o componente
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
        navigate('/login');
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
      {isAuthenticated() ? (
        <>
          <Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            theme={darkTheme ? 'dark' : 'light'}
            className='sidebar'
            style={{
              overflowY: isSmallScreen ? 'auto' : 'hidden', // Adiciona rolagem apenas em telas menores
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
          <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <AppRoutes />
          </Content>
        </Layout>
      )}
    </Layout>
  );
}

export default App;
