import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, doc , query, orderBy, limit} from "firebase/firestore";
import { Container, Table, Button } from "react-bootstrap";

function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      const querySnapshot = await getDocs(collection(db, "registrations"));
      const registrationList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRegistrations(registrationList);
    };

    fetchRegistrations();
  }, []);

  const generateMembershipNumber = async () => {
    // Fetch the last membership number and increment it
    const membersRef = collection(db, "members");
    const lastMemberQuery = query(membersRef, orderBy("membershipNumber", "desc"), limit(1));
    
    const snapshot = await getDocs(lastMemberQuery);
    let newMembershipNumber = 1; // Start at 1 if no members exist
    
    if (!snapshot.empty) {
      const lastMember = snapshot.docs[0].data();
      newMembershipNumber = lastMember.membershipNumber + 1;
    }

    return newMembershipNumber;
  };

  // Approve a Registration (Move to Members Collection)
  const approveMember = async (registration) => {
    try {
      const membershipNumber = await generateMembershipNumber();

      await addDoc(collection(db, "members"), {
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        address: registration.address,
        membershipNumber: membershipNumber,
        timestamp: new Date(),
      });

      await deleteDoc(doc(db, "registrations", registration.id));
      setRegistrations(registrations.filter((r) => r.id !== registration.id));

      alert(`${registration.name} has been approved as a member!`);
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  // Reject a Registration (Delete from Firestore)
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
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.name}</td>
              <td>{reg.email}</td>
              <td>{reg.phone}</td>
              <td>{reg.address}</td>
              <td>
                <Button variant="success" size="sm" onClick={() => approveMember(reg)}>
                  Approve
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => rejectMember(reg.id)}>
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" className="w-100 mt-3" href="/admin/register">Register Member</Button>
      <Button variant="secondary" className="w-100 mt-3" href="/admin">Back to Admin Panel</Button>
    </Container>
  );
}

export default AdminRegistrations;
