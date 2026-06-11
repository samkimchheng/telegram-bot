'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Nfc, User } from 'lucide-react';

type Employee = {
  id: string;
  code: string;
  name: string;
  department: string;
  nfc_serial?: string;
};

export default function AdminCardsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orgSecret, setOrgSecret] = useState('');
  const [tokens, setTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const data = localStorage.getItem('company_employees');
    if (data) {
      setTimeout(() => setEmployees(JSON.parse(data)), 0);
    }
    const secret = localStorage.getItem('office_qr_secret') || 'default-secret';
    setTimeout(() => setOrgSecret(secret), 0);
  }, []);
  
  useEffect(() => {
    const generateTokens = async () => {
      const newTokens: Record<string, string> = {};
      for (const emp of employees) {
        const msgBuffer = new TextEncoder().encode(emp.code + orgSecret);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        newTokens[emp.code] = hashHex.substring(0, 16);
      }
      setTokens(newTokens);
    };
    if (employees.length && orgSecret) {
      generateTokens();
    }
  }, [employees, orgSecret]);

  const handlePrint = () => {
    window.print();
  };

  const scanNFC = async (empId: string) => {
    try {
      if (!('NDEFReader' in window)) {
        alert('Web NFC is not supported on this device/browser. Please use Chrome on Android.');
        return;
      }
      // @ts-ignore
      const ndef = new NDEFReader();
      await ndef.scan();
      alert('Scanning started. Please bring the NFC tag close to your phone...');
      
      // @ts-ignore
      ndef.onreading = (event) => {
        const serialNumber = event.serialNumber;
        alert(`NFC Tag Linked: ${serialNumber}`);
        
        const updated = employees.map(e => e.id === empId ? { ...e, nfc_serial: serialNumber } : e);
        setEmployees(updated);
        localStorage.setItem('company_employees', JSON.stringify(updated));
        
        // Stop scanning after reading
        try { ndef.abort(); } catch(e) {}
      };
      
      // @ts-ignore
      ndef.onerror = (event) => {
        alert("Error reading NFC tag: " + event.message);
      };
    } catch (error: any) {
      alert("NFC Error: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-2xl font-bold text-slate-800">Employee ID Cards</h1>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <Printer className="w-5 h-5" /> Print All Cards
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => {
          const token = tokens[emp.code] || '';
          const qrData = `SECATT-EMP:${emp.code}:${token}`;

          return (
            <div key={emp.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden print:break-inside-avoid print:shadow-none print:border-slate-300">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-24 relative p-6">
                 <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-white font-bold text-sm tracking-wider">
                   {emp.code}
                 </div>
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-sm flex items-center justify-center text-slate-400 overflow-hidden">
                   <User className="w-10 h-10" />
                 </div>
              </div>
              <div className="pt-14 pb-8 px-6 text-center">
                 <h2 className="text-xl font-bold text-slate-800 mb-1">{emp.name}</h2>
                 <p className="text-slate-500 text-sm font-medium">{emp.department}</p>
                 
                 <div className="mt-6 flex justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   {token ? <QRCodeSVG value={qrData} size={120} level="H" /> : <div className="w-[120px] h-[120px] bg-slate-200 animate-pulse rounded-lg" />}
                 </div>

                 <div className="mt-6 pt-6 border-t border-slate-100 no-print">
                    {emp.nfc_serial ? (
                      <div className="text-sm text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl flex items-center justify-between">
                         <span className="flex items-center gap-1"><Nfc className="w-4 h-4" /> NFC Linked</span>
                         <span className="font-mono text-xs truncate max-w-[120px]">{emp.nfc_serial}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => scanNFC(emp.id)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-medium transition-all text-sm"
                      >
                        <Nfc className="w-4 h-4 text-indigo-500" /> Link NFC Tag
                      </button>
                    )}
                 </div>
              </div>
            </div>
          );
        })}
        {employees.length === 0 && (
           <div className="col-span-full py-12 text-center text-slate-500">
             No employees found to generate cards for. Add employees first.
           </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .max-w-6xl { max-w: none !important; margin: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 1cm; size: A4 portrait; }
        }
      `}} />
    </div>
  );
}
