'use client';

import { useState, useEffect } from 'react';
import { Calendar, Save, FileDown } from 'lucide-react';

type TimesheetRecord = {
  id: string;
  employee_code: string;
  day_of_week: string; // e.g. Mon, Tue, Wed
  expected_hours: number;
};

export default function AdminTimesheetPage() {
  const [timesheet, setTimesheet] = useState<TimesheetRecord[]>([]);

  useEffect(() => {
    // Generate dummy timesheet schedule
    const mockData: TimesheetRecord[] = [
      { id: '1', employee_code: 'EMP-001', day_of_week: 'Mon', expected_hours: 8 },
      { id: '2', employee_code: 'EMP-001', day_of_week: 'Tue', expected_hours: 8 },
      { id: '3', employee_code: 'EMP-002', day_of_week: 'Mon', expected_hours: 4 },
      { id: '4', employee_code: 'EMP-002', day_of_week: 'Wed', expected_hours: 4 },
    ];
    setTimeout(() => setTimesheet(mockData), 0);
  }, []);

  const handleSave = () => {
    alert('Timesheet saved successfully!');
  };

  const handleHoursChange = (id: string, newHours: number) => {
    setTimesheet(prev => prev.map(t => t.id === id ? { ...t, expected_hours: newHours } : t));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Timesheet & Schedule</h1>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <Save className="w-4 h-4" /> Save Schedule
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <p className="text-slate-600 text-sm">
             Set the expected working hours per day for part-timers or full-timers. 
             This schedule is used to calculate late/absent deductions in payroll automatically.
           </p>
        </div>
        
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm font-semibold text-slate-600">
                <th className="py-3 px-4">Employee Code</th>
                <th className="py-3 px-4 text-center">Mon</th>
                <th className="py-3 px-4 text-center">Tue</th>
                <th className="py-3 px-4 text-center">Wed</th>
                <th className="py-3 px-4 text-center">Thu</th>
                <th className="py-3 px-4 text-center">Fri</th>
                <th className="py-3 px-4 text-center">Sat</th>
                <th className="py-3 px-4 text-center">Sun</th>
              </tr>
            </thead>
            <tbody>
               {/* Just a demo grouping */}
               {Array.from(new Set(timesheet.map(t => t.employee_code))).map(code => {
                 const empData = timesheet.filter(t => t.employee_code === code);
                 const getHours = (day: string) => empData.find(t => t.day_of_week === day)?.expected_hours || 0;
                 const updateHours = (day: string, hours: number) => {
                    const record = empData.find(t => t.day_of_week === day);
                    if (record) {
                       handleHoursChange(record.id, hours);
                    } else {
                       // In real app, add a new record
                       const newRecord: TimesheetRecord = {
                          id: Math.random().toString(), employee_code: code, day_of_week: day, expected_hours: hours
                       };
                       setTimesheet(prev => [...prev, newRecord]);
                    }
                 };

                 const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                 return (
                   <tr key={code} className="border-b border-slate-100">
                     <td className="py-4 px-4 font-mono font-bold text-indigo-600">{code}</td>
                     {days.map(day => (
                       <td key={day} className="py-4 px-4 text-center">
                         <input 
                           type="number"
                           value={getHours(day) || ''}
                           onChange={(e) => updateHours(day, parseFloat(e.target.value) || 0)}
                           className="w-16 text-center border border-slate-200 rounded p-1 text-sm outline-none focus:border-indigo-500"
                           placeholder="0"
                         />
                       </td>
                     ))}
                   </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
