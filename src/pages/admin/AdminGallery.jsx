import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";

function normalizeDate(d) {
  if (!d) return null;
  if (typeof d === "object" && d.seconds) return new Date(d.seconds * 1000);
  if (typeof d === "string" || typeof d === "number") return new Date(d);
  return null;
}

export default function AdminGallery() {
  const { t } = useTranslation();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ url: "", title: "", description: "", tagsText: "" });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, "gallery"), orderBy("uploadedAt", "desc")));
      } catch {
        snap = await getDocs(collection(db, "gallery"));
      }
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          url: data.url,
          title: data.title || "",
          description: data.description || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          uploadedAt: normalizeDate(data.uploadedAt),
        };
      });
      list.sort((a, b) => (b.uploadedAt?.getTime?.() || 0) - (a.uploadedAt?.getTime?.() || 0));
      setImages(list);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.tags || []).some((tg) => String(tg).toLowerCase().includes(q)) ||
        (i.url || "").toLowerCase().includes(q)
    );
  }, [images, search]);

  function convertToRawGitHubUrl(input) {
    if (!input) return "";
    let url = input.trim();
    if (url.includes("github.com") && url.includes("/blob/")) {
      url = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return url;
  }

  async function handleAdd() {
    if (!url.trim()) return alert(t("enter_image_url") || "Enter image URL");
    const rawUrl = convertToRawGitHubUrl(url);
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await addDoc(collection(db, "gallery"), {
      url: rawUrl,
      title: title.trim(),
      description: description.trim(),
      tags,
      uploadedAt: serverTimestamp(),
    });
    setUrl("");
    setTitle("");
    setDescription("");
    setTagsText("");
    await fetchImages();
    alert(t("added_success") || "Image added.");
  }

  function startEdit(img) {
    setEditingId(img.id);
    setEditData({
      url: img.url || "",
      title: img.title || "",
      description: img.description || "",
      tagsText: (img.tags || []).join(", "),
    });
  }

  async function saveEdit() {
    const id = editingId;
    if (!id) return;
    const ref = doc(db, "gallery", id);
    const tags = editData.tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await updateDoc(ref, {
      url: convertToRawGitHubUrl(editData.url),
      title: editData.title.trim(),
      description: editData.description.trim(),
      tags,
    });
    setEditingId(null);
    await fetchImages();
    alert(t("updated_success") || "Image updated.");
  }

  async function handleDelete(id) {
    if (!window.confirm(t("confirm_delete_image") || "Delete this image?")) return;
    await deleteDoc(doc(db, "gallery", id));
    await fetchImages();
    alert(t("deleted_success") || "Image deleted.");
  }

  async function copyUrl(u) {
    try {
      await navigator.clipboard.writeText(u);
      alert(t("url_copied") || "URL copied!");
    } catch {
    }
  }

  const fmtDate = (d) =>
    d ? d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : t("unknown") || "Unknown";

  return (
    <AdminLayout
      title={t("manage_gallery")}
      description={t("manage_gallery_hint") || "Add, edit or remove images displayed on the Gallery page."}
    >
      <div className="bg-white rounded-2xl shadow border-t-4 border-[#BCA88D] p-4 md:p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#3E3F29] mb-1">
              {t("image_url") || "Image URL"}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t("enter_image_url") || "Enter image URL"}
              className="w-full h-10 px-3 rounded-lg border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-[#3E3F29] mb-1">
              {t("image_title") || "Title"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("image_title") || "Title"}
              className="w-full h-10 px-3 rounded-lg border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#3E3F29] mb-1">
              {t("image_description") || "Description"}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("image_description") || "Description"}
              className="w-full min-h-20 px-3 py-2 rounded-lg border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#3E3F29] mb-1">
              {t("tags") || "Tags"}
              <span className="text-[#7D8D86] ml-2 text-xs">
                ({t("tags_hint") || "comma separated"})
              </span>
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="dance, festival, community"
              className="w-full h-10 px-3 rounded-lg border border-[#BCA88D]/60 focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAdd}
            className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] font-semibold px-5 h-11 rounded-full shadow"
          >
            {t("add_image") || "Add image"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-4">
          <svg width="18" height="18" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            className="flex-1 h-10 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
            placeholder={t("search_images") || "Search images..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-xl bg-[#e9e7d9] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map((img) => {
            const inEdit = editingId === img.id;
            return (
              <div
                key={img.id}
                className="bg-white border-t-4 border-[#BCA88D] rounded-xl shadow overflow-hidden flex flex-col"
              >
                <img
                  src={inEdit ? editData.url : img.url}
                  alt={img.title || t("gallery_image_alt") || "Gallery image"}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-4 flex-1 flex flex-col gap-2">
                  {!inEdit ? (
                    <>
                      <div className="font-semibold text-[#3E3F29] line-clamp-2">
                        {img.title || t("featured_moment") || "Featured Moment"}
                      </div>
                      <div className="text-xs text-[#7D8D86]">{fmtDate(img.uploadedAt)}</div>
                      {img.description && (
                        <p className="text-sm text-[#3E3F29] line-clamp-3">{img.description}</p>
                      )}
                      {img.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {img.tags.map((tg) => (
                            <span
                              key={tg}
                              className="px-2 h-7 inline-flex items-center rounded-full text-xs bg-[#F1F0E4] border border-[#BCA88D]/40 text-[#3E3F29]"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        className="h-10 px-3 rounded-lg border border-[#BCA88D]/60"
                        value={editData.url}
                        onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                        placeholder={t("image_url") || "Image URL"}
                      />
                      <input
                        className="h-10 px-3 rounded-lg border border-[#BCA88D]/60"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder={t("image_title") || "Title"}
                      />
                      <textarea
                        className="min-h-20 px-3 py-2 rounded-lg border border-[#BCA88D]/60"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        placeholder={t("image_description") || "Description"}
                      />
                      <input
                        className="h-10 px-3 rounded-lg border border-[#BCA88D]/60"
                        value={editData.tagsText}
                        onChange={(e) => setEditData({ ...editData, tagsText: e.target.value })}
                        placeholder="dance, festival, community"
                      />
                    </>
                  )}

                  <div className="mt-auto flex gap-2 pt-2">
                    {!inEdit ? (
                      <>
                        <button
                          className="flex-1 h-10 rounded-full bg-[#BCA88D] text-[#3E3F29] font-semibold hover:bg-[#7D8D86] transition"
                          onClick={() => startEdit(img)}
                        >
                          {t("edit") || "Edit"}
                        </button>
                        <button
                          className="flex-1 h-10 rounded-full bg-white border border-red-200 text-red-700 hover:bg-red-50 transition"
                          onClick={() => handleDelete(img.id)}
                        >
                          {t("delete") || "Delete"}
                        </button>
                        <button
                          className="h-10 px-4 rounded-full bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] transition"
                          onClick={() => copyUrl(img.url)}
                          title={t("copy_url") || "Copy URL"}
                        >
                          {t("copy_url") || "Copy URL"}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="flex-1 h-10 rounded-full bg-[#3E3F29] text-white font-semibold hover:bg-[#7D8D86] transition"
                          onClick={saveEdit}
                        >
                          {t("save") || "Save"}
                        </button>
                        <button
                          className="flex-1 h-10 rounded-full bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] transition"
                          onClick={() => setEditingId(null)}
                        >
                          {t("cancel") || "Cancel"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => window.history.back()}
        className="w-full mt-6 bg-[#BCA88D] text-[#3E3F29] py-3 rounded-full shadow hover:bg-[#7D8D86] transition font-semibold"
      >
        {t("back_to_admin_panel")}
      </button>
    </AdminLayout>
  );
}
