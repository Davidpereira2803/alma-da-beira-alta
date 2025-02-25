import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const QRCodeGenerator = ({ text }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (!text) {
      setQrCodeUrl("");
      return;
    }

    // Generate the QR Code based on the received text
    QRCode.toDataURL(text)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR Code:", err));
  }, [text]); // Regenerate QR Code when `text` changes

  return (
    <div className="flex flex-col items-center p-4">
      
      {/* Display the QR Code only if there's valid data */}
      {qrCodeUrl ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Generated QR Code:</h3>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      ) : (
        <p className="text-gray-500">Enter text to generate a QR code</p>
      )}
    </div>
  );
};

export default QRCodeGenerator;
