'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { X, QrCode } from 'lucide-react';
import { useState } from 'react';

interface QRScannerProps {
  onScanSuccess: () => void;
  onScanError?: (error: Error) => void;
  onCancel: () => void;
}

export default function QRScanner({ onScanSuccess, onScanError, onCancel }: QRScannerProps) {
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  const handleScan = (result: string) => {
    // We expect the result to match what's in localStorage for office_qr_secret
    const storedSecret = localStorage.getItem('office_qr_secret');
    
    if (storedSecret && result === storedSecret) {
      onScanSuccess();
    } else {
      setErrorMSG('QR កូដមិនត្រឹមត្រូវ (Invalid Office QR Code)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-600" />
            ស្កេនកូដការិយាល័យ (Scan Office QR)
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative bg-black w-full aspect-square flex flex-col items-center justify-center">
          <Scanner 
            onScan={(result) => handleScan(result[0].rawValue)}
          />
        </div>

        <div className="p-6 flex flex-col items-center">
           <p className={`text-center font-medium text-sm ${errorMSG ? 'text-red-500' : 'text-slate-600'}`}>
            {errorMSG || 'សូមដាក់កាមេរ៉ាឱ្យចំកូដ QR របស់ការិយាល័យ'}
          </p>
        </div>
      </div>
    </div>
  );
}
