import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Container, Form, Button } from "react-bootstrap";
import emailjs from "@emailjs/browser";

function RegisterMember() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Save data to Firestore
      await addDoc(collection(db, "registrations"), formData);

      await emailjs.send(
        "service_qsmqp31", // Replace with your EmailJS Service ID
        "template_ignuqdg", // Replace with your EmailJS Template ID
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          message: formData.message,
        },
        "LEBUL4PrsR_E_xCsB" // Replace with your EmailJS Public Key
      );

      setSuccess(true);
      setError("");
      alert("Registration successful! Confirmation email sent.");
      
      // Reset the form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });

    } catch (error) {
      console.error("Error:", error);
      setError("Error submitting form. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Become a Member</h2>
      <p className="text-center">Fill out the form below, and we will contact you!</p>

      {success && <p className="alert alert-success">Your request has been submitted!</p>}
      {error && <p className="alert alert-danger">{error}</p>}

      <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Additional Message (Optional)</Form.Label>
          <Form.Control as="textarea" rows={3} name="message" value={formData.message} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default RegisterMember;
