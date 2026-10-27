import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScanSuccess(decodedText);
      },
      (error) => {
        // Ignore errors during scanning
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Scan Customer QR Code</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div id="qr-reader" className="w-full"></div>
          <p className="text-center text-xs text-text-muted mt-4">Point the camera at the customer's QR code.</p>
        </div>
      </div>
    </div>
  );
}