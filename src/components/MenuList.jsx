import { AppstoreOutlined, AreaChartOutlined, HomeOutlined, PayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MenuList = ({ darkTheme }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redireciona se não houver token
        } else {
            setLoading(false); // Se o token existir, não exibe mais o carregamento
        }
    }, [navigate]);

    // Itens do menu
    const items = [
        { key: 'home', icon: <HomeOutlined />, label: <Link to="/TelaHome">Home</Link> },
        { key: 'operador', icon: <AppstoreOutlined />, label: <Link to="/TelaOperador">Operador</Link> },
        { key: 'presenca', icon: <AreaChartOutlined />, label: <Link to="/TelaPresenca">Presença</Link> },
        { key: 'financeiro', icon: <PayCircleOutlined />, label: <Link to="/TelaFinanceiro">Financeiro</Link> },
        { key: 'games', icon: <PayCircleOutlined />, label: <Link to="/TelaGames">Games</Link> },
        { key: 'setting', icon: <SettingOutlined />, label: <Link to="/TelaSettings">Perfil</Link> },
    ];

    if (loading) {
        return <div>Loading...</div>; // Exibe um carregamento enquanto verifica o token
    }

    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar" items={items} />
    );
};

export default MenuList;
