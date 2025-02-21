import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{t("registered_members")}</h2>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 text-gray-700">
                <th className="border p-2">{t("membership_number")}</th>
                <th className="border p-2">{t("name")}</th>
                <th className="border p-2">{t("email")}</th>
                <th className="border p-2">{t("phone")}</th>
                <th className="border p-2">{t("address")}</th>
                <th className="border p-2">{t("message")}</th>
                <th className="border p-2">{t("status")}</th>
                <th className="border p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className={`text-center ${member.processed ? "bg-green-100" : ""}`}>
                  <td className="border p-2">{member.membershipNumber}</td>
                  <td className="border p-2">{member.name}</td>
                  <td className="border p-2">{member.email}</td>
                  <td className="border p-2">{member.phone}</td>
                  <td className="border p-2">{member.address}</td>
                  <td className="border p-2">{member.message}</td>
                  <td className="border p-2">
                    {member.processed ? t("status_paid") : t("status_pending")}
                  </td>
                  <td className="border p-2 space-x-2">
                    {!member.processed && (
                      <button
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                        onClick={() => handleMarkProcessed(member.id)}
                      >
                        {t("mark_as_paid")}
                      </button>
                    )}
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition"
                      onClick={() => handleEdit(member)}
                    >
                      {t("edit")}
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(member.id)}
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Footer Row: Display Total Members */}
            <tfoot>
              <tr className="bg-gray-200">
                <td colSpan="7" className="border p-2 font-semibold text-gray-800">
                  {t("total_members")}
                </td>
                <td className="border p-2 font-semibold text-gray-800">{members.length}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Back Button */}
        <button
          className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => window.history.back()}
        >
          {t("back_to_admin_panel")}
        </button>

        {/* Edit Member Modal */}
        {showEditModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-3">{t("edit_member")}</h3>
              
              <label className="block mb-2">{t("name")}</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-3"
                value={updatedData.name}
                onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
              />

              <label className="block mb-2">{t("email")}</label>
              <input
                type="email"
                className="w-full p-2 border rounded mb-3"
                value={updatedData.email}
                onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
              />

              <label className="block mb-2">{t("phone")}</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-3"
                value={updatedData.phone}
                onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
              />

              <label className="block mb-2">{t("address")}</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-3"
                value={updatedData.address}
                onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })}
              />

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                  onClick={() => setShowEditModal(false)}
                >
                  {t("cancel")}
                </button>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                  onClick={handleSaveEdit}
                >
                  {t("save_changes")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMembers;
