import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Layout, message, Modal, Popconfirm, Select, Space, Table, } from "antd";
import React, { useEffect, useState } from "react";
const TelaOperador = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm(); // Adicionei aqui para o formulário
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [buttonLabel, setButtonLabel] = useState("Cadastrar Usuário");
  const { Header, Content, Footer } = Layout;
  const { Option } = Select;

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1200) {
      setButtonLabel("");
    } else {
      setButtonLabel("Cadastrar Usuário");
    }
  }, [windowWidth]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setTelefone(value); // Atualiza o estado com o valor do campo
  };

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://api.airsoftcontrol.com.br/api/admin/listar",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Corrigido para usar crase
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários.");
      }

      const data = await response.json();
      setDataSource(
        data.map((user) => ({
          ...user,
          key: user.id,
          role: user.roles.length > 0 ? user.roles[0].name : "",
        }))
      );
    } catch (error) {
      message.error("Usuário não autenticado!");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue(editingUser);
    }
  }, [editingUser, isEditing, form]);

  const createUser = () => {
    setEditingUser({
      id: "",
      email: "",
      senha: "",
      operador: "",
      nome: "",
      cpf: "",
      dataNascimento: "",
      telefone: "",
      telefoneEmergencia: "",
      tipoSanguineo: "",
      ocupacao: "",
      statusOperador: "ATIVO",
      role: "RECRUTA",
    });
    setIsEditing(true);
  };

  const saveUser = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const method = editingUser.id ? "PUT" : "POST";
      const url = editingUser.id
        ? `https://api.airsoftcontrol.com.br/api/admin/atualizar/${editingUser.id}`
        : "https://api.airsoftcontrol.com.br/api/admin/cadastro";

      const userData = {
        ...values,
        operador: Number(values.operador),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.text(); // Pode ser .json() se a API retornar JSON

      if (!response.ok) {
        throw new Error(result || "Erro ao salvar usuário.");
      }

      message.success(
        editingUser.id
          ? "Usuário atualizado com sucesso!"
          : "Usuário criado com sucesso!"
      );
      setIsEditing(false);
      fetchUsuarios();
    } catch (error) {
      message.error("Usuário não autenticado");
    }
  };

  const editUser = (record) => {
    setEditingUser({ ...record, senha: "" }); // Cria uma nova referência para garantir a atualização correta do estado
    setIsEditing(true);
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/admin/remover/${id}`,
        {
          // Corrigido para usar crase
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Corrigido para usar crase
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir usuário.");
      }

      message.success("Usuário excluído com sucesso!");
      fetchUsuarios();
    } catch (error) {
      console.error(error);
      message.error("Erro ao excluir usuário.");
    }
  };

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = dataSource.filter((user) =>
    user.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Ações",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editUser(record)}>
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => deleteUser(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger>Excluir</Button>
          </Popconfirm>
        </Space>
      ),
      //fixed: "left",
      width: 200,
    },
    {
      title: "Status",
      dataIndex: "statusOperador",
      key: "statusOperador",
      sorter: (a, b) => a.statusOperador.localeCompare(b.statusOperador),
      width: 110,
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      width: 150,
    },
    {
      title: "Operador",
      dataIndex: "operador",
      key: "operador",
      sorter: (a, b) => a.operador - b.operador,
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      responsive: ["md"],
      width: 320,
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
      sorter: (a, b) => a.cpf.localeCompare(b.cpf),
      responsive: ["md"],
      width: 150,
    },
    {
      title: "Data de Nascimento",
      dataIndex: "dataNascimento",
      key: "dataNascimento",
      sorter: (a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento),
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
      responsive: ["md"],
      width: 120,
    },
    {
      title: "Telefone",
      dataIndex: "telefone",
      key: "telefone",
      responsive: ["md"],
      width: 160,
    },
    {
      title: "Telefone Emergência",
      dataIndex: "telefoneEmergencia",
      key: "telefoneEmergencia",
      responsive: ["md"],
      width: 160,
    },
    {
      title: "Tipo Sanguíneo",
      dataIndex: "tipoSanguineo",
      key: "tipoSanguineo",
      responsive: ["md"],
      width: 110,
    },
    {
      title: "Ocupação",
      dataIndex: "ocupacao",
      key: "ocupacao",
      sorter: (a, b) => a.ocupacao.localeCompare(b.ocupacao),
      responsive: ["md"],
      width: 150,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      width: 150,
    },
  ];

  return(
    <Layout style={{ margin: "20px 0 20px 0", height:"90%"}}>
      <Header
        style={{
          backgroundColor: "#001529",
          color: "#fff",
          textAlign: "center",
          padding: "0 50px",
        }}
      >
        <h1 style={{ color: "#fff" }}>Operador</h1>
      </Header>
      <Content
        style={{ padding: "0 20px", margin: "20px 0 20px 0",height:"90%"}}
      >
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px 8px 0 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%",
          }}
        >
          <h1 style={{ fontSize: "1.5em" }}>Operador</h1>
          <p>Esta é a tela de operador.</p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Input
                placeholder="Pesquisar por nome"
                value={searchText}
                onChange={onSearchChange}
                style={{ flex: 1, maxWidth: "300px", marginRight: "16px" }} // Altera a largura para se ajustar ao espaço
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createUser}
                className="button-custom"
              >
                {buttonLabel} {/* Texto do botão atualizado */}
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              scroll={{ x: false, y: "100%" }} // Permite que a tabela se ajuste à largura da tela
              pagination={{ pageSize: 10 }}
              style={{ width: "100%", overflow: "auto" }} // Garante que a tabela ocupe 100% da largura do contêiner
            />
          </div>
        </div>

        <Footer style={{ textAlign: "center",borderRadius: "0 0 8px 8px"}}>
          Gestão usuários ©2024
        </Footer>
      </Content>

      <Modal
        title={editingUser?.id ? "Editar Usuário" : "Cadastrar Usuário"}
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form
          form={form} // Adicione esta linha
          initialValues={editingUser}
          onFinish={saveUser}
          layout="vertical"
        >
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Por favor insira o nome!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Por favor insira o email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Senha" name="senha">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Operador" name="operador">
            <Input type="number" />
          </Form.Item>

          {/* <Form.Item
            label="CPF"
            name="cpf"
            rules={[{ required: true, message: "Por favor, insira o CPF" }]}
          >
            <InputMask mask="999.999.999-99">
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>

          <Form.Item label="Data de Nascimento" name="dataNascimento">
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Telefone" name="telefone">
            <InputMask mask="(99)99999-9999" maskChar={null}>
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
          <Form.Item label="Telefone Emergência" name="telefoneEmergencia">
            <InputMask mask="(99)99999-9999" maskChar={null}>
              {(inputProps) => <Input {...inputProps} />}
            </InputMask>
          </Form.Item>
           */}

<Form.Item
  label="CPF"
  name="cpf"
  rules={[
    { required: true, message: "Por favor, insira o CPF" },
    {
      validator: (_, value) =>
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)
          ? Promise.resolve()
          : Promise.reject(new Error("CPF inválido")),
    },
  ]}
>
  <Input />
</Form.Item>

<Form.Item label="Data de Nascimento" name="dataNascimento">
  <Input type="date" />
</Form.Item>

<Form.Item
  label="Telefone"
  name="telefone"
  rules={[
    { required: true, message: "Por favor, insira o número de telefone" },
    {
      validator: (_, value) =>
        /^\(\d{2}\)\d{5}-\d{4}$/.test(value)
          ? Promise.resolve()
          : Promise.reject(new Error("Telefone inválido, use o formato (99)99999-9999")),
    },
  ]}
>
  <Input />
</Form.Item>

<Form.Item
  label="Telefone Emergência"
  name="telefoneEmergencia"
  rules={[
    { required: true, message: "Por favor, insira o número de emergência" },
    {
      validator: (_, value) =>
        /^\(\d{2}\)\d{5}-\d{4}$/.test(value)
          ? Promise.resolve()
          : Promise.reject(new Error("Telefone inválido, use o formato (99)99999-9999")),
    },
  ]}
>
  <Input />
</Form.Item>
          <Form.Item label="Tipo Sanguíneo" name="tipo Sanguineo">
            <Select>
              <Option value="A+">A+</Option>
              <Option value="A-">A-</Option>
              <Option value="B+">B+</Option>
              <Option value="B-">B-</Option>
              <Option value="AB+">AB+</Option>
              <Option value="AB-">AB-</Option>
              <Option value="O+">O+</Option>
              <Option value="O-">O-</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ocupação" name="ocupacao">
            <Input />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              { required: true, message: "Por favor selecione um role!" },
            ]}
          >
            <Select>
              <Option value="RECRUTA">RECRUTA</Option>
              <Option value="OPERADOR">OPERADOR</Option>
              <Option value="ADMINISTRADOR">ADMINISTRADOR</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="statusOperador"
            rules={[
              { required: true, message: "Por favor selecione o papel!" },
            ]}
          >
            <Select>
              <Option value="ATIVO">ATIVO</Option>
              <Option value="INATIVO">INATIVO</Option>
              <Option value="DESLIGADO">DESLIGADO</Option>
              <Option value="NÃO ATENDE">NÃO ATENDE</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser?.id ? "Atualizar" : "Cadastrar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default TelaOperador;
