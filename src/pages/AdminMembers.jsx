import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Container, Table, Button } from "react-bootstrap";

function AdminMembers() {
  const [members, setMembers] = useState([]);

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

  return (
    <Container className="mt-5">
      <h2 className="text-center">Member Registrations</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
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
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.phone}</td>
              <td>{member.address}</td>
              <td>{member.message}</td>
              <td>{member.processed ? "✅ Processed" : "❌ Pending"}</td>
              <td>
                {!member.processed && (
                  <Button variant="success" size="sm" onClick={() => handleMarkProcessed(member.id)}>
                    Mark as Processed
                  </Button>
                )}
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(member.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminMembers;