import { Button, Layout, Modal, Popconfirm, Select, Spin, Table, message } from "antd";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./telaGames.css";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const TelaJogos = () => {
  const [date, setDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  
  // Estado para o jogo atual
  const [currentGame, setCurrentGame] = useState({
    nome: "",
    data: "",
    descricao: "",
    local: "",
    situacao: "NÃO REALIZADA",
    responsaveis: [],
  });

  const onDateChange = (newDate) => {
    setDate(newDate);
    setCurrentGame({ ...currentGame, data: newDate.toISOString().split("T")[0] });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    // Aqui você deve implementar a lógica para salvar os dados do jogo
    setLoadingSave(true);

    // Simulação de salvamento
    setTimeout(() => {
      message.success("Jogo salvo com sucesso!");
      setDataSource([...dataSource, { ...currentGame, key: Date.now() }]); // Adiciona o jogo à lista
      setCurrentGame({ nome: "", data: "", descricao: "", local: "", situacao: "NÃO REALIZADA", responsaveis: [] });
      handleOk();
      setLoadingSave(false);
    }, 1000);
  };

  const handleDelete = async () => {
    // Aqui você deve implementar a lógica para excluir o jogo
    setLoadingDelete(true);

    // Simulação de exclusão
    setTimeout(() => {
      message.success("Jogo excluído com sucesso!");
      setDataSource(dataSource.filter(game => game.data !== currentGame.data)); // Filtra o jogo
      handleCancel();
      setLoadingDelete(false);
    }, 1000);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Descrição",
      dataIndex: "descricao",
      key: "descricao",
    },
    {
      title: "Local",
      dataIndex: "local",
      key: "local",
    },
    {
      title: "Situação",
      dataIndex: "situacao",
      key: "situacao",
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "#001529",
          color: "#fff",
          textAlign: "center",
          padding: "0 50px",
        }}
      >
        <h1 style={{ color: "#fff" }}>Gerenciamento de Jogos</h1>
      </Header>

      <Content
        style={{ padding: "0 20px", margin: "20px 0", height: "200%" }}
      >
        <div className="calendario-container">
          <Calendar
            className="custom-calendar"
            onChange={onDateChange}
            value={date}
          />
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
            >
              Adicionar Jogo
            </Button>
          </div>
          <Modal
            title="Cadastro de Jogo"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Voltar
              </Button>,
              <Popconfirm
                title="Tem certeza que deseja excluir este jogo?"
                onConfirm={handleDelete}
                okText="Sim"
                cancelText="Não"
              >
                <Button key="delete" danger loading={loadingDelete}>
                  Excluir
                </Button>
              </Popconfirm>,
              <Button
                key="submit"
                type="primary"
                loading={loadingSave}
                onClick={handleSave}
              >
                Salvar
              </Button>,
            ]}
          >
            <div>
              <label>Nome do Jogo:</label>
              <input 
                type="text" 
                value={currentGame.nome} 
                onChange={(e) => setCurrentGame({ ...currentGame, nome: e.target.value })} 
              />
              <label>Data do Jogo:</label>
              <input 
                type="text" 
                value={currentGame.data} 
                readOnly 
              />
              <label>Descrição do Jogo:</label>
              <input 
                type="text" 
                value={currentGame.descricao} 
                onChange={(e) => setCurrentGame({ ...currentGame, descricao: e.target.value })} 
              />
              <label>Local:</label>
              <input 
                type="text" 
                value={currentGame.local} 
                onChange={(e) => setCurrentGame({ ...currentGame, local: e.target.value })} 
              />
              <label>Situação:</label>
              <Select
                value={currentGame.situacao}
                onChange={(value) => setCurrentGame({ ...currentGame, situacao: value })}
              >
                <Option value="REALIZADA">REALIZADA</Option>
                <Option value="NÃO REALIZADA">NÃO REALIZADA</Option>
              </Select>
            </div>
          </Modal>
          
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </div>
      </Content>

      <Footer style={{ textAlign: "center", height: "10vh" }}>
        Gestão de Jogos ©2024
      </Footer>
    </Layout>
  );
};

export default TelaJogos;
