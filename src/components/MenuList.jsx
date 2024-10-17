import { AppstoreOutlined, AreaChartOutlined, BarsOutlined, HomeOutlined, PayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MenuList = ({ darkTheme }) => {
    const navigate = useNavigate();

    // Função para verificar se o usuário está autenticado
    const isAuthenticated = () => {
        const token = localStorage.getItem('token'); // Verifique o token no localStorage
        return !!token; // Retorna true se o token existir
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login'); // Redireciona para a tela de login se não estiver autenticado
        }
    }, [navigate]);

    const items = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/TelaHome">Home</Link>,
        },
        {
            key: '/operador',
            icon: <AppstoreOutlined />,
            label: <Link to="/TelaOperador">Operador</Link>,

        },
        {
            key: 'subtasks',
            icon: <BarsOutlined />,
            label: 'Tasks',
            children: [
                { key: 'task-1', label: 'Task 1' },
                { key: 'task-2', label: 'Task 2' },
                {
                    key: 'subtask',
                    label: 'Subtasks',
                    children: [
                        { key: 'subtask1', label: 'Subtask 1' },
                        { key: 'subtask2', label: 'Subtask 2' },
                    ],
                },
            ],
        },
        {
            key: 'progress',
            icon: <AreaChartOutlined />,
            label: 'Progress',
        },
        {
            key: 'payment',
            icon: <PayCircleOutlined />,
            label: 'Payment',
        },
        {
            key: 'setting',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
    ];

    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar" items={items} />
    );
};

export default MenuList;
