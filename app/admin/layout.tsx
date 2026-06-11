'use client';

import { useState, useEffect } from 'react';
import { Users, QrCode, MessageCircle, Settings, LogOut, ArrowRight, CalendarCheck, Wallet, Badge, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      if (sessionStorage.getItem('admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    }, 0);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      router.push('/admin/system');
    } else {
      alert('Incorrect password. Try "admin123"');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-kantumruy p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 w-full max-w-md">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 mx-auto">
            <Settings className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Admin Access</h1>
          <p className="text-slate-500 text-center mb-8">Please login to access the dashboard</p>
          <form onSubmit={handleLogin} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                 placeholder="••••••••"
               />
             </div>
             <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all">
               Login <ArrowRight className="w-5 h-5" />
             </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: TrendingUp },
    { name: 'Admin Kiosk / Manual Entry', href: '/admin/manual', icon: Users },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'ID Cards & NFC', href: '/admin/cards', icon: Badge },
    { name: 'Timesheet & Schedule', href: '/admin/timesheet', icon: CalendarCheck },
    { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { name: 'Payroll', href: '/admin/payroll', icon: Wallet },
    { name: 'QR Station', href: '/admin/qr', icon: QrCode },
    { name: 'Telegram', href: '/admin/telegram', icon: MessageCircle },
    { name: 'System Options', href: '/admin/system', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-kantumruy">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 h-screen">
        {children}
      </main>
    </div>
  );
}
