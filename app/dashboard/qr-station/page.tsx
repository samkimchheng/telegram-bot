'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, Download, Printer, QrCode as QrIcon, UserCheck } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

export default function QrStationPage() {
  const [secret, setSecret] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showEmployeeScanner, setShowEmployeeScanner] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateNewSecret = () => {
    const newSecret = uuidv4();
    setSecret(newSecret);
    localStorage.setItem('office_qr_secret', newSecret);
  };

  useEffect(() => {
    const storedSecret = localStorage.getItem('office_qr_secret');
    if (storedSecret) {
      setTimeout(() => setSecret(storedSecret), 0);
    } else {
      setTimeout(() => generateNewSecret(), 0);
    }
  }, []);

  useEffect(() => {
    if (secret) {
      QRCode.toDataURL(
        secret,
        {
          width: 400,
          margin: 2,
          color: {
            dark: '#1e1b4b', // indigo-950
            light: '#ffffff',
          },
        },
        (err, url) => {
          if (!err) {
            setQrDataUrl(url);
            // Draw onto canvas for print/download fallback if needed
            if (canvasRef.current) {
              QRCode.toCanvas(canvasRef.current, secret, { width: 400, margin: 2, color: { dark: '#1e1b4b', light: '#ffffff' } });
            }
          }
        }
      );
    }
  }, [secret]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'Office_CheckIn_QR.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Office QR</title>
            <style>
              body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
              img { max-width: 80%; }
              h1 { color: #333; }
            </style>
          </head>
          <body>
            <h1>Office Check-In QR</h1>
            <img src="${qrDataUrl}" />
            <p>Scan this using your SecureAttend app to check in/out.</p>
            <script>
              window.onload = () => { window.print(); window.close(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleScanEmployee = async (result?: string) => {
    setShowEmployeeScanner(false);
    if (!result) return;
    
    // Result format expected: SECATT-EMP:EMP-001:abcd1234abcd1234
    const parts = result.split(':');
    if (parts.length === 3 && parts[0] === 'SECATT-EMP') {
      const code = parts[1];
      const token = parts[2];
      
      // Verify token
      const msgBuffer = new TextEncoder().encode(code + secret);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const expectedToken = hashHex.substring(0, 16);
      
      if (token === expectedToken) {
        // Record Check-in for this employee
        try {
          await fetch('/api/check-in', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               employeeCode: code,
               action: 'in', // Assume check-in or simple scan
               method: 'kiosk',
               location: { lat: 0, lng: 0 }
             })
          });
          alert(`Successfully authenticated. Checked in: ${code}`);
        } catch (e) {
          alert('Failed to check in.');
        }
      } else {
        alert('Invalid or forged employee card!');
      }
    } else {
      alert('Unrecognized QR format.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col font-kantumruy space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">ស្ថានីយ៍ស្កេន QR (Office QR Station)</h1>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-auto min-h-[500px]">
        
        {/* Left Side: Setup & info */}
        <div className="p-8 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
            <QrIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Office QR Code</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            នេះគឺជា QR Code ផ្លូវការសម្រាប់ស្កេនវត្តមានប្រចាំការិយាល័យ។ អ្នកអាចព្រីន (Print) ឬដាក់បង្ហាញលើអេក្រង់។
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold transition-all hover:bg-slate-50"
            >
              <Printer className="w-5 h-5" />
              ព្រីនកូដ (Print)
            </button>
            <button 
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold transition-all hover:bg-slate-50"
            >
              <Download className="w-5 h-5" />
              ទាញយករូបភាព (Download PNG)
            </button>
            <div className="pt-4 border-t border-slate-200 mt-4">
              <button 
                onClick={generateNewSecret}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-all mb-4"
              >
                <RefreshCw className="w-5 h-5" />
                ប្តូរកូដថ្មី (Regenerate Secret)
              </button>
              
              <button 
                onClick={() => setShowEmployeeScanner(true)}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-slate-800 text-white hover:bg-slate-900 rounded-xl font-bold transition-all shadow-md"
              >
                <UserCheck className="w-5 h-5" />
                Kiosk Mode: Scan Employee ID
              </button>

              <p className="text-xs text-slate-400 mt-4 text-center">
                សម្គាល់៖ ការប្តូរកូដថ្មីនឹងធ្វើឱ្យ QR ចាស់លែងមានសុពលភាព។
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: QR Display */}
        <div className="p-8 md:w-1/2 flex items-center justify-center bg-white relative">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 flex flex-col items-center">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Office QR Code" className="w-64 h-64 md:w-80 md:h-80" />
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
                <QrIcon className="w-12 h-12" />
              </div>
            )}
            {/* Hidden canvas for direct drawing if needed -> kept transparent */}
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-md max-w-[250px] truncate">
                ID: {secret}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {showEmployeeScanner && (
        <QRScanner 
          mode="employee"
          onScanSuccess={handleScanEmployee}
          onCancel={() => setShowEmployeeScanner(false)}
        />
      )}
    </div>
  );
}
