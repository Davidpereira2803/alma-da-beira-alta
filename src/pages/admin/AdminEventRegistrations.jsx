import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";

function toDate(dateField) {
  if (!dateField) return null;
  if (typeof dateField === "object" && dateField.seconds) return new Date(dateField.seconds * 1000);
  if (typeof dateField === "string" || typeof dateField === "number") return new Date(dateField);
  return null;
}

function AdminEventRegistrations() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [eventPrices, setEventPrices] = useState({ memberPrice: 0, regularPrice: 0 });
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyArrived, setOnlyArrived] = useState(false);
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    clearTimeout(showNotice._t);
    showNotice._t = setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    (async () => {
      setLoadingEvents(true);
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (toDate(a.date)?.getTime() || 0) - (toDate(b.date)?.getTime() || 0));
      setEvents(list);
      setLoadingEvents(false);
    })();
  }, []);

  const fetchRegistrations = async (eventId) => {
    setSelectedEvent(eventId);
    setRegistrations([]);
    if (!eventId) return;
    const ev = events.find((e) => e.id === eventId);
    setEventPrices({
      memberPrice: Number(ev?.memberPrice || 0),
      regularPrice: Number(ev?.regularPrice || 0),
    });
    setLoadingRegs(true);
    const eventSnapshot = await getDocs(collection(db, `events/${eventId}/registrations`));
    const registrationsList = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRegistrations(registrationsList);
    setLoadingRegs(false);
  };

  const updateRegistrationStatus = async (eventId, reg, field) => {
    const registrationRef = doc(db, `events/${eventId}/registrations/${reg.id}`);
    const next = !reg[field];
    setRegistrations((prev) => prev.map((r) => (r.id === reg.id ? { ...r, [field]: next } : r)));
    try {
      await updateDoc(registrationRef, { [field]: next });
    } catch {
      // revert on error
      setRegistrations((prev) => prev.map((r) => (r.id === reg.id ? { ...r, [field]: !next } : r)));
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }
  };

  const filteredRegistrations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return registrations
      .filter((r) => {
        const matches =
          !q ||
          (r.name || "").toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.email || "").toLowerCase().includes(q);
        const okArrived = onlyArrived ? !!r.arrived : true;
        const okPaid = onlyUnpaid ? !r.paid : true;
        return matches && okArrived && okPaid;
      })
      .sort((a, b) => {
        const aMatches = (a.name || "").toLowerCase().includes(q);
        const bMatches = (b.name || "").toLowerCase().includes(q);
        return Number(bMatches) - Number(aMatches);
      });
  }, [registrations, searchQuery, onlyArrived, onlyUnpaid]);

  const currency = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n || 0);

  const totalRevenue = registrations
    .filter((reg) => reg.paid)
    .reduce((sum, reg) => sum + Number(reg.isMember ? eventPrices.memberPrice : eventPrices.regularPrice), 0);

  const exportCSV = () => {
    if (!selectedEvent || registrations.length === 0) return;
    const rows = [
      ["Name", "Email", "Description", "IsMember", "Arrived", "Paid", "Price"],
      ...registrations.map((r) => [
        r.name || "",
        r.email || "",
        r.description || "",
        r.isMember ? "yes" : "no",
        r.arrived ? "yes" : "no",
        r.paid ? "yes" : "no",
        r.isMember ? eventPrices.memberPrice : eventPrices.regularPrice,
      ]),
    ];
    const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event_${selectedEvent}_registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout
      title={t("event_registrations")}
      description={t("manage_event_registrations_hint") || "View and update arrivals and payments."}
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

      <div className="grid gap-3 md:grid-cols-12 items-end mb-4">
        <div className="md:col-span-6">
          <label className="block text-[#3E3F29] font-medium">{t("select_event")}</label>
          <select
            className="w-full h-10 px-3 rounded-lg bg-white border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            onChange={(e) => fetchRegistrations(e.target.value)}
            value={selectedEvent}
            disabled={loadingEvents}
          >
            <option value="">{t("choose_event")}</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} — {toDate(event.date)?.toLocaleDateString() || "-"}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4">
          <label className="block text-[#3E3F29] font-medium">{t("search_name")}</label>
          <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-3">
            <svg width="16" height="16" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              className="flex-1 h-9 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
              placeholder={t("search_name")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedEvent}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex gap-2 md:justify-end">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-full h-10 px-4 text-sm font-semibold bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4] disabled:opacity-50"
            disabled={!selectedEvent || registrations.length === 0}
          >
            {t("export_csv") || "Export CSV"}
          </button>
        </div>

        <div className="md:col-span-12 flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
            <input
              type="checkbox"
              className="accent-[#3E3F29]"
              checked={onlyArrived}
              onChange={(e) => setOnlyArrived(e.target.checked)}
            />
            {t("filter_arrived") || "Only arrived"}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
            <input
              type="checkbox"
              className="accent-[#3E3F29]"
              checked={onlyUnpaid}
              onChange={(e) => setOnlyUnpaid(e.target.checked)}
            />
            {t("filter_unpaid") || "Only unpaid"}
          </label>
        </div>
      </div>

      {selectedEvent && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#BCA88D] mt-2 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#7D8D86] text-[#3E3F29]">
                <th className="border border-[#BCA88D] p-2">{t("name")}</th>
                <th className="border border-[#BCA88D] p-2">{t("description")}</th>
                <th className="border border-[#BCA88D] p-2">{t("is_member")}</th>
                <th className="border border-[#BCA88D] p-2">{t("price")}</th>
                <th className="border border-[#BCA88D] p-2">{t("arrived")}</th>
                <th className="border border-[#BCA88D] p-2">{t("paid")}</th>
                <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loadingRegs ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-[#7D8D86]">
                    {t("loading") || "Loading..."}
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-[#7D8D86]">
                    {t("no_data") || "No registrations"}
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const price = reg.isMember ? eventPrices.memberPrice : eventPrices.regularPrice;
                  return (
                    <tr key={reg.id} className="text-center bg-[#F1F0E4]">
                      <td className="border border-[#BCA88D] p-2">{reg.name}</td>
                      <td className="border border-[#BCA88D] p-2">{reg.description}</td>
                      <td className="border border-[#BCA88D] p-2">{reg.isMember ? "✅" : "❌"}</td>
                      <td className="border border-[#BCA88D] p-2">{currency(price)}</td>
                      <td className="border border-[#BCA88D] p-2">
                        <button
                          className={`inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold ${
                            reg.arrived
                              ? "bg-[#3E3F29] text-white"
                              : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/20"
                          }`}
                          onClick={() => updateRegistrationStatus(selectedEvent, reg, "arrived")}
                        >
                          {reg.arrived ? (t("arrived") || "Arrived") : (t("mark_arrived") || "Mark arrived")}
                        </button>
                      </td>
                      <td className="border border-[#BCA88D] p-2">
                        <button
                          className={`inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold ${
                            reg.paid
                              ? "bg-[#3E3F29] text-white"
                              : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/20"
                          }`}
                          onClick={() => updateRegistrationStatus(selectedEvent, reg, "paid")}
                        >
                          {reg.paid ? (t("paid") || "Paid") : (t("mark_paid") || "Mark paid")}
                        </button>
                      </td>
                      <td className="border border-[#BCA88D] p-2">
                        <div className="text-xs text-[#7D8D86]">{reg.email || "-"}</div>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loadingRegs && registrations.length > 0 && (
                <tr className="bg-[#F1F0E4] text-center font-bold">
                  <td className="border border-[#BCA88D] p-2" colSpan={3}>
                    {t("total_people")}
                  </td>
                  <td className="border border-[#BCA88D] p-2">{currency(totalRevenue)}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.filter((r) => r.arrived).length}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.filter((r) => r.paid).length}</td>
                  <td className="border border-[#BCA88D] p-2">{registrations.length}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => window.history.back()}
        className="w-full mt-6 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
      >
        {t("back_to_admin_panel")}
      </button>
    </AdminLayout>
  );
}

export default AdminEventRegistrations;
