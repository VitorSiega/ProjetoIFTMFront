import { Button, Layout, Modal, Popconfirm, Select, Spin, Table, message } from "antd";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const TelaPresenca = () => {
  const [date, setDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [dataDates, setDataDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const onDateChange = async (newDate) => {
    setDate(newDate);
    setIsModalVisible(true);
    setDataSource([]);

    const formattedDate = newDate.toISOString().split("T")[0];
    const token = localStorage.getItem("token");

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/presenca/listar?buscarPresencaData=${formattedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.error(
          "Nenhum dado encontrado ou dados estão em um formato inesperado."
        );
        return;
      }

      const mappedData = data
        .map((item) => {
          if (!item.id) {
            console.error("Item sem id:", item);
            return null;
          }
          return {
            key: item.id,
            nome: item.user.nome,
            data: item.data,
            status: item.status,
          };
        })
        .filter((item) => item !== null);

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
    const formattedDate = date.toISOString().split("T")[0];
    const token = localStorage.getItem("token");
    setLoadingDelete(true);

    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/presenca/remover?data=${formattedDate}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir registros");
      }

      message.success("Registros excluidos com sucesso");
      setDataSource(dataSource.filter((item) => item.data !== formattedDate));
      handleCancel();
    } catch (error) {
      console.error("Erro ao excluir registros:", error);
      message.success("Registros excluídos com sucesso!");
      alert("Houve um erro ao excluir os registros.");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleSave = async () => {
    const presencaData = dataSource.map((item) => ({
      id: item.key,
      status: item.status,
    }));

    const token = localStorage.getItem("token");

    setLoadingSave(true);

    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/presenca/lancar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(presencaData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao salvar presença");
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

  const handleViewPresencas = async () => {
    const token = localStorage.getItem("token");
    setIsViewModalVisible(true);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/presenca/listar/datas`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar datas");
      }

      const data = await response.json();

      const mappedData = data.map((item, index) => ({
        key: index,
        data: item, // Apenas a data
      }));

      setDataDates(mappedData);
    } catch (error) {
      console.error("Erro ao buscar datas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Nova função para buscar presenças de uma data específica
  const fetchPresencasByDate = async (selectedDate) => {
    const token = localStorage.getItem("token");
    setDate(new Date(selectedDate)); // Atualiza a data selecionada
    setDataSource([]);
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/presenca/listar?buscarPresencaData=${selectedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        console.error(
          "Nenhum dado encontrado ou dados estão em um formato inesperado."
        );
        return;
      }

      const mappedData = data
        .map((item) => {
          if (!item.id) {
            console.error("Item sem id:", item);
            return null;
          }
          return {
            key: item.id,
            nome: item.user.nome,
            data: item.data,
            status: item.status,
          };
        })
        .filter((item) => item !== null);

      setDataSource(mappedData);
      setIsModalVisible(true); // Abre o modal com a tabela
      setIsViewModalVisible(false);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
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
      width: 125,
      render: (text) => {
        const [year, month, day] = text.split("-");
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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

  const dateColumns = [
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (text) => {
        const [year, month, day] = text.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        return (
          <Button type="link" onClick={() => fetchPresencasByDate(text)}>
            {formattedDate}
          </Button>
        );
      },
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
      <Header
        style={{
          backgroundColor: "#001529",
          color: "#fff",
          textAlign: "center",
          padding: "0 50px",
        }}
      >
        <h1 style={{ color: "#fff" }}>Presença</h1>
      </Header>

      <Content
        style={{ padding: "0 20px", margin: "20px 0 20px 0", height: "200%" }}
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
              onClick={handleViewPresencas}
              loading={loading}
            >
              Presenças
            </Button>
          </div>
          <Modal
            title="Registro de Presença"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Voltar
              </Button>,
              <Popconfirm
                title="Tem certeza que deseja excluir todos os registros?"
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
            {loading ? (
              <Spin />
            ) : (
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={loading}
              />
            )}
          </Modal>

          <Modal
            title="Presenças Registradas"
            open={isViewModalVisible}
            onOk={() => setIsViewModalVisible(false)}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="back" onClick={() => setIsViewModalVisible(false)}>
                Fechar
              </Button>,
            ]}
          >
            {loading ? (
              <Spin />
            ) : (
              <Table
                columns={dateColumns}
                dataSource={dataDates}
                pagination={false}
                loading={loading}
              />
            )}
          </Modal>
        </div>
      </Content>

      <Footer style={{ textAlign: "center", height: "10vh" }}>
        Gestão usuários ©2024
      </Footer>
    </Layout>
  );
};

export default TelaPresenca;
