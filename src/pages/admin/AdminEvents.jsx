import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";

function convertToRawGitHubUrl(input) {
  if (!input) return "";
  let url = input.trim();
  if (url.includes("github.com") && url.includes("/blob/")) {
    url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }
  return url;
}

function AdminEvents() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyEvent = {
    title: "",
    date: "",
    time: "",
    description: "",
    pdfUrl: "",
    backgroundImage: "",
    memberPrice: "",
    regularPrice: "",
    location: "",
    registrationUrl: "",
    tagsText: "",
  };

  const [form, setForm] = useState(emptyEvent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
      setEvents(list);
    } finally {
      setLoading(false);
    }
  }

  function sanitizeForSave(data) {
    const member = data.memberPrice === "" ? null : parseFloat(data.memberPrice);
    const regular = data.regularPrice === "" ? null : parseFloat(data.regularPrice);

    return {
      title: (data.title || "").trim(),
      date: (data.date || "").trim(),
      time: (data.time || "").trim(),
      description: (data.description || "").trim(),
      pdfUrl: convertToRawGitHubUrl(data.pdfUrl || ""),
      backgroundImage: convertToRawGitHubUrl(data.backgroundImage || ""),
      memberPrice: isNaN(member) ? null : member,
      regularPrice: isNaN(regular) ? null : regular,
      location: (data.location || "").trim(),
      registrationUrl: (data.registrationUrl || "").trim(),
      tags: (data.tagsText || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }

  function validate(data) {
    if (!data.title || !data.date || !data.description || !data.location) return false;
    if (data.memberPrice === "" || isNaN(parseFloat(data.memberPrice))) return false;
    if (data.regularPrice === "" || isNaN(parseFloat(data.regularPrice))) return false;
    if (data.time && !/^\d{1,2}:\d{2}$/.test(data.time)) return false;
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate(form)) {
      alert(
        t("invalid_event_fields") ||
          "Please fill title, date, description, location, valid prices, and optional time as HH:mm."
      );
      return;
    }

    const payload = sanitizeForSave(form);

    try {
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload);
      } else {
        await addDoc(collection(db, "events"), payload);
      }
      await fetchEvents();
      setForm(emptyEvent);
      setEditingId(null);
      alert(editingId ? t("event_updated") || "Event updated successfully!" : t("event_added") || "Event added successfully!");
    } catch (err) {
      console.error("Error saving event:", err);
      alert(t("event_save_error") || "Error saving event. Try again.");
    }
  }

  function handleEdit(ev) {
    setEditingId(ev.id);
    setForm({
      title: ev.title || "",
      date: ev.date || "",
      time: ev.time || "",
      description: ev.description || "",
      pdfUrl: ev.pdfUrl || "",
      backgroundImage: ev.backgroundImage || ev.backgroundImageUrl || ev.image || "",
      memberPrice: ev.memberPrice ?? "",
      regularPrice: ev.regularPrice ?? "",
      location: ev.location || "",
      registrationUrl: ev.registrationUrl || "",
      tagsText: Array.isArray(ev.tags) ? ev.tags.join(", ") : "",
    });
  }

  async function handleDelete(id) {
    if (!window.confirm(t("confirm_delete_event") || "Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyEvent);
  }

  const gview = (url) =>
    `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <div className="page-safe-top flex flex-col items-center min-h-screen bg-[#F1F0E4] p-6">
      <div className="w-full max-w-5xl bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-4">
          {t("manage_events")}
        </h2>

        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#7D8D86] rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-3 text-[#3E3F29]">
            {editingId ? t("edit_event") : t("add_event")}
          </h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_title")}</label>
              <input
                type="text"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_location")}</label>
              <input
                type="text"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_date")}</label>
              <input
                type="date"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_time")}</label>
              <input
                type="time"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="HH:mm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#3E3F29] font-medium">{t("event_description")}</label>
              <textarea
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("member_price")}</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.memberPrice}
                onChange={(e) => setForm({ ...form, memberPrice: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("regular_price")}</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.regularPrice}
                onChange={(e) => setForm({ ...form, regularPrice: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_pdf_brochure")}</label>
              <input
                type="url"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.pdfUrl}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder={t("event_pdf_url")}
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("event_background_image_url")}</label>
              <input
                type="url"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.backgroundImage}
                onChange={(e) => setForm({ ...form, backgroundImage: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">{t("registration_url") || "Registration URL"}</label>
              <input
                type="url"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.registrationUrl}
                onChange={(e) => setForm({ ...form, registrationUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium">
                {t("tags") || "Tags"}
                <span className="text-[#3E3F29]/70 text-xs ml-2">
                  ({t("tags_hint") || "comma separated"})
                </span>
              </label>
              <input
                type="text"
                className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                value={form.tagsText}
                onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                placeholder="dance, festival, community"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold"
            >
              {editingId ? t("save_changes") : t("add_event")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] py-2 rounded-lg transition font-semibold"
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#7D8D86] text-[#3E3F29]">
                <th className="border border-[#BCA88D] p-2">{t("event_title")}</th>
                <th className="border border-[#BCA88D] p-2">{t("event_date")}</th>
                <th className="border border-[#BCA88D] p-2">{t("event_time")}</th>
                <th className="border border-[#BCA88D] p-2">{t("event_location")}</th>
                <th className="border border-[#BCA88D] p-2">{t("member_price")}</th>
                <th className="border border-[#BCA88D] p-2">{t("regular_price")}</th>
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
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-[#7D8D86]">
                    {t("no_upcoming_events") || "No events"}
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="text-center bg-[#F1F0E4]">
                    <td className="border border-[#BCA88D] p-2">{event.title}</td>
                    <td className="border border-[#BCA88D] p-2">{event.date || "-"}</td>
                    <td className="border border-[#BCA88D] p-2">{event.time || "-"}</td>
                    <td className="border border-[#BCA88D] p-2">{event.location || "-"}</td>
                    <td className="border border-[#BCA88D] p-2">
                      {event.memberPrice !== undefined && event.memberPrice !== null ? `€${event.memberPrice}` : "-"}
                    </td>
                    <td className="border border-[#BCA88D] p-2">
                      {event.regularPrice !== undefined && event.regularPrice !== null ? `€${event.regularPrice}` : "-"}
                    </td>
                    <td className="border border-[#BCA88D] p-2 flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => handleEditEventProxy(event)}
                        className="bg-blue-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-blue-600 transition"
                        title={t("edit")}
                      >
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-red-600 transition"
                        title={t("delete")}
                      >
                        {t("delete")}
                      </button>
                      {event.pdfUrl && (
                        <a
                          href={gview(event.pdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white border border-[#3E3F29]/20 px-2 py-1 rounded font-semibold hover:bg-[#F1F0E4] transition"
                          title={t("view_pdf")}
                        >
                          {t("view_pdf")}
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold"
        >
          {t("back_to_admin_panel")}
        </button>
      </div>
    </div>
  );

  function handleEditEventProxy(event) {
    handleEdit(event);
  }
}

export default AdminEvents;
