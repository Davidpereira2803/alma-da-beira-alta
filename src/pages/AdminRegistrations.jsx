import { db } from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";

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
    <div>
      <h2>Pending Registrations</h2>
      {registrations.map((reg) => (
        <div key={reg.id} className="registration-box">
          <p><strong>Name:</strong> {reg.name}</p>
          <p><strong>Email:</strong> {reg.email}</p>
          <p><strong>Phone:</strong> {reg.phone}</p>
          <p><strong>Address:</strong> {reg.address}</p>
          <button onClick={() => approveMember(reg)}>Approve</button>
          <button onClick={() => rejectMember(reg.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminRegistrations;
