import { Layout } from 'antd';
import React from 'react';

const { Header, Content, Footer } = Layout; // Destructure the Layout components

const TelaGames = () => {
  return (
    <Layout>
      {/* Header Section */}
      <Header style={{ backgroundColor: '#001529', color: '#fff', textAlign: 'center', padding: '0 50px' }}>
        <h1 style={{ color: '#fff' }}>Header</h1>
      </Header>

      {/* Content Section */}
      <Content style={{ padding: "0 20px", margin: "20px 0 20px 0", height:'200%'}}>
        <div style={{ background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%", }}>
          <h1>Tela Home</h1>
          <p>Tela Home.</p>
          <p>Teste</p>
        </div>
      </Content>

      {/* Footer Section */}
      <Footer style={{ paddingTop:'35px',textAlign: "center", height: "15vh"}}>
        Ant Design ©2024 Created by You
      </Footer>
    </Layout>
  );
};

export default TelaGames;
