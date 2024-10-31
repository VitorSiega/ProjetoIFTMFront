import { Button, Card, Input, Layout, Select, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import './telaSettings.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const TelaSettings = () => {
  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `https://api.airsoftcontrol.com.br/api/user/listar?usuario=${id}`
      );
      if (!response.ok) throw new Error("Erro ao buscar dados do usuário");
      const data = await response.json();
      const role = data.roles?.length > 0 ? data.roles[0].name : "";
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
      const url = `https://api.airsoftcontrol.com.br/api/admin/atualizar/${id}`;
      const userData = {
        ...profile,
        operador: Number(profile.operador),
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar usuário");

      message.success("Usuário atualizado com sucesso!");
      setIsEditing(false);
      fetchProfileData();
    } catch (error) {
      message.error("Erro ao atualizar usuário: " + error.message);
    }
  };

  const toggleEdit = () => {
    if (isEditing) setProfile(originalProfile);
    setIsEditing(!isEditing);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (!profile) {
    return <div>Carregando dados do perfil...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="layout-header">
        <Title level={3} style={{ margin: 0, color: '#ffffff' }}>Configurações</Title>
        
      </Header>

      <Content className="layout-content">
        <Title level={4}>Perfil do Usuário</Title>
        <Text>Gerencie suas informações pessoais</Text>
        <div className="profile-cards">
          {['nome', 'operador', 'email', 'senha', 'cpf', 'dataNascimento', 'telefone', 'telefoneEmergencia', 'tipoSanguineo', 'ocupacao'].map((field, index) => (
            <Card className="card" key={field}>
              <div className="card-title">{field.charAt(0).toUpperCase() + field.slice(1)}:</div>
              {isEditing ? (
                field === 'senha' ? (
                  <Input.Password name={field} onChange={handleChange} />
                ) : field === 'tipoSanguineo' ? (
                  <Select
                    value={profile[field]}
                    onChange={handleSelectChange}
                    style={{ width: "100%" }}
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bloodType => (
                      <Option key={bloodType} value={bloodType}>{bloodType}</Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                  />
                )
              ) : (
                <Text>{field === 'dataNascimento' ? formatDate(profile[field]) : profile[field]}</Text>
              )}
            </Card>
          ))}
        </div>
        <div className="button-group">
          <Button type="primary" onClick={toggleEdit}>
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
          {isEditing && (
            <Button
              type="primary"
              onClick={updateUser}
              className="save-button"
            >
              Salvar
            </Button>
          )}
        </div>
      </Content>

      <Footer className="footer">
        <Text style={{ color: '#333' }}>Configurações ©2024 | Todos os direitos reservados</Text>
      </Footer>
    </Layout>
  );
};

export default TelaSettings;
