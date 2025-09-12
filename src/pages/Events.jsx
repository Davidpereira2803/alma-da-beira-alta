import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";

function toDate(dateField, timeField) {
  if (!dateField) return null;

  if (typeof dateField === "object" && dateField.seconds) {
    return new Date(dateField.seconds * 1000);
  }

  if (typeof dateField === "string") {
    if (timeField && /^\d{1,2}:\d{2}$/.test(timeField)) {
      const [h, m] = timeField.split(":").map(Number);
      const d = new Date(dateField);
      if (!isNaN(d)) {
        d.setHours(h ?? 0, m ?? 0, 0, 0);
        return d;
      }
    }
    const d = new Date(dateField);
    return isNaN(d) ? null : d;
  }

  if (typeof dateField === "number") return new Date(dateField);

  return null;
}

export default function Events() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "events"));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => {
          const data = d.data();
          const date = toDate(data.date, data.time);
          return {
            id: d.id,
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            date,
            rawDate: data.date,
            time: data.time || "",
            pdfUrl: data.pdfUrl || data.pdf || "",
            backgroundImage:
              data.backgroundImage || data.backgroundImageUrl || data.image || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            price: data.price,
            registrationUrl: data.registrationUrl || "",
          };
        });

        list.sort((a, b) => (a.date?.getTime?.() || 0) - (b.date?.getTime?.() || 0));
        setEvents(list);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const locale = i18n.language || undefined;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const years = useMemo(() => {
    const ys = new Set(events.map((e) => e.date?.getFullYear?.()).filter(Boolean));
    return ["all", ...Array.from(ys).sort((a, b) => b - a)];
  }, [events]);

  const months = useMemo(() => {
    const ms = new Set(
      events
        .map((e) => (e.date ? e.date.getMonth() + 1 : null))
        .filter(Boolean)
    );
    return ["all", ...Array.from(ms).sort((a, b) => a - b)];
  }, [events]);

  const filtered = useMemo(() => {
    let list = events;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          (e.tags || []).some((tg) => String(tg).toLowerCase().includes(q))
      );
    }

    if (year !== "all") {
      list = list.filter((e) => e.date && e.date.getFullYear() === Number(year));
    }
    if (month !== "all") {
      list = list.filter((e) => e.date && e.date.getMonth() + 1 === Number(month));
    }

    return list;
  }, [events, search, month, year]);

  const upcomingEvents = filtered
    .filter((e) => e.date && e.date >= todayStart)
    .sort((a, b) => (a.date?.getTime?.() || 0) - (b.date?.getTime?.() || 0));

  const pastEvents = filtered
    .filter((e) => e.date && e.date < todayStart)
    .sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0));

  const fmtDate = (d) =>
    d
      ? d.toLocaleDateString(locale, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const fmtTime = (tStr) => {
    if (!tStr) return "";
    const [h, m] = tStr.split(":").map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      const temp = new Date();
      temp.setHours(h, m, 0, 0);
      return temp.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    }
    return tStr;
  };

  const handleViewPdf = (pdfUrl) => {
    if (!pdfUrl) return;
    setSelectedPdf(
      `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`
    );
    setShowModal(true);
  };

  const resetFilters = () => {
    setSearch("");
    setMonth("all");
    setYear("all");
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen">
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImg} alt="Events hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3E3F29]/80 via-[#3E3F29]/50 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center hero-safe-top">
          <p className="text-[#F1F0E4]/80 text-xs md:text-sm uppercase tracking-widest">
            {t("events")}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            {t("events_page_title") || "Our Events"}
          </h1>
          <p className="text-[#F1F0E4]/90 mt-2 max-w-2xl">
            {t("events_page_subtitle") ||
              "Join our cultural celebrations, performances, and community gatherings."}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid gap-4 md:grid-cols-12 items-center">
          <div className="md:col-span-6">
            <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-4">
              <svg width="18" height="18" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                className="flex-1 h-10 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
                placeholder={t("search_events") || "Search events..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-6 flex gap-2 md:justify-end">
            <select
              className="h-10 px-3 rounded-full text-sm bg-white border border-[#3E3F29]/20"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label={t("month") || "Month"}
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m === "all"
                    ? t("month_all") || "All months"
                    : new Date(2000, Number(m) - 1, 1).toLocaleString(locale, {
                        month: "long",
                      })}
                </option>
              ))}
            </select>

            <select
              className="h-10 px-3 rounded-full text-sm bg-white border border-[#3E3F29]/20"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label={t("year") || "Year"}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === "all" ? t("year_all") || "All years" : y}
                </option>
              ))}
            </select>

            <button
              className="h-10 px-4 rounded-full text-sm bg-[#F1F0E4] border border-[#BCA88D]/40 hover:bg-white transition"
              onClick={resetFilters}
            >
              {t("clear_filters") || "Clear"}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">
            {t("upcoming_events") || "Upcoming events"}
          </h3>
          <div className="w-full h-2 bg-[#BCA88D] opacity-20 my-2" />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-[#e9e7d9] animate-pulse" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-[#7D8D86]">{t("no_upcoming_events") || "No upcoming events"}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-[#F1F0E4] rounded-xl shadow p-0 border-t-4 border-[#BCA88D] flex flex-col overflow-hidden"
                >
                  {event.backgroundImage && (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.backgroundImage})` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 text-[#3E3F29] font-serif">
                      {event.title}
                    </h4>
                    <p className="text-sm text-[#7D8D86] mb-1">
                      {t("event_date")}: {fmtDate(event.date)}
                    </p>
                    {event.time && (
                      <p className="text-sm text-[#7D8D86] mb-1">
                        {t("event_time")}: {fmtTime(event.time)}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-[#7D8D86] mb-2">
                        {t("event_location")}: {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="mb-4 text-[#3E3F29]">{event.description}</p>
                    )}
                    <div className="flex gap-3 mt-auto">
                      {event.pdfUrl && (
                        <button
                          onClick={() => handleViewPdf(event.pdfUrl)}
                          className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("view_brochure")}
                        </button>
                      )}
                      {event.pdfUrl && (
                        <a
                          href={event.pdfUrl}
                          download
                          className="bg-[#7D8D86] hover:bg-[#BCA88D] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("download_pdf")}
                        </a>
                      )}
                      {event.registrationUrl && (
                        <a
                          href={event.registrationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#3E3F29] hover:bg-[#7D8D86] text-white py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("register") || "Register"}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">
            {t("past_events") || "Past events"}
          </h3>
          <div className="w-full h-2 bg-[#BCA88D] opacity-20 my-2" />
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-[#e9e7d9] animate-pulse" />
              ))}
            </div>
          ) : pastEvents.length === 0 ? (
            <p className="text-[#7D8D86]">{t("no_past_events") || "No past events"}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="bg-[#F1F0E4] rounded-xl shadow p-0 border-t-4 border-[#BCA88D] flex flex-col overflow-hidden opacity-95"
                >
                  {event.backgroundImage && (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.backgroundImage})` }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 text-[#3E3F29] font-serif">
                      {event.title}
                    </h4>
                    <p className="text-sm text-[#7D8D86] mb-1">
                      {t("event_date")}: {fmtDate(event.date)}
                    </p>
                    {event.location && (
                      <p className="text-sm text-[#7D8D86] mb-2">
                        {t("event_location")}: {event.location}
                      </p>
                    )}
                    {event.description && (
                      <p className="mb-4 text-[#3E3F29]">{event.description}</p>
                    )}
                    <div className="flex gap-3 mt-auto">
                      {event.pdfUrl && (
                        <button
                          onClick={() => handleViewPdf(event.pdfUrl)}
                          className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("view_brochure")}
                        </button>
                      )}
                      {event.pdfUrl && (
                        <a
                          href={event.pdfUrl}
                          download
                          className="bg-[#7D8D86] hover:bg-[#BCA88D] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("download_pdf")}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 z-50">
          <div className="bg-[#F1F0E4] p-6 rounded-xl shadow-lg max-w-3xl w-full relative border-t-4 border-[#BCA88D]">
            <button
              className="absolute top-3 right-3 text-[#7D8D86] hover:text-[#3E3F29] text-2xl"
              onClick={() => setShowModal(false)}
              aria-label={t("close") || "Close"}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-[#3E3F29] font-serif">
              {t("event_pdf_brochure")}
            </h3>
            <div>
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  width="100%"
                  height="500px"
                  className="border-none rounded"
                  title="PDF Preview"
                />
              ) : (
                <p className="text-[#7D8D86]">{t("no_brochure_available")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
