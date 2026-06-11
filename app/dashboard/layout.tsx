import Link from 'next/link';
import { LayoutDashboard, Users, CalendarCheck, Wallet, Settings, Bell, ChevronLeft, QrCode } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-kantumruy">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 via-indigo-950 to-violet-950 text-white hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <div className="w-6 h-6 border-4 border-indigo-600 rounded-full" />
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight">
            SecureAttend
          </Link>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'ទិដ្ឋភាពទូទៅ', path: '/dashboard', active: true },
            { icon: Users, label: 'បុគ្គលិក', path: '/dashboard/employees', active: false },
            { icon: CalendarCheck, label: 'របាយការណ៍វត្តមាន', path: '/dashboard/attendance', active: false },
            { icon: QrCode, label: 'QR Station / កូដ QR', path: '/dashboard/qr-station', active: false },
            { icon: Wallet, label: 'បញ្ជីប្រាក់ខែ', path: '/dashboard/payroll', active: false },
          ].map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg text-base font-medium transition-colors ${
                item.active 
                  ? 'bg-white/10 text-indigo-100' 
                  : 'text-indigo-200 hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="bg-indigo-800/40 p-4 rounded-xl border border-indigo-400/20 text-center">
            <div className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Tenant Account</div>
            <div className="font-semibold text-white">Tech Company M</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
           <div className="flex items-center md:hidden gap-3">
             <Link href="/" className="text-slate-500 hover:text-slate-700">
               <ChevronLeft className="w-5 h-5" />
             </Link>
             <span className="font-bold">SA Admin</span>
           </div>
           <div className="hidden md:flex items-center gap-4 text-slate-500 font-medium">
             <span>ទិដ្ឋភាពទូទៅ</span>
             <ChevronLeft className="w-4 h-4 rotate-180" />
             <span className="text-indigo-600">ថ្ងៃនេះ</span>
           </div>
           <div className="flex items-center gap-6">
             <div className="relative hidden sm:flex items-center text-slate-400">
               <svg className="w-5 h-5 absolute left-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
               </svg>
               <input type="text" placeholder="ស្វែងរក..." className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-indigo-500"/>
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-600 relative sm:hidden">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shrink-0">
               JD
             </div>
           </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
