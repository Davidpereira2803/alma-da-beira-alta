import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, addDoc, doc, query, orderBy, limit } from "firebase/firestore";
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {t("pending_registrations")}
        </h2>

        {/* Registrations Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 text-gray-700">
                <th className="border p-2">{t("name")}</th>
                <th className="border p-2">{t("email")}</th>
                <th className="border p-2">{t("phone")}</th>
                <th className="border p-2">{t("address")}</th>
                <th className="border p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="text-center bg-gray-100">
                  <td className="border p-2">{reg.name}</td>
                  <td className="border p-2">{reg.email}</td>
                  <td className="border p-2">{reg.phone}</td>
                  <td className="border p-2">{reg.address}</td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                      onClick={() => approveMember(reg)}
                    >
                      {t("approve")}
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                      onClick={() => rejectMember(reg.id)}
                    >
                      {t("reject")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Register Member & Back Button */}
        <div className="mt-4 space-y-2">
          <a href="/admin/register" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {t("register_member")}
          </a>
          <a href="/admin" className="block w-full text-center bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition">
            {t("back_to_admin_panel")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminRegistrations;
