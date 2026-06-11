'use client';

import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

// Use jsdelivr CDN for models since downloading locally isn't possible in this sandbox
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

interface FaceScannerProps {
  mode: 'register' | 'verify';
  onRegistrationSuccess?: (descriptor: Float32Array) => void;
  onVerificationSuccess?: () => void;
  onVerificationFail?: () => void;
  onCancel: () => void;
}

export default function FaceScanner({ mode, onRegistrationSuccess, onVerificationSuccess, onVerificationFail, onCancel }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [status, setStatus] = useState<string>('កំពុងផ្ទុកម៉ូដែល AI...'); // Loading AI models
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
        setStatus('ម៉ូដែលរួចរាល់ (Models ready)');
      } catch (err) {
        console.error('Failed to load models', err);
        setErrorMSG('បរាជ័យក្នុងការផ្ទុកម៉ូដែល AI (Failed to load AI models)');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isModelsLoaded && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            activeStream = stream;
            // Removed synchronous setState in effect, relying on event handlers or not doing it.
            // But we actually needed setIsCameraActive(true) which triggers lint.
          }
        }).catch(err => {
          console.error('Error', err);
        });
    }
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModelsLoaded]);

  const captureAndProcess = async () => {
    if (!videoRef.current || !isModelsLoaded) return;
    setStatus('កំពុងវិភាគផ្ទៃមុខ... (Analyzing face)');
    setErrorMSG(null);

    const detections = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      setErrorMSG('រកមិនឃើញផ្ទៃមុខ។ សូមសាកល្បងម្ដងទៀត។ (No face detected)');
      setStatus('សាកល្បងម្ដងទៀត (Try again)');
      return;
    }

    if (mode === 'register') {
      setStatus('ចុះឈ្មោះជោគជ័យ! (Registration successful)');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(detections.descriptor);
      }
    } else if (mode === 'verify') {
      // Retrieve stored descriptor
      // Determine employee code
      const activeCode = localStorage.getItem('employee_code');
      if (!activeCode) {
        setErrorMSG('ឧបករណ៍នេះមិនទាន់បានភ្ជាប់ (Device not activated).');
        if (onVerificationFail) onVerificationFail();
        return;
      }
      
      const storedData = localStorage.getItem(`enrolled_face_${activeCode}`);
      if (!storedData) {
        setErrorMSG('មិនទាន់មានទិន្នន័យផ្ទៃមុខ។ សូមចុះឈ្មោះជាមុន។ (No face enrolled)');
        if (onVerificationFail) onVerificationFail();
        return;
      }
      
      const storedArray = new Float32Array(Object.values(JSON.parse(storedData)));
      const distance = faceapi.euclideanDistance(storedArray, detections.descriptor);
      
      if (distance < 0.5) { // Match threshold
        setStatus('ផ្ទៀងផ្ទាត់ជោគជ័យ! (Verification successful)');
        if (onVerificationSuccess) onVerificationSuccess();
      } else {
        setErrorMSG(`ផ្ទៃមុខមិនត្រឹមត្រូវ (Face not matched: ${distance.toFixed(2)})`);
        if (onVerificationFail) onVerificationFail();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-lg text-slate-800">
            {mode === 'register' ? 'កត់ត្រាផ្ទៃមុខ (Face Registration)' : 'ផ្ទៀងផ្ទាត់ផ្ទៃមុខ (Face Verification)'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            បិទ (Close)
          </button>
        </div>
        
        <div className="relative bg-slate-900 aspect-[3/4] flex items-center justify-center">
          {!isCameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <Camera className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">{status}</p>
            </div>
          )}
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
            onPlay={() => {
              setIsCameraActive(true);
              setStatus('សូមសម្លឹងមើលកាមេរ៉ា (Please look at the camera)');
            }}
          />
          
          {/* Overlay Box */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-[70%] aspect-square border-2 border-dashed border-white/50 rounded-2xl mx-auto mt-20" />
          </div>
        </div>

        <div className="p-6">
          <p className={`text-center font-medium text-sm mb-4 ${errorMSG ? 'text-red-500' : 'text-slate-600'}`}>
            {errorMSG || status}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={captureAndProcess}
              disabled={!isCameraActive || !isModelsLoaded}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mode === 'register' ? 'កត់ត្រា (Register)' : 'ស្កេន (Scan)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
