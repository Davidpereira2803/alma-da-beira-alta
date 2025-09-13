import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";

function AdminMembers() {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [updatedData, setUpdatedData] = useState({ name: "", email: "", phone: "", address: "" });

  const [search, setSearch] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [onlyPaid, setOnlyPaid] = useState(false);

  const [notice, setNotice] = useState({ type: "", message: "" });
  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    clearTimeout(showNotice._t);
    showNotice._t = setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "members"));
        const memberList = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setMembers(memberList);
      } catch (e) {
        console.error(e);
        showNotice(t("loading_error") || "Failed to load members.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [t]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      const matches =
        !q ||
        (m.membershipNumber ? String(m.membershipNumber).toLowerCase().includes(q) : false) ||
        (m.name || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.phone || "").toLowerCase().includes(q) ||
        (m.address || "").toLowerCase().includes(q) ||
        (m.message || "").toLowerCase().includes(q);
      const pendingOk = onlyPending ? !m.processed : true;
      const paidOk = onlyPaid ? !!m.processed : true;
      return matches && pendingOk && paidOk;
    });
  }, [members, search, onlyPending, onlyPaid]);

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirm_delete_member") || "Delete this member?")) return;
    try {
      await deleteDoc(doc(db, "members", id));
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showNotice(t("deleted_success") || "Deleted.");
    } catch {
      showNotice(t("delete_failed") || "Delete failed.", "error");
    }
  };

  const toggleProcessed = async (member) => {
    const next = !member.processed;
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, processed: next } : m)));
    try {
      await updateDoc(doc(db, "members", member.id), { processed: next });
      showNotice(next ? (t("marked_paid") || "Marked as paid.") : (t("marked_unpaid") || "Marked as unpaid."));
    } catch {
      // revert
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, processed: !next } : m)));
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setUpdatedData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMember) return;
    try {
      await updateDoc(doc(db, "members", selectedMember.id), updatedData);
      setMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? { ...m, ...updatedData } : m))
      );
      setShowEditModal(false);
      showNotice(t("member_updated") || "Member updated.");
    } catch {
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }
  };

  const exportCSV = () => {
    if (members.length === 0) return;
    const rows = [
      ["MembershipNumber", "Name", "Email", "Phone", "Address", "Message", "Processed"],
      ...filtered.map((m) => [
        m.membershipNumber || "",
        m.name || "",
        m.email || "",
        m.phone || "",
        m.address || "",
        m.message || "",
        m.processed ? "yes" : "no",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      title={t("registered_members")}
      description={t("registered_members_hint") || "View, edit, and manage membership records."}
    >
      {notice.message && (
        <div
          role="status"
          className={`mb-4 rounded-lg p-3 text-sm ${
            notice.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {notice.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 grid gap-3 md:grid-cols-12 items-end">
        <div className="md:col-span-8">
          <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-3">
            <svg width="16" height="16" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              className="flex-1 h-9 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
              placeholder={t("search_members") || "Search members..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
              <input
                type="checkbox"
                className="accent-[#3E3F29]"
                checked={onlyPending}
                onChange={(e) => setOnlyPending(e.target.checked)}
              />
              {t("only_pending") || "Only pending"}
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
              <input
                type="checkbox"
                className="accent-[#3E3F29]"
                checked={onlyPaid}
                onChange={(e) => setOnlyPaid(e.target.checked)}
              />
              {t("only_paid") || "Only paid"}
            </label>
          </div>
        </div>

        <div className="md:col-span-4 flex md:justify-end gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-full h-10 px-4 text-sm font-semibold bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4] disabled:opacity-50"
            disabled={filtered.length === 0}
          >
            {t("export_csv") || "Export CSV"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#7D8D86] text-[#3E3F29]">
              <th className="border border-[#BCA88D] p-2">{t("membership_number")}</th>
              <th className="border border-[#BCA88D] p-2">{t("name")}</th>
              <th className="border border-[#BCA88D] p-2">{t("email")}</th>
              <th className="border border-[#BCA88D] p-2">{t("phone")}</th>
              <th className="border border-[#BCA88D] p-2">{t("address")}</th>
              <th className="border border-[#BCA88D] p-2">{t("message")}</th>
              <th className="border border-[#BCA88D] p-2">{t("status")}</th>
              <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-[#7D8D86]">{t("loading") || "Loading..."}</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-[#7D8D86]">{t("no_data") || "No members"}</td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member.id} className={`text-center ${member.processed ? "bg-green-50" : "bg-[#F1F0E4]"}`}>
                  <td className="border border-[#BCA88D] p-2">{member.membershipNumber || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{member.name}</td>
                  <td className="border border-[#BCA88D] p-2">{member.email || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{member.phone || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{member.address || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{member.message || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">
                    {member.processed ? t("status_paid") : t("status_pending")}
                  </td>
                  <td className="border border-[#BCA88D] p-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        className={`inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold ${
                          member.processed
                            ? "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/20"
                            : "bg-[#3E3F29] text-white"
                        }`}
                        onClick={() => toggleProcessed(member)}
                      >
                        {member.processed ? (t("mark_unpaid") || "Mark unpaid") : t("mark_as_paid")}
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-[#BCA88D] text-[#3E3F29] hover:bg-[#7D8D86]"
                        onClick={() => handleEdit(member)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-white border border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(member.id)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {!loading && filtered.length > 0 && (
            <tfoot>
              <tr className="bg-[#F1F0E4] text-center font-semibold">
                <td colSpan="7" className="border border-[#BCA88D] p-2">
                  {t("total_members")}
                </td>
                <td className="border border-[#BCA88D] p-2">{filtered.length}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <button
        className="w-full mt-6 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
        onClick={() => window.history.back()}
      >
        {t("back_to_admin_panel")}
      </button>

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-3 text-[#3E3F29]">{t("edit_member")}</h3>

            <label className="block mb-1 text-[#3E3F29]">{t("name")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={updatedData.name}
              onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
            />

            <label className="block mb-1 text-[#3E3F29]">{t("email")}</label>
            <input
              type="email"
              className="w-full p-2 border border-[#BCA88D] rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={updatedData.email}
              onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
            />

            <label className="block mb-1 text-[#3E3F29]">{t("phone")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={updatedData.phone}
              onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
            />

            <label className="block mb-1 text-[#3E3F29]">{t("address")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded mb-1 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={updatedData.address}
              onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="inline-flex items-center gap-2 rounded-full h-10 px-4 text-sm font-semibold bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4]"
                onClick={() => setShowEditModal(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full h-10 px-4 text-sm font-semibold bg-[#3E3F29] text-white hover:bg-[#2f3022]"
                onClick={handleSaveEdit}
              >
                {t("save_changes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminMembers;
