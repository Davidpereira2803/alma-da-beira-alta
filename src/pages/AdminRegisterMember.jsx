import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Container, Form, Button } from "react-bootstrap";

function AdminRegisterMember() {
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
      setError("All fields are required!");
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
        setError("A member with this email or phone number already exists!");
        return;
      }
  
      await addDoc(membersRef, formData);

      setSuccess("Registration successful! A confirmation email has been sent.");
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Error submitting form. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Register a Member</h2>
      <p className="text-center">Fill out the form below!</p>

      {success && <p className="alert alert-success">Successfully Registered!</p>}
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
      <Button variant="secondary" className="w-100 mt-3" href="/admin/registrations">Back to Registration Panel</Button>
    </Container>
  );
}

export default AdminRegisterMember;
