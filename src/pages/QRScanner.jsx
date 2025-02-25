import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";


const QRScanner = () => {
  const { t } = useTranslation();

  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    initializeScanner();
    return () => scanner?.clear();
  }, []);

  const initializeScanner = () => {
    const newScanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    newScanner.render(
      async (decodedText) => {
        newScanner.clear();
        setError(null);

        try {
          const [name, eventId] = decodedText.trim().split(" - ");
          if (!name || !eventId) {
            setError("Invalid QR Code Format");
            return;
          }

          const eventRef = collection(db, `events/${eventId}/registrations`);
          const q = query(eventRef, where("name", "==", name));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            setScanResult({
              id: docSnap.id,
              name: docSnap.data().name,
              event: eventId,
              status: "Registered",
            });
          } else {
            setScanResult({ id: decodedText, status: "Not Registered" });
          }
        } catch (err) {
          console.error("Error fetching registration data:", err);
          setError("Error fetching registration data.");
        }
      },
      (err) => {
        console.warn(err);
      }
    );

    setScanner(newScanner);
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    initializeScanner();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Event Check-in - QR Scanner</h2>
      <div id="reader" className="w-full max-w-md"></div>

      {error && <p className="text-red-500">{error}</p>}
      {scanResult && (
        <div className="mt-4 p-4 w-full max-w-md">
          <div>
            <p><strong>Scanned QR Code:</strong> {scanResult.id}</p>
            {scanResult.status === "Registered" ? (
              <>
                <p><strong>Name:</strong> {scanResult.name}</p>
                <p><strong>Event:</strong> {scanResult.event}</p>
                <p className="text-green-500 font-bold">✅ {scanResult.status}</p>
              </>
            ) : (
              <p className="text-red-500 font-bold">❌ {scanResult.status}</p>
            )}
          </div>
        </div>
      )}
      <button onClick={resetScanner} className="mt-4 bg-gray-700 text-white px-4 py-2 rounded">Reset Scanner</button>
      <button
        onClick={() => window.history.back()}
        className="w-full mt-4 bg-stone-700 text-white py-2 rounded-lg hover:bg-stone-900 transition"
      >
        {t("back_to_admin_panel")}
      </button>
    </div>
  );
};

export default QRScanner;
