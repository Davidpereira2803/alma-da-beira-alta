import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";

function normalizeDate(d) {
  if (!d) return null;
  if (typeof d === "object" && d.seconds) return new Date(d.seconds * 1000);
  if (typeof d === "string" || typeof d === "number") return new Date(d);
  return null;
}

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("all");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(12);

  const [active, setActive] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "gallery"), orderBy("uploadedAt", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => {
          const data = d.data();
          const date = normalizeDate(data.uploadedAt || data.date);
          return {
            id: d.id,
            url: data.url,
            title: data.title || "",
            description: data.description || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            uploadedAt: date,
          };
        });
        list.sort((a, b) => (b.uploadedAt?.getTime?.() || 0) - (a.uploadedAt?.getTime?.() || 0));
        setImages(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const years = useMemo(() => {
    const ys = new Set(
      images
        .map((img) => img.uploadedAt?.getFullYear?.())
        .filter((y) => !!y)
    );
    return ["all", ...Array.from(ys).sort((a, b) => b - a)];
  }, [images]);

  const tags = useMemo(() => {
    const ts = new Set(images.flatMap((i) => i.tags || []));
    return ["all", ...Array.from(ts).sort()];
  }, [images]);

  const filtered = useMemo(() => {
    let list = images;

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    }
    if (tag !== "all") {
      list = list.filter((i) => (i.tags || []).map((x) => String(x).toLowerCase()).includes(tag.toLowerCase()));
    }
    if (year !== "all") {
      list = list.filter((i) => i.uploadedAt && i.uploadedAt.getFullYear() === Number(year));
    }
    list = [...list].sort((a, b) => {
      const at = a.uploadedAt?.getTime?.() || 0;
      const bt = b.uploadedAt?.getTime?.() || 0;
      return sort === "newest" ? bt - at : at - bt;
    });

    return list;
  }, [images, search, tag, year, sort]);

  const visibleItems = filtered.slice(0, visible);

  const resetFilters = () => {
    setSearch("");
    setTag("all");
    setYear("all");
    setSort("newest");
    setVisible(12);
  };

  const locale = i18n.language || undefined;
  const fmtDate = (d) =>
    d
      ? d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
      : "";

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert(t("link_copied") || "Link copied!");
    } catch {
    }
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen">
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={heroImg} alt="Gallery hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3E3F29]/80 via-[#3E3F29]/50 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center hero-safe-top">
          <p className="text-[#F1F0E4]/80 text-xs md:text-sm uppercase tracking-widest">
            {t("gallery") || "Gallery"}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            {t("gallery_page_title") || "Our Photo Gallery"}
          </h1>
          <p className="text-[#F1F0E4]/90 mt-2 max-w-2xl">
            {t("gallery_page_subtitle") ||
              "Explore photos from our events, dances, and community moments."}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid gap-4 md:grid-cols-12 items-center">
          <div className="md:col-span-5">
            <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-4">
              <svg width="18" height="18" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                className="flex-1 h-10 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
                placeholder={t("search_photos") || "Search photos..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {tags.map((tg) => (
                <button
                  key={tg}
                  className={`px-4 h-10 rounded-full text-sm border transition whitespace-nowrap ${
                    (tag === tg) ? "bg-[#3E3F29] text-white border-[#3E3F29]" : "bg-white text-[#3E3F29] border-[#3E3F29]/20 hover:border-[#BCA88D]"
                  }`}
                  onClick={() => {
                    setTag(tg);
                    setVisible(12);
                  }}
                >
                  {tg === "all" ? (t("filter_all") || "All") : tg}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex gap-2 justify-end">
            <select
              className="h-10 px-3 rounded-full text-sm bg-white border border-[#3E3F29]/20"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setVisible(12);
              }}
              aria-label={t("year") || "Year"}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === "all" ? (t("year_all") || "All years") : y}
                </option>
              ))}
            </select>
            <select
              className="h-10 px-3 rounded-full text-sm bg-white border border-[#3E3F29]/20"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label={t("sort") || "Sort"}
            >
              <option value="newest">{t("newest") || "Newest"}</option>
              <option value="oldest">{t("oldest") || "Oldest"}</option>
            </select>
            <button
              className="h-10 px-4 rounded-full text-sm bg-[#F1F0E4] border border-[#BCA88D]/40 hover:bg-white transition"
              onClick={resetFilters}
            >
              {t("clear_filters") || "Clear"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-[#e9e7d9] animate-pulse" />
            ))}

          {!loading &&
            visibleItems.map((img) => (
              <button
                key={img.id}
                className="group relative rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                onClick={() => setActive(img)}
                title={img.title || "Photo"}
              >
                <img
                  src={img.url}
                  alt={img.title || "Gallery image"}
                  className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                {(img.title || img.uploadedAt) && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                      <div className="text-sm font-semibold text-[#3E3F29] line-clamp-1">
                        {img.title || t("featured_moment") || "Featured Moment"}
                      </div>
                      {img.uploadedAt && (
                        <div className="text-xs text-[#7D8D86]">{fmtDate(img.uploadedAt)}</div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-[#3E3F29] mb-3">
              {t("no_gallery_images") || "Gallery Coming Soon"}
            </h3>
            <p className="text-[#7D8D86]">
              {t("no_images_description") ||
                "We're collecting beautiful moments from our events and activities. Check back soon!"}
            </p>
          </div>
        )}

        {!loading && filtered.length > visible && (
          <div className="text-center mt-8">
            <button
              className="px-8 py-3 rounded-full bg-[#BCA88D] text-white font-semibold hover:bg-[#7D8D86] transition"
              onClick={() => setVisible((v) => v + 12)}
            >
              {t("load_more") || "Load more"}
            </button>
          </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black">
              <img
                src={active.url}
                alt={active.title || "Photo"}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <button
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 text-[#3E3F29] hover:bg-white shadow flex items-center justify-center"
                onClick={() => setActive(null)}
                aria-label={t("close") || "Close"}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-6 grid md:grid-cols-5 gap-4 items-start">
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold text-[#3E3F29]">{active.title || t("featured_moment")}</h3>
                {active.uploadedAt && (
                  <div className="text-sm text-[#7D8D86]">{fmtDate(active.uploadedAt)}</div>
                )}
                {active.description && (
                  <p className="mt-3 text-[#3E3F29]">{active.description}</p>
                )}
                {active.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {active.tags.map((tg) => (
                      <span
                        key={tg}
                        className="px-3 h-8 inline-flex items-center rounded-full text-xs bg-[#F1F0E4] border border-[#BCA88D]/40 text-[#3E3F29]"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 flex md:justify-end gap-2">
                <a
                  className="flex-1 md:flex-none px-4 h-10 inline-flex items-center justify-center rounded-full bg-[#3E3F29] text-white hover:bg-[#7D8D86] transition"
                  href={active.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("download") || "Download"}
                </a>
                <button
                  className="flex-1 md:flex-none px-4 h-10 inline-flex items-center justify-center rounded-full bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] transition"
                  onClick={() => copyLink(active.url)}
                >
                  {t("copy_link") || "Copy link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
