'use client';

import { useState, useEffect } from 'react';
import { Save, UserCheck, Clock } from 'lucide-react';

type Employee = {
  id: string;
  code: string;
  name: string;
  nfc_serial?: string;
};

export default function AdminManualCheckIn() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [action, setAction] = useState<'in' | 'out'>('in');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('company_employees');
    if (data) {
      setTimeout(() => setEmployees(JSON.parse(data)), 0);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/check-in', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           employeeCode: selectedCode,
           action: action,
           method: 'manual',
           location: { lat: 0, lng: 0 }
         })
      });
      
      if (res.ok) {
        alert(`Successfully recorded manual CHECK ${action.toUpperCase()} for ${selectedCode}`);
        setSelectedCode('');
      } else {
         alert('Failed to record attendance');
      }
    } catch(err) {
       alert('Network error recording manual attendance');
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Manual Entry / Proxy</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
         <div className="prose text-slate-600 max-w-none mb-8">
           <p>
             Use this form to manually record attendance for employees who forgot their phone or card. 
             This action will be recorded as <strong>Manual Entry</strong> in the system and will trigger the standard Telegram notifications.
           </p>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Employee</label>
              <select 
                value={selectedCode}
                onChange={e => setSelectedCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 bg-slate-50"
                required
              >
                 <option value="" disabled>-- Choose Employee --</option>
                 {employees.map(emp => (
                    <option key={emp.id} value={emp.code}>{emp.code} - {emp.name}</option>
                 ))}
              </select>
           </div>
           
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Action Type</label>
              <div className="flex gap-4">
                 <button 
                   type="button"
                   onClick={() => setAction('in')}
                   className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${action === 'in' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50'}`}
                 >
                   <UserCheck className="w-5 h-5" /> CHECK IN
                 </button>
                 <button 
                   type="button"
                   onClick={() => setAction('out')}
                   className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${action === 'out' ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50'}`}
                 >
                   <Clock className="w-5 h-5" /> CHECK OUT
                 </button>
              </div>
           </div>

           <div className="pt-6 border-t border-slate-100">
             <button 
               type="submit" 
               disabled={isSubmitting || !selectedCode}
               className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all"
             >
               <Save className="w-5 h-5" />
               Record Attendance
             </button>
           </div>
         </form>
      </div>
    </div>
  );
}
