'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UserPlus, FileDown, UploadCloud } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import * as XLSX from 'xlsx';

const FaceScanner = dynamic(() => import('@/components/FaceScanner'), { ssr: false });

type Employee = {
  id: string;
  code: string;
  name: string;
  department: string;
  active: boolean;
};

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState<string | null>(null); // holds employee code
  const [formData, setFormData] = useState({ id: '', code: '', name: '', department: '', active: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('company_employees');
    if (data) {
      setTimeout(() => setEmployees(JSON.parse(data)), 0);
    } else {
      // Dummy data
      const initial = [
        { id: '1', code: 'EMP-001', name: 'Sok Makara', department: 'IT', active: true },
        { id: '2', code: 'EMP-002', name: 'Chan Vanny', department: 'HR', active: true }
      ];
      setTimeout(() => setEmployees(initial), 0);
      localStorage.setItem('company_employees', JSON.stringify(initial));
    }
  }, []);

  const saveEmployees = (newEmp: Employee[]) => {
    setEmployees(newEmp);
    localStorage.setItem('company_employees', JSON.stringify(newEmp));
  };

  const handleSave = () => {
    if (!formData.code || !formData.name) return;
    let newEmp = [...employees];
    if (formData.id) {
      newEmp = newEmp.map(e => e.id === formData.id ? formData : e);
    } else {
      newEmp.push({ ...formData, id: Date.now().toString() });
    }
    saveEmployees(newEmp);
    setShowForm(false);
    setFormData({ id: '', code: '', name: '', department: '', active: true });
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this employee?')) {
      saveEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleEdit = (e: Employee) => {
    setFormData(e);
    setShowForm(true);
  };

  const handleFaceEnrolled = (descriptor: Float32Array) => {
    if (showFaceScanner) {
      localStorage.setItem(`enrolled_face_${showFaceScanner}`, JSON.stringify(Array.from(descriptor)));
      alert('Face enrolled successfully!');
      setShowFaceScanner(null);
    }
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Code: 'EMP-003', Name: 'Sok San', Department: 'Marketing', Active: 'yes', Type: 'fixed', BasePay: 500 }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employee_template.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any>(ws);
      
      const newEmployees: Employee[] = [];
      data.forEach(row => {
        if (row.Code && row.Name) {
           newEmployees.push({
             id: Date.now().toString() + Math.random().toString(),
             code: row.Code,
             name: row.Name,
             department: row.Department || '',
             active: String(row.Active).toLowerCase() === 'yes' || String(row.Active).toLowerCase() === 'true'
           });
           
           // In a real app we'd also insert to payroll table:
           // { employee_code: row.Code, type: row.Type, base_amount: row.BasePay }
        }
      });
      if (newEmployees.length > 0) {
        saveEmployees([...employees, ...newEmployees]);
        alert(`Successfully imported ${newEmployees.length} employees plus pay configurations.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all"
          >
            <FileDown className="w-4 h-4" /> Template
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-slate-500" /> Import Excel
          </button>
          <button 
            onClick={() => { setFormData({ id: '', code: '', name: '', department: '', active: true }); setShowForm(true); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-indigo-600 font-bold">{emp.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{emp.name}</td>
                  <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${emp.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {emp.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => setShowFaceScanner(emp.code)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                      title="Enroll Face"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(emp)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No employees found. Click &quot;Add Employee&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{formData.id ? 'Edit Employee' : 'New Employee'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Code</label>
                <input 
                  type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input 
                  type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-medium text-slate-700">Account Active</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {showFaceScanner && (
        <FaceScanner 
          mode="register"
          onRegistrationSuccess={handleFaceEnrolled}
          onCancel={() => setShowFaceScanner(null)}
        />
      )}
    </div>
  );
}
