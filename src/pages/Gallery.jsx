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
    <div className="w-full py-10 px-4">
      <h2 className="text-3xl font-serif font-bold text-center mb-8">
        {t("gallery")}
      </h2>

      {images.length === 0 ? (
        <p className="text-center text-gray-600">
          {t("no_images_available")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-[#B6AA84] shadow-lg rounded-xl overflow-hidden flex flex-col items-center p-3 transition hover:scale-105"
            >
              <img
                src={img.url}
                alt={t("gallery_image_alt")}
                className="w-full h-56 object-cover rounded-lg shadow"
              />
              {img.caption && (
                <p className="mt-2 text-sm text-gray-800 text-center">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
