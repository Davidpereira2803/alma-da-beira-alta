import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import AdminLayout from "./AdminLayout";

function toDate(dateField) {
  if (!dateField) return null;
  if (typeof dateField === "object" && dateField.seconds) return new Date(dateField.seconds * 1000);
  if (typeof dateField === "string" || typeof dateField === "number") return new Date(dateField);
  return null;
}

function AdminManageEventRegistrations() {
  const { t } = useTranslation();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [editingRegistration, setEditingRegistration] = useState(null);

  const [newRegistration, setNewRegistration] = useState({
    name: "",
    email: "",
    description: "",
    isMember: false,
  });

  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyArrived, setOnlyArrived] = useState(false);
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);

  const [notice, setNotice] = useState({ type: "", message: "" });
  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => setNotice({ type: "", message: "" }), 3000);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoadingEvents(true);
    try {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (toDate(a.date)?.getTime() || 0) - (toDate(b.date)?.getTime() || 0));
      setEvents(list);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function fetchRegistrations(eventId) {
    setLoadingRegs(true);
    try {
      const eventRef = collection(db, "events", eventId, "registrations");
      const snap = await getDocs(eventRef);
      const regs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRegistrations(regs);
    } finally {
      setLoadingRegs(false);
    }
  }

  function handleSelectEvent(id) {
    setSelectedEventId(id);
    const ev = events.find((e) => e.id === id);
    setSelectedEventTitle(ev?.title || "");
    setRegistrations([]);
    if (id) fetchRegistrations(id);
  }

  async function sendEmail(recipientEmail, name, eventTitle, password) {
    const templateParams = {
      to_email: recipientEmail,
      user_name: name,
      event_title: eventTitle,
      password,
    };
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE,
        import.meta.env.VITE_EMAIL_TEMPLATE2,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC
      );
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  async function handleAddOrUpdateRegistration(e) {
    e.preventDefault();
    if (!selectedEventId || !newRegistration.name || !newRegistration.description) {
      showNotice(t("all_fields_required") || "Please fill all required fields.", "error");
      return;
    }

    try {
      if (editingRegistration) {
        // Keep existing password if any
        await updateDoc(
          doc(db, "events", selectedEventId, "registrations", editingRegistration.id),
          {
            name: newRegistration.name.trim(),
            email: (newRegistration.email || "").trim(),
            description: newRegistration.description.trim(),
            isMember: !!newRegistration.isMember,
          }
        );
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === editingRegistration.id
              ? { ...r, ...newRegistration }
              : r
          )
        );
        setEditingRegistration(null);
        showNotice(t("updated_success") || "Updated.");
      } else {
         const eventRef = collection(db, "events", selectedEventId, "registrations");
         const docRef = await addDoc(eventRef, {
           name: newRegistration.name.trim(),
           email: (newRegistration.email || "").trim(),
           description: newRegistration.description.trim(),
           isMember: !!newRegistration.isMember,
           arrived: false,
           paid: false,
           createdAt: serverTimestamp(),
         });
         const added = {
           id: docRef.id,
           ...newRegistration,
           arrived: false,
           paid: false,
         };
         setRegistrations((prev) => [...prev, added]);

        if (added.email) {
          sendEmail(added.email, added.name, selectedEventTitle || selectedEventId);
        }
        showNotice(t("added_success") || "Added.");
      }
    } catch (error) {
      console.error("Error saving registration:", error);
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }

    setNewRegistration({ name: "", email: "", description: "", isMember: false });
  }

  function handleEditRegistration(reg) {
    setNewRegistration({
      name: reg.name || "",
      email: reg.email || "",
      description: reg.description || "",
      isMember: !!reg.isMember,
    });
    setEditingRegistration(reg);
  }

  async function handleDeleteRegistration(userId) {
    if (!window.confirm(t("confirm_delete") || "Delete this record?")) return;
    await deleteDoc(doc(db, "events", selectedEventId, "registrations", userId));
    setRegistrations((prev) => prev.filter((r) => r.id !== userId));
    showNotice(t("deleted_success") || "Deleted.");
  }

  async function toggleField(reg, field) {
    const next = !reg[field];
    await updateDoc(doc(db, "events", selectedEventId, "registrations", reg.id), {
      [field]: next,
    });
    setRegistrations((prev) => prev.map((r) => (r.id === reg.id ? { ...r, [field]: next } : r)));
  }

  function exportCSV() {
    const rows = [
      ["Name", "Email", "Description", "IsMember", "Arrived", "Paid"],
      ...registrations.map((r) => [
        r.name || "",
        r.email || "",
        r.description || "",
        r.isMember ? "yes" : "no",
        r.arrived ? "yes" : "no",
        r.paid ? "yes" : "no",
      ]),
    ];
    const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = (selectedEventTitle || "event").replace(/[^\w.-]+/g, "_");
    a.download = `registrations_${safeTitle}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesQ =
        !q ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q);
      const okArrived = onlyArrived ? !!r.arrived : true;
      const okPaid = onlyUnpaid ? !r.paid : true;
      return matchesQ && okArrived && okPaid;
    });
  }, [registrations, search, onlyArrived, onlyUnpaid]);

  const totalMembers = registrations.filter((r) => r.isMember).length;

  const fmtDate = (d) => {
    const dt = toDate(d);
    return dt ? dt.toLocaleDateString() : "-";
  };

  return (
    <AdminLayout
      title={t("manage_event_registrations")}
      description={t("manage_event_registrations_hint") || "Add, edit and track registrations for each event."}
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

      <div className="mb-4 grid gap-3 md:grid-cols-12 items-end">
        <div className="md:col-span-7">
          <label className="block text-[#3E3F29] font-medium">{t("select_event")}</label>
          <select
            className="w-full h-10 px-3 rounded-lg bg-white border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            onChange={(e) => handleSelectEvent(e.target.value)}
            value={selectedEventId}
          >
            <option value="">{t("choose_event")}</option>
            {loadingEvents ? null : events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} — {fmtDate(ev.date)}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-5 flex gap-2 md:justify-end">
          <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-3 w-full md:w-auto">
            <svg width="16" height="16" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              className="flex-1 h-9 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
              placeholder={t("search_registrations") || "Search registrations..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={!selectedEventId}
            />
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-full h-10 px-4 text-sm font-semibold bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4] disabled:opacity-50"
            disabled={!selectedEventId || registrations.length === 0}
          >
            {t("export_csv") || "Export CSV"}
          </button>
        </div>

        <div className="md:col-span-12 flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
            <input type="checkbox" className="accent-[#3E3F29]" checked={onlyArrived} onChange={(e) => setOnlyArrived(e.target.checked)} />
            {t("filter_arrived") || "Only arrived"}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
            <input type="checkbox" className="accent-[#3E3F29]" checked={onlyUnpaid} onChange={(e) => setOnlyUnpaid(e.target.checked)} />
            {t("filter_unpaid") || "Only unpaid"}
          </label>
        </div>
      </div>

      {selectedEventId && (
        <form onSubmit={handleAddOrUpdateRegistration} className="p-4 bg-[#7D8D86] shadow rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-[#3E3F29]">
            {editingRegistration ? t("edit_registration") : t("add_registration")}
          </h3>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#3E3F29] font-medium">{t("name")}</label>
              <input
                type="text"
                value={newRegistration.name}
                onChange={(e) => setNewRegistration({ ...newRegistration, name: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#BCA88D] focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("email")}</label>
              <input
                type="email"
                value={newRegistration.email}
                onChange={(e) => setNewRegistration({ ...newRegistration, email: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#BCA88D] focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#3E3F29] font-medium">{t("description")}</label>
              <input
                type="text"
                value={newRegistration.description}
                onChange={(e) => setNewRegistration({ ...newRegistration, description: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[#BCA88D] focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
                <input
                  type="checkbox"
                  checked={newRegistration.isMember}
                  onChange={(e) => setNewRegistration({ ...newRegistration, isMember: e.target.checked })}
                  className="accent-[#3E3F29]"
                />
                {t("is_member")}
              </label>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
              disabled={loadingRegs}
            >
              {editingRegistration ? t("save_changes") : t("add_person")}
            </button>
            {editingRegistration && (
              <button
                type="button"
                className="flex-1 bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] py-2 rounded-lg transition font-semibold"
                onClick={() => {
                  setEditingRegistration(null);
                  setNewRegistration({ name: "", email: "", description: "", isMember: false });
                }}
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </form>
      )}

      {selectedEventId && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#7D8D86] text-[#3E3F29]">
                <th className="border border-[#BCA88D] p-2">{t("name")}</th>
                <th className="border border-[#BCA88D] p-2">{t("email")}</th>
                <th className="border border-[#BCA88D] p-2">{t("description")}</th>
                <th className="border border-[#BCA88D] p-2">{t("is_member")}</th>
                <th className="border border-[#BCA88D] p-2">{t("arrived") || "Arrived"}</th>
                <th className="border border-[#BCA88D] p-2">{t("paid") || "Paid"}</th>
                <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loadingRegs ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-[#7D8D86]">…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-[#7D8D86]">
                    {t("no_data") || "No registrations"}
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.id} className="text-center bg-[#F1F0E4]">
                    <td className="border border-[#BCA88D] p-2">{reg.name}</td>
                    <td className="border border-[#BCA88D] p-2">{reg.email || "-"}</td>
                    <td className="border border-[#BCA88D] p-2">{reg.description}</td>
                    <td className="border border-[#BCA88D] p-2">{reg.isMember ? "✅" : "❌"}</td>
                    <td className="border border-[#BCA88D] p-2">
                      <button
                        onClick={() => toggleField(reg, "arrived")}
                        className={`inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold ${
                          reg.arrived
                            ? "bg-[#3E3F29] text-white"
                            : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/20"
                        }`}
                        title={reg.arrived ? (t("mark_not_arrived") || "Mark not arrived") : (t("mark_arrived") || "Mark arrived")}
                      >
                        {reg.arrived ? (t("arrived") || "Arrived") : (t("mark_arrived") || "Mark arrived")}
                      </button>
                    </td>
                    <td className="border border-[#BCA88D] p-2">
                      <button
                        onClick={() => toggleField(reg, "paid")}
                        className={`inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold ${
                          reg.paid
                            ? "bg-[#3E3F29] text-white"
                            : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/20"
                        }`}
                        title={reg.paid ? (t("mark_unpaid") || "Mark unpaid") : (t("mark_paid") || "Mark paid")}
                      >
                        {reg.paid ? (t("paid") || "Paid") : (t("mark_paid") || "Mark paid")}
                      </button>
                    </td>
                    <td className="border border-[#BCA88D] p-2">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-[#BCA88D] text-[#3E3F29] hover:bg-[#7D8D86]"
                          onClick={() => handleEditRegistration(reg)}
                        >
                          {t("edit")}
                        </button>
                        <button
                          className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-white border border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteRegistration(reg.id)}
                        >
                          {t("remove")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loadingRegs && registrations.length > 0 && (
                <tr className="bg-[#F1F0E4] text-center font-bold">
                  <td className="border border-[#BCA88D] p-2" colSpan={3}>{t("total_people")}</td>
                  <td className="border border-[#BCA88D] p-2">{totalMembers} {t("members")}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.filter(r => r.arrived).length} {t("arrived") || "Arrived"}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.filter(r => r.paid).length} {t("paid") || "Paid"}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.length}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => window.history.back()}
        className="w-full mt-4 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
      >
        {t("back_to_admin_panel")}
      </button>
    </AdminLayout>
  );
}

export default AdminManageEventRegistrations;
