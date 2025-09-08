import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminGallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const querySnapshot = await getDocs(collection(db, "gallery"));
    const imageList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setImages(imageList);
  };

  const convertToRawGitHubUrl = (url) => {
    if (url.includes("github.com") && url.includes("/blob/")) {
      return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return url;
  };

  const handleAddImage = async () => {
    if (!imageUrl) return alert(t("enter_image_url"));

    const rawUrl = convertToRawGitHubUrl(imageUrl);

    await addDoc(collection(db, "gallery"), { url: rawUrl });
    setImageUrl("");
    fetchImages();
  };

  const handleDeleteImage = async (id) => {
    await deleteDoc(doc(db, "gallery", id));
    fetchImages();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F1F0E4] p-6">
      <div className="w-full max-w-xl bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-4">
          {t("manage_gallery")}
        </h2>

        <div className="mb-4">
          <label className="block text-[#3E3F29] font-medium mb-1">
            {t("image_url")}
          </label>
          <input
            type="text"
            placeholder={t("enter_image_url")}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
          />
        </div>

        <button
          className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition mb-3 font-semibold"
          onClick={handleAddImage}
        >
          {t("add_image")}
        </button>

        <h3 className="text-xl font-semibold text-center mt-4 text-[#3E3F29]">
          {t("gallery_images")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((img) => (
            <div key={img.id} className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow rounded-lg overflow-hidden">
              <img src={img.url} alt={t("gallery_image_alt")} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-2 text-center">
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition font-semibold"
                  onClick={() => handleDeleteImage(img.id)}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          ))}
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
}

export default AdminGallery;
