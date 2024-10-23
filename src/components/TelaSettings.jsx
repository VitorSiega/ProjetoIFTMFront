import { Button, Card, Input, Layout, Select, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask"; // Certifique-se de importar InputMask

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const TelaSettings = () => {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editingUser = profile;
  const token = localStorage.getItem("token");
  // Função para buscar os dados do perfil
  const fetchProfileData = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/user/listar?email=${email}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário");
      }
      const data = await response.json();
      const role =
        data.roles && data.roles.length > 0 ? data.roles[0].name : "";
      const profileData = { ...data, role };
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSelectChange = (value) => {
    setProfile({ ...profile, tipoSanguineo: value });
  };

  const updateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `https://api.airsoftcontrol.com.br/api/admin/atualizar/${editingUser.id}`;

      const userData = {
        ...editingUser,
        operador: Number(editingUser.operador),
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Verifique se o token expirou ou se há outro erro
        if (response.status === 401) {
          message.error("Sessão expirada. Por favor, faça login novamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          // Redirecionar para a página de login
          window.location.href = "/login"; // Atualize a URL conforme necessário
          return;
        }
        const result = await response.text();
        throw new Error(result || "Erro ao atualizar usuário.");
      }

      localStorage.setItem("email", editingUser.email);
      message.success("Usuário atualizado com sucesso!");

      setIsEditing(false);
      fetchProfileData(); // Atualiza os dados do perfil
    } catch (error) {
      message.error("Erro ao atualizar usuário: " + error.message);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setProfile(originalProfile);
    }
    setIsEditing(!isEditing);
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR"); // Formato DD/MM/AAAA
  };

  if (!profile) {
    return <div>Carregando dados do perfil...</div>;
  }

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
        <h1 style={{ color: "#fff" }}>Configurações</h1>
      </Header>

      <Content
        style={{ padding: "0 20px", margin: "20px 0 20px 0", height: "200%" }}
      >
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            height: "100%",
          }}
        >
          <Title level={4}>Perfil do Usuário</Title>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Nome:</Text>
            {isEditing ? (
              <Input name="nome" value={profile.nome} onChange={handleChange} />
            ) : (
              <Text>{profile.nome}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Email:</Text>
            {isEditing ? (
              <Input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            ) : (
              <Text>{profile.email}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Senha:</Text>
            {isEditing ? (
              <Input.Password name="senha" onChange={handleChange} />
            ) : (
              <Text></Text> // Exibir asteriscos quando não estiver em edição
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>CPF:</Text> <Text>{profile.cpf}</Text>
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Data de Nascimento:</Text>
            {isEditing ? (
              <Input
                type="date"
                name="dataNascimento"
                value={profile.dataNascimento}
                onChange={handleChange}
              />
            ) : (
              <Text>{formatDate(profile.dataNascimento)}</Text> // Formata a data aqui
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Telefone:</Text>
            {isEditing ? (
              <InputMask
                mask="(99)99999-9999"
                maskChar={null}
                name="telefone"
                value={profile.telefone}
                onChange={handleChange}
              >
                {(inputProps) => <Input {...inputProps} />}
              </InputMask>
            ) : (
              <Text>{profile.telefone}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Telefone Emergência:</Text>
            {isEditing ? (
              <InputMask
                mask="(99)99999-9999"
                maskChar={null}
                name="telefoneEmergencia"
                value={profile.telefoneEmergencia}
                onChange={handleChange}
              >
                {(inputProps) => <Input {...inputProps} />}
              </InputMask>
            ) : (
              <Text>{profile.telefoneEmergencia}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Tipo Sanguíneo:</Text>
            {isEditing ? (
              <Select
                value={profile.tipoSanguineo}
                onChange={handleSelectChange}
                style={{ width: "100%" }}
              >
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
              </Select>
            ) : (
              <Text>{profile.tipoSanguineo}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Ocupação:</Text>
            {isEditing ? (
              <Input
                name="ocupacao"
                value={profile.ocupacao}
                onChange={handleChange}
              />
            ) : (
              <Text>{profile.ocupacao}</Text>
            )}
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Status do Operador:</Text>{" "}
            <Text>{profile.statusOperador}</Text>
          </Card>
          <Card style={{ marginBottom: "20px" }}>
            <Text strong>Role:</Text> <Text>{profile.role}</Text>
          </Card>

          <Button type="primary" onClick={toggleEdit}>
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              type="primary"
              onClick={updateUser}
              style={{ marginLeft: "10px" }}
            >
              Salvar
            </Button>
          )}
        </div>
      </Content>

      <Footer
        style={{ paddingTop: "35px", textAlign: "center", height: "15vh" }}
      >
        Configurações ©2024
      </Footer>
    </Layout>
  );
};

export default TelaSettings;
