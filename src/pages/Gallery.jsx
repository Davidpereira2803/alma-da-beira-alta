import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function Gallery() {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const imageList = querySnapshot.docs.map((doc) => doc.data());
      setImages(imageList);
    };
    fetchImages();
  }, []);

  return (
    <div className="bg-[#F1F0E4] min-h-screen w-full py-16 px-4 font-sans">
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-[#3E3F29] text-center mb-8">
          {t("gallery")}
        </h2>
        <div className="w-full h-2 bg-[#BCA88D] opacity-20 my-2" />

        {images.length === 0 ? (
          <p className="text-center text-[#7D8D86]">
            {t("no_images_available")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {images.map((img, index) => (
              <div
                key={index}
                className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl overflow-hidden flex flex-col items-center p-4 transition hover:scale-105"
              >
                <img
                  src={img.url}
                  alt={t("gallery_image_alt")}
                  className="w-full h-56 object-cover rounded-lg shadow"
                />
                {img.caption && (
                  <p className="mt-3 text-sm text-[#3E3F29] text-center font-medium">
                    {img.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Gallery;
