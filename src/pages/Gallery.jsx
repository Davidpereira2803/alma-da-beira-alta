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
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-6">{t("gallery")}</h2>

      {images.length === 0 ? (
        <p className="text-center text-gray-600">{t("no_images_available")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div key={index} className="shadow-lg rounded-lg overflow-hidden">
              <img
                src={img.url}
                alt={t("gallery_image_alt")}
                className="w-full h-60 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
