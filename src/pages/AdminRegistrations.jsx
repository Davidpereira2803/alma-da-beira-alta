import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, doc, query, orderBy, limit } from "firebase/firestore";
import { Container, Table, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function AdminRegistrations() {
  const { t } = useTranslation();
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
    const membersRef = collection(db, "members");
    const lastMemberQuery = query(membersRef, orderBy("membershipNumber", "desc"), limit(1));

    const snapshot = await getDocs(lastMemberQuery);
    let newMembershipNumber = 1;

    if (!snapshot.empty) {
      const lastMember = snapshot.docs[0].data();
      newMembershipNumber = lastMember.membershipNumber + 1;
    }

    return newMembershipNumber;
  };

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

      alert(`${registration.name} ${t("approved_as_member")}`);
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const rejectMember = async (id) => {
    try {
      await deleteDoc(doc(db, "registrations", id));
      setRegistrations(registrations.filter((r) => r.id !== id));
      alert(t("registration_rejected"));
    } catch (error) {
      console.error("Error rejecting registration:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">{t("pending_registrations")}</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("phone")}</th>
            <th>{t("address")}</th>
            <th>{t("actions")}</th>
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
                  {t("approve")}
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => rejectMember(reg.id)}>
                  {t("reject")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" className="w-100 mt-3" href="/admin/register">
        {t("register_member")}
      </Button>
      <Button variant="secondary" className="w-100 mt-3" href="/admin">
        {t("back_to_admin_panel")}
      </Button>
    </Container>
  );
}

export default AdminRegistrations;
