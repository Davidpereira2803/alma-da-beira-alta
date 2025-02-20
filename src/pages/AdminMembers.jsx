import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, "members"));
      const memberList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(memberList);
    };

    fetchMembers();
  }, []);

  // Delete Member Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      await deleteDoc(doc(db, "members", id));
      setMembers(members.filter(member => member.id !== id)); // Remove from UI
    }
  };

  // Mark as Processed Function
  const handleMarkProcessed = async (id) => {
    const memberRef = doc(db, "members", id);
    await updateDoc(memberRef, { processed: true });

    setMembers(members.map(member =>
      member.id === id ? { ...member, processed: true } : member
    ));
  };

  // Open Edit Modal
  const handleEdit = (member) => {
    setSelectedMember(member);
    setUpdatedData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address
    });
    setShowEditModal(true);
  };

  // Save Edited Member
  const handleSaveEdit = async () => {
    if (!selectedMember) return;

    const memberRef = doc(db, "members", selectedMember.id);
    await updateDoc(memberRef, updatedData);

    // Update UI
    setMembers(members.map(member => 
      member.id === selectedMember.id ? { ...member, ...updatedData } : member
    ));

    setShowEditModal(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Registered Members</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Membership</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className={member.processed ? "table-success" : ""}>
              <td>{member.membershipNumber}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.address}</td>
              <td>{member.message}</td>
              <td>{member.processed ? "✅ Paid" : "❌ Payment Pending"}</td>
              <td>
                {!member.processed && (
                  <Button variant="success" size="sm" onClick={() => handleMarkProcessed(member.id)}>
                    Mark as Paid
                  </Button>
                )}
                <Button variant="warning" size="sm" className="ms-2" onClick={() => handleEdit(member)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(member.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Footer Row: Display Total Members */}
        <tfoot>
          <tr>
            <td colSpan="7"><strong>Total Members:</strong></td>
            <td><strong>{members.length}</strong></td>
          </tr>
        </tfoot>
      </Table>
      <Button variant="secondary" className="w-100 mt-3" href="/admin">Back to Admin Panel</Button>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.name} 
                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={updatedData.email} 
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.phone} 
                onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.address} 
                onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminMembers;
