import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Container, Form, Button } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

function RegisterMember() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError(t("all_fields_required"));
      return;
    }

    try {
      const membersRef = collection(db, "registrations");

      // Query for email
      const emailQuery = query(membersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      // Query for phone
      const phoneQuery = query(membersRef, where("phone", "==", formData.phone));
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!emailSnapshot.empty || !phoneSnapshot.empty) {
        setError(t("member_already_exists"));
        return;
      }

      // If no duplicate, proceed with registration
      await addDoc(membersRef, formData);

      // ✅ Send confirmation email via EmailJS
      const templateParams = {
        name: formData.name,
        email: formData.email, // Member's email
        message: t("email_confirmation_message", { name: formData.name }),
      };

      await emailjs.send(
        "service_qsmqp31", // 🔹 Replace with your EmailJS Service ID
        "template_ignuqdg", // 🔹 Replace with your EmailJS Template ID
        templateParams,
        "LEBUL4PrsR_E_xCsB" // 🔹 Replace with your EmailJS Public Key
      );

      setSuccess(t("registration_successful"));
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(t("registration_error"));
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">{t("register_member")}</h2>
      <p className="text-center">{t("register_member_instruction")}</p>

      {success && <p className="alert alert-success">{success}</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <Form.Group className="mb-3">
          <Form.Label>{t("name")}</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("email")}</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("phone")}</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("address")}</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("additional_message")}</Form.Label>
          <Form.Control as="textarea" rows={3} name="message" value={formData.message} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">{t("submit")}</Button>
      </Form>
    </Container>
  );
}

export default RegisterMember;
