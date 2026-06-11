'use client';

import { useState, useEffect } from 'react';
import { Send, Wallet, Plus, Edit2 } from 'lucide-react';

type PayrollRecord = {
  id: string;
  employee_code: string;
  type: 'fixed' | 'hourly';
  base_amount: number;
  adjustments: number;
  total: number;
};

export default function AdminPayrollPage() {
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    // Mocking paginated query
    const allRecords: PayrollRecord[] = [
      { id: '1', employee_code: 'EMP-001', type: 'fixed', base_amount: 500, adjustments: 0, total: 500 },
      { id: '2', employee_code: 'EMP-002', type: 'hourly', base_amount: 400, adjustments: -20, total: 380 },
    ];
    setTimeout(() => {
      setPayroll(allRecords.slice(page * pageSize, (page + 1) * pageSize));
    }, 0);
  }, [page]);

  const handleSendPayslips = async () => {
    alert('Sending payslips via Telegram...');
    try {
      await fetch('/api/bot/payslip', { method: 'POST' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Payroll Management</h1>
        <button 
          onClick={handleSendPayslips}
          className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1f8fc2] text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <Send className="w-4 h-4" /> Send Payslips (Telegram)
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Base Amount</th>
                <th className="px-6 py-4 font-medium text-right">Adjustments</th>
                <th className="px-6 py-4 font-medium text-right">Net Total</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-indigo-600 font-bold">{r.employee_code}</td>
                  <td className="px-6 py-4 capitalize">{r.type}</td>
                  <td className="px-6 py-4 text-right">${r.base_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={r.adjustments < 0 ? 'text-red-500' : r.adjustments > 0 ? 'text-emerald-500' : ''}>
                      ${r.adjustments.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">${r.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {payroll.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No payroll data found.
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
             Previous
           </button>
           <span className="text-sm text-slate-500 font-medium">Page {page + 1}</span>
           <button 
             onClick={() => setPage(page + 1)}
             className="px-4 py-2 text-sm font-medium text-indigo-600"
           >
             Next
           </button>
        </div>
      </div>
    </div>
  );
}
