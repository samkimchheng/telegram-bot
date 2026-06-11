import Link from 'next/link';
import { ArrowRight, Fingerprint, MapPin, QrCode, ScanFace } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden font-kantumruy">
      {/* Background Gradient Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10 w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          ប្រព័ន្ធគ្រប់គ្រងវត្តមានទំនើប
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            SecureAttend
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          ប្រព័ន្ធគ្រប់គ្រងវត្តមាន និងប្រាក់ខែពហុស្ថាប័ន (Multi-tenant)។ គាំទ្រការស្កេនមុខ GPS, QR, និង NFC សម្រាប់ក្រុមហ៊ុន និងសាលារៀន។
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/check-in"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            ចូលកត់វត្តមានមុខងារ (Check-in)
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 border border-slate-200 font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            ផ្ទាំងគ្រប់គ្រង (Admin)
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: MapPin, title: 'Geofencing', desc: 'កំណត់ទីតាំង GPS ដាច់ខាត' },
            { icon: ScanFace, title: 'AI Face Match', desc: 'ផ្ទៀងផ្ទាត់មុខស្វ័យប្រវត្តិ' },
            { icon: QrCode, title: 'QR Code', desc: 'ស្កេនកូដពីទូរស័ព្ទដៃ' },
            { icon: Fingerprint, title: 'NFC Ready', desc: 'ស្កេនកាតឆ្លាតវៃ' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
