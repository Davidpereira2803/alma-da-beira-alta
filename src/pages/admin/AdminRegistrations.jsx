import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  addDoc,
  doc,
  query,
  orderBy,
  limit,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";

function AdminRegistrations() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });

  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "registrations"));
      const registrationList = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Optional: newest first if createdAt exists
      registrationList.sort((a, b) => {
        const ta = a.createdAt?.seconds ? a.createdAt.seconds : 0;
        const tb = b.createdAt?.seconds ? b.createdAt.seconds : 0;
        return tb - ta;
      });
      setRegistrations(registrationList);
    } catch (e) {
      console.error(e);
      showNotice(t("loading_error") || "Failed to load registrations.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Transaction-safe membership number increment
  async function nextMembershipNumber() {
    const counterRef = doc(db, "counters", "members");
    try {
      const number = await runTransaction(db, async (tx) => {
        const snap = await tx.get(counterRef);
        const last = snap.exists() ? Number(snap.data().lastNumber || 0) : 0;
        const next = last + 1;
        tx.set(counterRef, { lastNumber: next }, { merge: true });
        return next;
      });
      return number;
    } catch (e) {
      // Fallback to last member query
      const membersRef = collection(db, "members");
      const lastMemberQuery = query(membersRef, orderBy("membershipNumber", "desc"), limit(1));
      const snapshot = await getDocs(lastMemberQuery);
      return snapshot.empty ? 1 : Number(snapshot.docs[0].data().membershipNumber || 0) + 1;
    }
  }

  const approveMember = async (registration) => {
    try {
      const membershipNumber = await nextMembershipNumber();
      await addDoc(collection(db, "members"), {
        name: registration.name || "",
        email: registration.email || "",
        phone: registration.phone || "",
        address: registration.address || "",
        message: registration.message || "",
        membershipNumber,
        processed: false, // payment status, can be updated in Members page
        createdAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "registrations", registration.id));
      setRegistrations((prev) => prev.filter((r) => r.id !== registration.id));
      showNotice(`${registration.name} ${t("approved_as_member") || "approved as member."}`);
    } catch (error) {
      console.error("Error approving member:", error);
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }
  };

  const rejectMember = async (id) => {
    if (!window.confirm(t("confirm_delete_member") || "Delete this registration?")) return;
    try {
      await deleteDoc(doc(db, "registrations", id));
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      showNotice(t("registration_rejected") || "Registration rejected.");
    } catch (error) {
      console.error("Error rejecting registration:", error);
      showNotice(t("delete_failed") || "Delete failed.", "error");
    }
  };

  const exportCSV = () => {
    if (registrations.length === 0) return;
    const rows = [
      ["Name", "Email", "Phone", "Address", "Message", "CreatedAt"],
      ...filtered.map((r) => [
        r.name || "",
        r.email || "",
        r.phone || "",
        r.address || "",
        r.message || "",
        r.createdAt?.seconds ? new Date(r.createdAt.seconds * 1000).toISOString() : "",
      ]),
    ];
    const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pending_registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      if (!q) return true;
      return (
        (r.name || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.address || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q)
      );
    });
  }, [registrations, search]);

  const fmtDate = (createdAt) => {
    if (createdAt?.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString();
    return "-";
    };

  return (
    <AdminLayout
      title={t("pending_registrations")}
      description={t("registered_members_hint") || "Review and approve or reject membership requests."}
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
              placeholder={t("search_members") || "Search registrations..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#7D8D86] text-[#3E3F29]">
              <th className="border border-[#BCA88D] p-2">{t("name")}</th>
              <th className="border border-[#BCA88D] p-2">{t("email")}</th>
              <th className="border border-[#BCA88D] p-2">{t("phone")}</th>
              <th className="border border-[#BCA88D] p-2">{t("address")}</th>
              <th className="border border-[#BCA88D] p-2">{t("message")}</th>
              <th className="border border-[#BCA88D] p-2">{t("date") || "Date"}</th>
              <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-[#7D8D86]">
                  {t("loading") || "Loading..."}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-[#7D8D86]">
                  {t("no_data") || "No registrations"}
                </td>
              </tr>
            ) : (
              filtered.map((reg) => (
                <tr key={reg.id} className="text-center bg-[#F1F0E4]">
                  <td className="border border-[#BCA88D] p-2">{reg.name}</td>
                  <td className="border border-[#BCA88D] p-2">{reg.email || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{reg.phone || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{reg.address || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{reg.message || "-"}</td>
                  <td className="border border-[#BCA88D] p-2">{fmtDate(reg.createdAt)}</td>
                  <td className="border border-[#BCA88D] p-2">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-[#3E3F29] text-white hover:bg-[#2f3022]"
                        onClick={() => approveMember(reg)}
                        title={t("approve")}
                      >
                        {t("approve")}
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-white border border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => rejectMember(reg.id)}
                        title={t("reject")}
                      >
                        {t("reject")}
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
                <td colSpan={6} className="border border-[#BCA88D] p-2">
                  {t("total_people") || "Total"}
                </td>
                <td className="border border-[#BCA88D] p-2">{filtered.length}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <button
        onClick={() => window.history.back()}
        className="w-full mt-6 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
      >
        {t("back_to_admin_panel")}
      </button>
    </AdminLayout>
  );
}

export default AdminRegistrations;
