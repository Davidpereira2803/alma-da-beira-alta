import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import QRCodeGenerator from "../components/QR-Generator";

const QRPage = () => {
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));

      let foundRegistration = null;

      for (const eventDoc of eventsSnapshot.docs) {
        const eventId = eventDoc.id;
        const registrationsRef = collection(db, `events/${eventId}/registrations`);
        const registrationsSnapshot = await getDocs(registrationsRef);

        for (const regDoc of registrationsSnapshot.docs) {
          const regData = regDoc.data();

          if (regData.password === password) {
            foundRegistration = { ...regData, eventTitle: eventDoc.data().title || "Unknown Event" };
            break;
          }
        }

        if (foundRegistration) break;
      }

      if (foundRegistration) {
        setRegistration(foundRegistration);
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching QR Code:", err);
      setError("Error retrieving QR Code. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">Enter Password to View Your QR Code</h2>

      {!registration ? (
        <>
          <input
            type="password"
            placeholder="Enter Password"
            className="p-2 border rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleVerifyPassword}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Checking..." : "Submit"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {registration.name}</p>
          <p><strong>Event:</strong> {registration.eventTitle}</p>
          <QRCodeGenerator text={registration.qrCodeData} />
        </>
      )}
    </div>
  );
};

export default QRPage;
