'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';

export default function KioskPage() {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState({ name: '', action: '', time: '' });
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // 1. Maintain permanent focus on the hidden input field for the USB HID reader
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 500);
    return () => clearInterval(focusInterval);
  }, []);

  // 2. Real-time Clock update
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Phnom_Penh', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { timeZone: 'Asia/Phnom_Penh', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cardId = inputVal.trim();
    setInputVal('');
    
    if (!cardId || status !== 'idle') return;

    setStatus('idle');
    
    // Retrieve employees array from local storage (acting as our db cache for the demo)
    const stored = localStorage.getItem('company_employees');
    const employees: any[] = stored ? JSON.parse(stored) : [];
    
    const emp = employees.find(e => e.nfc_serial === cardId);

    if (!emp) {
      setFeedback({ name: 'Unknown Card', action: 'Not registered in system', time: '' });
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    try {
      const res = await fetch('/api/attendance/kiosk', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ employeeCode: emp.code, name: emp.name })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setFeedback({ name: emp.name, action: data.action.toUpperCase(), time: data.time });
        setStatus('success');
      } else {
        setFeedback({ name: emp.name, action: 'Failed to record', time: '' });
        setStatus('error');
      }
    } catch (err) {
      setFeedback({ name: emp.name, action: 'Connection Error', time: '' });
      setStatus('error');
    }

    // Reset back to idle scan mode after a delay
    setTimeout(() => {
      setStatus('idle');
    }, 3500);
  };

  return (
    <div className="h-screen w-full bg-slate-900 flex flex-col items-center justify-center font-kantumruy overflow-hidden relative">
      {/* Hidden input for USB HID NFC Reader */}
      <form onSubmit={handleSubmit} className="opacity-0 absolute top-0 left-0 w-0 h-0 overflow-hidden">
        <input 
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
        />
      </form>

      {/* Header / Clock */}
      <div className="absolute top-12 left-0 w-full text-center space-y-2">
        <h1 className="text-6xl font-bold text-white tracking-wider font-mono">
          {currentTime || '00:00:00 AM'}
        </h1>
        <p className="text-xl text-slate-400">
          {currentDate || 'Loading...'}
        </p>
      </div>

      {/* Main Kiosk Display Area */}
      <div className="w-full max-w-2xl px-6">
        {status === 'idle' && (
          <div className="bg-slate-800/50 backdrop-blur-md rounded-[3rem] border border-slate-700/50 p-16 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-indigo-500/20 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-75"></div>
              <CreditCard className="w-16 h-16 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Please Tap Your Card</h2>
            <p className="text-slate-400 text-lg">Swipe your NFC or RFID card on the reader below</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-emerald-900/40 backdrop-blur-md rounded-[3rem] border border-emerald-500/30 p-16 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <CheckCircle className="w-24 h-24 text-emerald-400 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-2">{feedback.name}</h2>
            <div className="flex items-center gap-4 mt-6">
              <span className={`text-2xl font-bold px-6 py-2 rounded-2xl tracking-widest ${
                feedback.action === 'IN' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                CHECK {feedback.action}
              </span>
              <span className="text-xl text-emerald-100 font-mono bg-emerald-950/50 px-4 py-2 rounded-2xl">
                {feedback.time}
              </span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-rose-900/40 backdrop-blur-md rounded-[3rem] border border-rose-500/30 p-16 flex flex-col items-center justify-center animate-in zoom-in duration-300">
            <XCircle className="w-24 h-24 text-rose-400 mb-6" />
            <h2 className="text-4xl font-bold text-white mb-2">{feedback.name}</h2>
            <p className="text-xl text-rose-200 mt-2">{feedback.action}</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <p className="text-slate-500 font-medium tracking-wide flex items-center justify-center gap-2">
          SecureAttend Kiosk Terminal
        </p>
      </div>
    </div>
  );
}
