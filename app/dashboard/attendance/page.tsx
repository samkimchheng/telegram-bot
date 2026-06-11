'use client';

import { useState, useEffect } from 'react';
import { FileDown, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';

type AttendanceRecord = {
  id: string;
  employee_code: string;
  date: string;
  status: 'present' | 'late' | 'absent';
  hours: number;
};

export default function DashboardAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const allRecords: AttendanceRecord[] = [
      { id: '1', employee_code: 'EMP-001', date: '2026-06-10', status: 'present', hours: 8 },
      { id: '2', employee_code: 'EMP-002', date: '2026-06-10', status: 'late', hours: 7.5 },
      { id: '3', employee_code: 'EMP-001', date: '2026-06-11', status: 'present', hours: 8 },
    ];
    const paginated = allRecords.slice(page * pageSize, (page + 1) * pageSize);
    setTimeout(() => setRecords(paginated), 0);
  }, [page]);

  const handleExportCSV = () => {
    const headers = ['Employee Code', 'Date', 'Status', 'Hours'];
    const rows = records.map(r => [r.employee_code, r.date, r.status, r.hours.toString()]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">របាយការណ៍វត្តមាន (Attendance)</h1>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <FileDown className="w-4 h-4" /> ទាញយកឯកសារ (Export CSV)
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200">
               <CalendarIcon className="w-4 h-4" /> មិថុនា ២០២៦ (June 2026)
             </div>
             <div className="flex items-center gap-2 text-slate-600 font-medium bg-white px-4 py-2 rounded-xl border border-slate-200">
               <Clock className="w-4 h-4" /> ម៉ោង៖ Asia/Phnom_Penh
             </div>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">កាលបរិច្ឆេទ (Date)</th>
                <th className="px-6 py-4 font-medium">បុគ្គលិក (Employee)</th>
                <th className="px-6 py-4 font-medium">ស្ថានភាព (Status)</th>
                <th className="px-6 py-4 font-medium text-right">ម៉ោងធ្វើការ (Hours Worked)</th>
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="px-6 py-4 text-slate-600 font-medium">{r.date}</td>
                  <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{r.employee_code}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-700">{r.hours} hrs</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    មិនមានរបាយការណ៍វត្តមានទេ (No attendance records found)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
           <button 
             disabled={page === 0} 
             onClick={() => setPage(page - 1)}
             className="px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-50"
           >
             ថយក្រោយ (Previous)
           </button>
           <span className="text-sm text-slate-500 font-medium">ទំព័រ (Page) {page + 1}</span>
           <button 
             onClick={() => setPage(page + 1)}
             className="px-4 py-2 text-sm font-medium text-indigo-600"
           >
             បន្ទាប់ (Next)
           </button>
        </div>
      </div>
    </div>
  );
}
