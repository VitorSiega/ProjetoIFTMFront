import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Layout, message, Row, Select, Table, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const TelaFinanceiro = () => {
  const [date, setDate] = useState(new Date());
  const [transactionData, setTransactionData] = useState([]);
  const token = localStorage.getItem('token'); // Obtém o token armazenado

  // Função para mudar o mês
  const changeMonth = (increment) => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + increment);
    setDate(newDate);
  };

  // Função para resetar para o mês atual
  const goToCurrentMonth = () => {
    setDate(new Date());
  };

  // Função para formatar o mês e o ano
  const getFormattedMonthYear = () => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Função para buscar dados do servidor
  const fetchTransactionData = async () => {
    const formattedDate = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`https://api.airsoftcontrol.com.br/api/admin/financeiro/listar?buscarPresencaData=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const data = await response.json();

      // Extrair e formatar os dados recebidos
      const formattedData = data.map((item) => ({
        key: item.id,
        nome: item.user.nome,
        diaPago: item.diaPago ? moment(item.diaPago) : null, // Converte diaPago para momento
        valorPago: item.valorPago || 15.00,
        status: item.status || "NÃO PAGO",
      }));

      setTransactionData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
    }
  };

  // Atualiza os dados ao mudar o mês
  useEffect(() => {
    fetchTransactionData();
  }, [date]);

  // Função para alterar o valor da transação
  const handleAmountChange = (key, newAmount) => {
    setTransactionData((prevData) =>
      prevData.map((transaction) =>
        transaction.key === key ? { ...transaction, valorPago: parseFloat(newAmount) } : transaction
      )
    );
  };

  // Função para alterar o dia do pagamento
  const handleDayChange = (key, newDay) => {
    setTransactionData((prevData) =>
      prevData.map((transaction) =>
        transaction.key === key ? { ...transaction, diaPago: newDay } : transaction
      )
    );
  };

  // Função para alterar o status da transação
  const handleStatusChange = (key, newStatus) => {
    setTransactionData((prevData) =>
      prevData.map((transaction) =>
        transaction.key === key ? { ...transaction, status: newStatus } : transaction
      )
    );
  };

  // Função para enviar dados atualizados ao servidor
  const updateTransactionData = async () => {
    const dataToUpdate = transactionData.map(({ key, valorPago, diaPago, status }) => ({
      id: key,
      valorPago,
      dia_pago: diaPago ? diaPago.format('YYYY-MM-DD') : null, // Converte o diaPago para string no formato esperado
      status,
    }));

    try {
      const response = await fetch(`https://api.airsoftcontrol.com.br/api/admin/financeiro/atualizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToUpdate),
      });

      if (!response.ok) throw new Error('Erro ao atualizar dados');
      message.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      message.error('Erro ao atualizar dados.');
    }
  };

  // Definindo as colunas da tabela
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      width: '30%',
    },
    {
      title: 'Dia Pago',
      dataIndex: 'diaPago',
      key: 'diaPago',
      width: '10%',
      render: (text, record) => (
        <DatePicker
          value={record.diaPago}
          format="DD-MM-YYYY"
          onChange={(date) => handleDayChange(record.key, date)}
          style={{ width: '100%', minWidth: '120px'}}
        />
      ),
    },
    {
      title: 'Valor Pago',
      dataIndex: 'valorPago',
      key: 'valorPago',
      width: '20%',
      render: (text, record) => (
        <Input
          type="number"
          value={record.valorPago}
          onChange={(e) => handleAmountChange(record.key, e.target.value)}
          prefix="R$"
          style={{ width: '100%', minWidth: '100px' }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (text, record) => (
        <Select
          value={record.status}
          style={{ width: '100%' }}
          onChange={(value) => handleStatusChange(record.key, value)}
        >
          <Option value="NÃO PAGO">Não Pago</Option>
          <Option value="PAGO">Pago</Option>
        </Select>
      ),
    },
  ];

  return (
    <Layout>
      <Header style={{ backgroundColor: '#001529', color: '#fff', textAlign: 'center', padding: '0 50px' }}>
        <h1 style={{ color: '#fff' }}>Financeiro</h1>
      </Header>

      <Content style={{ padding: '20px', margin: '20px 0' }}>
  <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
    <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
      <Col>
        <Button icon={<LeftOutlined />} onClick={() => changeMonth(-1)}>Anterior</Button>
      </Col>
      <Col>
        <Typography.Title level={4}>{getFormattedMonthYear()}</Typography.Title>
      </Col>
      <Col>
        <Button icon={<RightOutlined />} onClick={() => changeMonth(1)}>Próximo</Button>
      </Col>
    </Row>

    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Button type="primary" onClick={goToCurrentMonth}>Mês Atual</Button>
    </div>

    <div style={{ overflowX: 'auto' }}> {/* Contêiner de rolagem horizontal */}
      <Table
        columns={columns}
        dataSource={transactionData}
        pagination={false}
        style={{ width: "100%" }}
        summary={(pageData) => {
          let total = 0;
          pageData.forEach(({ valorPago, status }) => {
            if (status === 'PAGO') {
              total += valorPago;
            }
          });
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2}>Total Pago</Table.Summary.Cell>
              <Table.Summary.Cell>{total.toFixed(2)} R$</Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          );
        }}
      />
    </div>

    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <Button type="primary" onClick={updateTransactionData}>Salvar Alterações</Button>
    </div>
  </div>
</Content>



      <Footer style={{ paddingTop: '35px', textAlign: 'center' }}>
        Ant Design ©2024 Created by You
      </Footer>
    </Layout>
  );
};

export default TelaFinanceiro;
