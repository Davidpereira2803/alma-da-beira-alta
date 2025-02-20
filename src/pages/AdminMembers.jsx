import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function AdminMembers() {
  const { t } = useTranslation();
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
    if (window.confirm(t("confirm_delete_member"))) {
      await deleteDoc(doc(db, "members", id));
      setMembers(members.filter(member => member.id !== id));
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

    setMembers(members.map(member => 
      member.id === selectedMember.id ? { ...member, ...updatedData } : member
    ));

    setShowEditModal(false);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">{t("registered_members")}</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>{t("membership_number")}</th>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("phone")}</th>
            <th>{t("address")}</th>
            <th>{t("message")}</th>
            <th>{t("status")}</th>
            <th>{t("actions")}</th>
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
              <td>{member.processed ? t("status_paid") : t("status_pending")}</td>
              <td>
                {!member.processed && (
                  <Button variant="success" size="sm" onClick={() => handleMarkProcessed(member.id)}>
                    {t("mark_as_paid")}
                  </Button>
                )}
                <Button variant="warning" size="sm" className="ms-2" onClick={() => handleEdit(member)}>
                  {t("edit")}
                </Button>
                <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(member.id)}>
                  {t("delete")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        {/* Footer Row: Display Total Members */}
        <tfoot>
          <tr>
            <td colSpan="7"><strong>{t("total_members")}</strong></td>
            <td><strong>{members.length}</strong></td>
          </tr>
        </tfoot>
      </Table>
      <Button variant="secondary" className="w-100 mt-3" href="/admin">
        {t("back_to_admin_panel")}
      </Button>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit_member")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>{t("name")}</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.name} 
                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{t("email")}</Form.Label>
              <Form.Control 
                type="email" 
                value={updatedData.email} 
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{t("phone")}</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.phone} 
                onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })} 
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>{t("address")}</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedData.address} 
                onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>{t("cancel")}</Button>
          <Button variant="primary" onClick={handleSaveEdit}>{t("save_changes")}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminMembers;
