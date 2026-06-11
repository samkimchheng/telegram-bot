'use client';

import { useState, useEffect } from 'react';
import { Users, QrCode, MessageCircle, Settings, CalendarCheck, Wallet, Badge, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminIndexPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    // Quick mock data loading for the admin dashboard demo
    const data = localStorage.getItem('company_employees');
    const employees = data ? JSON.parse(data) : [];
    
    setTimeout(() => {
      setStats({
        totalEmployees: employees.length || 24,
        presentToday: Math.floor((employees.length || 24) * 0.8),
        lateToday: 2,
        absentToday: Math.floor((employees.length || 24) * 0.2) - 2,
      });
    }, 0);
  }, []);

  const metrics = [
    { label: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'bg-blue-500', href: '/admin/employees' },
    { label: 'Present Today', value: stats.presentToday, icon: TrendingUp, color: 'bg-emerald-500', href: '/admin/attendance' },
    { label: 'Late Today', value: stats.lateToday, icon: Clock, color: 'bg-amber-500', href: '/admin/attendance' },
    { label: 'Absent Today', value: stats.absentToday, icon: CalendarCheck, color: 'bg-rose-500', href: '/admin/attendance' },
  ];

  const quickLinks = [
    { name: 'Kiosk & Manual Entry', href: '/admin/manual', icon: Users, desc: 'Manually record IN/OUT for employees' },
    { name: 'Employees', href: '/admin/employees', icon: Users, desc: 'Manage staff and view records' },
    { name: 'ID Cards', href: '/admin/cards', icon: Badge, desc: 'Generate printable NFC / QR ID cards' },
    { name: 'Timesheet', href: '/admin/timesheet', icon: CalendarCheck, desc: 'Manage shifts and schedules' },
    { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck, desc: 'View attendance logs' },
    { name: 'Payroll', href: '/admin/payroll', icon: Wallet, desc: 'Process salaries and slips' },
    { name: 'QR Station', href: '/admin/qr', icon: QrCode, desc: 'Manage office QR code' },
    { name: 'System Options', href: '/admin/system', icon: Settings, desc: 'Configure office location' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <Link href={metric.href} key={idx}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${metric.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  <metric.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-slate-500 font-medium text-sm">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-800">{metric.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 pt-4">Quick Navigation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickLinks.map((link, idx) => (
          <Link href={link.href} key={idx}>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 h-full flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <link.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{link.name}</h3>
              <p className="text-slate-500 text-sm flex-1">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
