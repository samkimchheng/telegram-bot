'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle2, ArrowRight, ScanFace, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const FaceScanner = dynamic(() => import('@/components/FaceScanner'), { ssr: false });

export default function ActivatePage() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState('');
  const [step, setStep] = useState<'enter_code' | 'enroll_face' | 'success'>('enter_code');

  useEffect(() => {
    // If already activated and enrolled, skip to check-in
    const activeCode = localStorage.getItem('employee_code');
    const enrolledFace = localStorage.getItem(`enrolled_face_${activeCode}`);
    
    if (activeCode && enrolledFace) {
      router.replace('/check-in');
    } else if (activeCode && !enrolledFace) {
      setEmployeeCode(activeCode);
      setStep('enroll_face');
    }
  }, [router]);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeCode.trim()) return;
    
    // Save activation code
    localStorage.setItem('employee_code', employeeCode.trim().toUpperCase());
    
    // Auto-link Telegram ID if app is opened inside Telegram
    // @ts-ignore
    const tg = window?.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe?.user?.id) {
       localStorage.setItem(`telegram_id_${employeeCode.trim().toUpperCase()}`, tg.initDataUnsafe.user.id.toString());
       // Expand App
       tg.expand();
    }

    setStep('enroll_face');
  };

  const handleFaceEnrolled = (descriptor: Float32Array) => {
    // Key face by employee code to simulate a DB record
    localStorage.setItem(`enrolled_face_${employeeCode.trim().toUpperCase()}`, JSON.stringify(Array.from(descriptor)));
    setStep('success');
    
    setTimeout(() => {
      router.push('/check-in');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 font-kantumruy">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-brand-soft border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <UserCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-inter mb-2">Activate Device</h1>
          <p className="text-white/80 text-sm leading-relaxed">
            សូមបញ្ចូលលេខកូដបុគ្គលិករបស់អ្នក (Employee ID) ដើម្បីភ្ជាប់កម្មវិធីនេះទៅកាន់គណនីរបស់អ្នក។
          </p>
        </div>

        <div className="p-8">
          {step === 'enter_code' && (
            <form onSubmit={handleActivate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  លេខកូដបុគ្គលិក (Employee ID)
                </label>
                <input
                  type="text"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="ឧទាហរណ៍: EMP-001"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all uppercase"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
              >
                ភ្ជាប់គណនី (Activate)
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 'enroll_face' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto">
                 <ScanFace className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">ចុះឈ្មោះផ្ទៃមុខ</h3>
                <p className="text-slate-500 text-sm">
                  អ្នកត្រូវថតផ្ទៃមុខរបស់អ្នកដើម្បីអាចប្រើប្រាស់មុខងារស្កេនមុខ (Face ID Check-in) ពេញលេញ។
                </p>
              </div>
              <FaceScanner 
                mode="register"
                onRegistrationSuccess={handleFaceEnrolled}
                onCancel={() => setStep('enter_code')} // Allow user to go back and fix employee ID
              />
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">ជោគជ័យ!</h3>
              <p className="text-slate-500">គណនីរបស់អ្នកបានភ្ជាប់រួចរាល់។</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
