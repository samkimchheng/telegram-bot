'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ScanFace, QrCode, Fingerprint, CheckCircle2, ChevronLeft, CalendarClock } from 'lucide-react';
import Link from 'next/link';

type CheckInMethod = 'gps' | 'face' | 'qr' | 'nfc' | null;

export default function CheckInPage() {
  const [method, setMethod] = useState<CheckInMethod>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const methods = [
    { id: 'gps', icon: MapPin, title: 'GPS Geofencing', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'face', icon: ScanFace, title: 'AI Face Match', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { id: 'qr', icon: QrCode, title: 'QR Code', color: 'bg-violet-50 text-violet-600 border-violet-200' },
    { id: 'nfc', icon: Fingerprint, title: 'NFC Tag', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ] as const;

  const handleSimulateScan = (m: CheckInMethod) => {
    setMethod(m);
    setStatus('scanning');
    
    // Simulate API Call
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  useEffect(() => {
    if (method === 'gps' && navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
         setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
       });
    }
  }, [method]);

  return (
    <div className="min-h-screen bg-slate-50 font-kantumruy flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <Link href="/" className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
               <ChevronLeft className="w-5 h-5" />
             </Link>
             <div className="text-right">
               <p className="text-sm font-medium opacity-80">ព្រឹកនេះ</p>
               <h1 className="text-2xl font-bold font-inter tracking-tight">07:45 AM</h1>
             </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold opacity-90">សួស្តី, Sok Makara</h2>
            <p className="text-sm opacity-80">Tech Company M</p>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="methods"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-indigo-500" />
                  ជ្រើសរើសរបៀបកត់វត្តមាន
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSimulateScan(m.id)}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-md ${m.color}`}
                    >
                      <m.icon className="w-8 h-8" />
                      <span className="text-sm font-medium">{m.title}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {status === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75" />
                  {method === 'gps' && <MapPin className="w-10 h-10 text-indigo-600 animate-pulse" />}
                  {method === 'face' && <ScanFace className="w-10 h-10 text-indigo-600 animate-pulse" />}
                  {method === 'qr' && <QrCode className="w-10 h-10 text-indigo-600 animate-pulse" />}
                  {method === 'nfc' && <Fingerprint className="w-10 h-10 text-indigo-600 animate-pulse" />}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900">កំពុងផ្ទៀងផ្ទាត់...</h3>
                  <p className="text-sm text-slate-500 mt-1">សូមរង់ចាំបន្តិច</p>
                  {location && (
                    <p className="text-xs text-slate-400 mt-2 font-inter items-center justify-center">
                       Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">ជោគជ័យ!</h3>
                <p className="text-slate-500">វត្តមានរបស់អ្នកត្រូវបានកត់ត្រាចូលប្រព័ន្ធ។</p>
                
                <button 
                  onClick={() => { setStatus('idle'); setMethod(null); }}
                  className="mt-8 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition-colors"
                >
                  ត្រឡប់ក្រោយ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
