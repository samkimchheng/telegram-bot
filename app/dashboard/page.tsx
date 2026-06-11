import { Users, UserCheck, UserX, Target } from 'lucide-react';

export default function Dashboard() {
  const recentCheckins = [
    { name: 'Sok Makara', role: 'Developer', time: '07:45 AM', method: 'GPS', status: 'On Time', khmerName: 'សុខ មករា', methodClass: 'bg-indigo-50 text-indigo-700', statusClass: 'text-emerald-500' },
    { name: 'Chan Tola', role: 'Designer', time: '08:02 AM', method: 'Face ID', status: 'Late', khmerName: 'ចាន់ តុលា', methodClass: 'bg-violet-50 text-violet-700', statusClass: 'text-amber-500' },
    { name: 'Meas Nimol', role: 'Marketing', time: '07:30 AM', method: 'NFC', status: 'On Time', khmerName: 'មាស និមល', methodClass: 'bg-blue-50 text-blue-700', statusClass: 'text-emerald-500' },
    { name: 'Khem Srey', role: 'HR', time: '--:--', method: 'N/A', status: 'Absent', khmerName: 'ខឹម ស្រី', methodClass: 'bg-slate-100 text-slate-400', statusClass: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-sm font-medium">វត្តមានសរុប</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">156</span>
            <span className="text-emerald-500 text-sm font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-sm font-medium">យឺតយ៉ាវ</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">08</span>
            <span className="text-rose-500 text-sm font-bold">-3%</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <span className="text-slate-400 text-sm font-medium">អវត្តមាន</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">04</span>
            <span className="text-slate-300 text-sm">Stable</span>
          </div>
        </div>
        <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-200 flex flex-col text-white">
          <span className="text-indigo-100 text-sm font-medium">AI ស្កេនមុខជោគជ័យ</span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">98%</span>
            <span className="text-white/80 text-sm font-mono">AI Verify</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[460px] flex-1">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-lg">សកម្មភាពវត្តមានចុងក្រោយ</h2>
            <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700">មើលទាំងអស់</button>
          </div>
          <div className="flex-1 p-0 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider sticky top-0">
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">បុគ្គលិក</th>
                  <th className="px-6 py-4 font-semibold">ម៉ោងចូល</th>
                  <th className="px-6 py-4 font-semibold">វិធីសាស្ត្រ</th>
                  <th className="px-6 py-4 font-semibold">ស្ថានភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentCheckins.map((rc, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase shrink-0">
                        {rc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm font-semibold">{rc.khmerName} ({rc.name})</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{rc.time}</td>
                    <td className="px-6 py-4">
                      <span className={`${rc.methodClass} text-[10px] font-bold px-2 py-1 rounded uppercase`}>
                        {rc.method}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-xs font-bold ${rc.statusClass}`}>
                      {rc.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 space-y-6 flex flex-col">
          <div className="flex-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-slate-800 mb-4">តំបន់ការងារ (Geofence)</h3>
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden text-slate-400 text-xs uppercase tracking-widest font-bold min-h-[150px]">
              <div className="absolute inset-0 bg-indigo-50 border-2 border-indigo-200 rounded-full scale-75 opacity-20"></div>
              <div className="absolute w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
              Map Visualization Active
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500">Radius: 200m</span>
              <span className="text-emerald-600">Inside: 142</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <div className="text-xs opacity-80 uppercase tracking-widest mb-1">Next Payroll</div>
            <div className="text-2xl font-bold mb-4 font-inter">31 ឧសភា 2024</div>
            <button className="w-full bg-white/20 hover:bg-white/30 border border-white/40 py-3 rounded-xl text-sm font-bold transition-all">
              ដំណើរការបើកប្រាក់បៀវត្សរ៍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
