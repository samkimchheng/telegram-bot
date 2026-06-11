'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { UserPlus, ScanFace, CheckCircle2 } from 'lucide-react';

const FaceScanner = dynamic(() => import('@/components/FaceScanner'), { ssr: false });

export default function EmployeesPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);

  const handleRegistrationSuccess = (descriptor: Float32Array) => {
    // Store in localStorage
    localStorage.setItem('enrolled_face', JSON.stringify(Array.from(descriptor)));
    setEnrollmentStatus('បានចុះឈ្មោះផ្ទៃមុខជោគជ័យ (Face enrolled successfully!)');
    setTimeout(() => {
      setShowScanner(false);
      setEnrollmentStatus(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-full font-kantumruy">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">គ្រប់គ្រងបុគ្គលិក</h1>
        <button 
          onClick={() => setShowScanner(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
        >
          <ScanFace className="w-5 h-5" />
          ចុះឈ្មោះផ្ទៃមុខ (Enroll Face)
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col items-center justify-center text-center">
        {enrollmentStatus ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-xl font-semibold text-slate-800">{enrollmentStatus}</h2>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-6">
              <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">មិនទាន់មានបុគ្គលិកនៅឡើយ</h2>
            <p className="text-slate-500 max-w-sm">
              សូមប្រើប្រាស់ប៊ូតុងខាងលើដើម្បីចុះឈ្មោះផ្ទៃមុខសម្រាប់បុគ្គលិកថ្មី (សម្រាប់ការសាកល្បងនេះ យើងរក្សាទុកក្នុង local storage)។
            </p>
          </>
        )}
      </div>

      {showScanner && (
        <FaceScanner 
          mode="register" 
          onRegistrationSuccess={handleRegistrationSuccess}
          onCancel={() => setShowScanner(false)} 
        />
      )}
    </div>
  );
}
