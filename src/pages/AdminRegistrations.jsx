import { db } from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";


const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Fetch pending registrations
    const fetchRegistrations = async () => {
      const querySnapshot = await getDocs(collection(db, "registrations"));
      setRegistrations(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchRegistrations();
  }, []);

  const approveMember = async (registration) => {
    try {
      // Move to "members" collection
      await addDoc(collection(db, "members"), {
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        address: registration.address,
        timestamp: new Date(),
      });

      // Remove from "registrations"
      await deleteDoc(doc(db, "registrations", registration.id));
      setRegistrations(registrations.filter((r) => r.id !== registration.id));

      alert(`${registration.name} has been approved as a member!`);
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const rejectMember = async (id) => {
    try {
      await deleteDoc(doc(db, "registrations", id));
      setRegistrations(registrations.filter((r) => r.id !== id));
      alert("Registration request rejected.");
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Pending Registrations</h2>
      <Row className="justify-content-center">
        {registrations.map((reg) => (
          <Col md={6} key={reg.id}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{reg.name}</Card.Title>
                <Card.Text><strong>Email:</strong> {reg.email}</Card.Text>
                <Card.Text><strong>Phone:</strong> {reg.phone}</Card.Text>
                <Card.Text><strong>Address:</strong> {reg.address}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="success" onClick={() => approveMember(reg)}>Approve</Button>
                  <Button variant="danger" onClick={() => rejectMember(reg.id)}>Reject</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="secondary" className="w-100 mt-3" href="/admin">Back to Admin Panel</Button>
    </Container>
  );
  
};

export default AdminRegistrations;
