import { Button, Layout, Modal, Select, Spin, Table } from 'antd';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendario.css';

const { Header, Content, Footer } = Layout; 
const { Option } = Select;

const TelaPresenca = () => {
  const [date, setDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false); 
  const [loadingDelete, setLoadingDelete] = useState(false); 

  const onDateChange = async (newDate) => {
    setDate(newDate);
    setIsModalVisible(true);
    setDataSource([]);
    
    const formattedDate = newDate.toISOString().split('T')[0];
    const token = localStorage.getItem('token');
    
    setLoading(true);

    try {
      const response = await fetch(`https://api.airsoftcontrol.com.br/api/admin/presenca/listar?buscarPresencaData=${formattedDate}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Nenhum dado encontrado ou dados estão em um formato inesperado.");
        return;
      }

      const mappedData = data.map(item => {
        if (!item.id) {
          console.error("Item sem id:", item);
          return null;
        }
        return {
          key: item.id,
          nome: item.user.nome,
          data: item.data,
          status: item.status
        };
      }).filter(item => item !== null);

      setDataSource(mappedData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    const formattedDate = date.toISOString().split('T')[0]; // Formata a data selecionada
    const token = localStorage.getItem('token');
    setLoadingDelete(true);

    try {
      const response = await fetch(`https://api.airsoftcontrol.com.br/api/admin/presenca/remover?data=${formattedDate}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir registros');
      }

      // Atualize o dataSource para remover os registros da data excluída
      setDataSource(dataSource.filter(item => item.data !== formattedDate));
      alert("Registros excluídos com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir registros:", error);
      alert("Houve um erro ao excluir os registros.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSave = async () => {
    const presencaData = dataSource.map(item => ({
      id: item.key,
      status: item.status,
    }));

    const token = localStorage.getItem('token');

    setLoadingSave(true);

    try {
      const response = await fetch(`https://api.airsoftcontrol.com.br/api/admin/presenca/lancar`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(presencaData),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar presença');
      }

      alert("Dados de presença atualizados com sucesso!");
      handleOk();
    } catch (error) {
      console.error("Erro ao registrar presença:", error);
      alert("Houve um erro ao atualizar os dados.");
    } finally {
      setLoadingSave(false);
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(value, record.key)}
        >
          <Option value="PRESENTE">PRESENTE</Option>
          <Option value="FALTA">FALTA</Option>
        </Select>
      ),
    },
  ];

  const handleStatusChange = (value, key) => {
    const newDataSource = dataSource.map((item) => {
      if (item.key === key) {
        return { ...item, status: value };
      }
      return item;
    });
    setDataSource(newDataSource);
  };

  return (
    <Layout>
      <Header style={{ backgroundColor: '#001529', color: '#fff', textAlign: 'center', padding: '0 50px' }}>
        <h1 style={{ color: '#fff' }}>Presença</h1>
      </Header>

      <Content style={{ padding: "0 20px", margin: "20px 0 20px 0", height: '100%' }}>
        <div className="calendario-container"> 
          <Calendar
            className="custom-calendar"
            onChange={onDateChange}
            value={date}
          />
        </div>
      </Content>

      <Modal 
        title="Data Selecionada"
        open={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[
          <Button 
            key="delete" 
            type="primary" 
            danger 
            onClick={handleDelete} 
            disabled={loadingDelete} 
          >
            {loadingDelete ? <Spin size="small" /> : 'Excluir'}
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave} disabled={loadingSave}>
            {loadingSave ? <Spin size="small" /> : 'SALVAR'}
          </Button>,
        ]}
      >
        <p>Você selecionou a data: {date.toDateString()}</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="Buscando dados..." />
          </div>
        ) : (
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            pagination={false}
          />
        )}
      </Modal>

      <Footer style={{ paddingTop: '35px', textAlign: "center", height: "10vh" }}>
        Ant Design ©2024 Created by You
      </Footer>
    </Layout>
  );
};

export default TelaPresenca;
