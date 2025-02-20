import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(t("invalid_credentials"));
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">{t("admin_login")}</h2>
      {error && <p className="alert alert-danger">{error}</p>}
      <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <Form.Group className="mb-3">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("password")}</Form.Label>
          <Form.Control 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </Form.Group>

        <Button variant="dark" type="submit" className="w-100">
          {t("login")}
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
