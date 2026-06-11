'use client';

import Link from 'next/link';
import { ArrowRight, Fingerprint, MapPin, QrCode, ScanFace, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const initTimer = () => {
       timer = setInterval(() => {
         setTime(new Date());
       }, 1000);
    };
    initTimer();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-brand-background flex flex-col font-kantumruy">
      {/* Header */}
      <header className="h-20 bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 flex items-center justify-between shadow-brand">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <div className="w-6 h-6 border-4 border-indigo-600 rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight font-inter">SecureAttend</span>
        </div>
        
        {/* Real-time Clock */}
        <div className="hidden sm:flex flex-col items-end">
          <div className="text-lg font-bold font-inter tracking-tight">
            {time ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
          </div>
          <div className="text-xs text-white/80 font-inter">
            {time ? time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '---'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-5xl mx-auto z-10 flex flex-col items-center">
          
          {/* Greeting Hero */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-brand-soft border border-indigo-50 w-full mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-brand-primary text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                <span className="tracking-wide">TECH COMPANY M</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                សួស្តី, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Sok Makara</span>!
              </h1>
              <p className="text-slate-500 text-lg sm:text-xl max-w-lg leading-relaxed">
                សូមស្វាគមន៍មកកាន់ប្រព័ន្ធគ្រប់គ្រងវត្តមាន។ តើអ្នកចង់ធ្វើអ្វីនៅថ្ងៃនេះ?
              </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
              <Link
                href="/activate"
                className="w-full md:w-64 px-6 py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-between group"
              >
                <span>ចូលកត់វត្តមានមុខងារ</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="w-full md:w-64 px-6 py-4 rounded-2xl bg-white text-slate-700 border-2 border-slate-100 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-between group"
              >
                <span>ផ្ទាំងគ្រប់គ្រង (Admin)</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors text-slate-500">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {[
              { icon: MapPin, title: 'Geofencing', desc: 'កំណត់ទីតាំង GPS ដាច់ខាត' },
              { icon: ScanFace, title: 'AI Face Match', desc: 'ផ្ទៀងផ្ទាត់មុខស្វ័យប្រវត្តិ' },
              { icon: QrCode, title: 'QR Code', desc: 'ស្កេនកូដពីទូរស័ព្ទដៃ' },
              { icon: Fingerprint, title: 'NFC Ready', desc: 'ស្កេនកាតឆ្លាតវៃ' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white hover:bg-white transition-colors hover:shadow-brand-soft">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-brand-primary mb-4 shadow-sm border border-indigo-100/50">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 text-center font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
