'use client';

import { useState, useEffect } from 'react';
import { MapPin, Save, Crosshair, Map as MapIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function AdminSystemPage() {
  const [lat, setLat] = useState<number>(11.5564);
  const [lng, setLng] = useState<number>(104.9282);
  const [radius, setRadius] = useState<number>(100);
  const [mapLink, setMapLink] = useState('');

  useEffect(() => {
    const config = localStorage.getItem('office_config');
    if (config) {
      const parsed = JSON.parse(config);
      setTimeout(() => {
        setLat(parsed.lat);
        setLng(parsed.lng);
        setRadius(parsed.radius);
      }, 0);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('office_config', JSON.stringify({ lat, lng, radius }));
    alert('Office location saved successfully!');
  };

  const handleParseMapLink = () => {
    const atMatch = mapLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      setLat(parseFloat(atMatch[1]));
      setLng(parseFloat(atMatch[2]));
      return;
    }
    const commaMatch = mapLink.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (commaMatch) {
      setLat(parseFloat(commaMatch[1]));
      setLng(parseFloat(commaMatch[2]));
      return;
    }
    alert('Could not parse coordinates. Try pasting something like "11.5564, 104.9282" or a Google Maps URL.');
  };

  const handleGetGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        (err) => alert('Could not get GPS: ' + err.message)
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">System Options</h1>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all"
        >
          <Save className="w-4 h-4" /> Save Config
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Office Geofence Setup
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paste Maps Link or Coords</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
                <button 
                  onClick={handleParseMapLink}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-all"
                >
                  Extract
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Allowed Radius (meters)</label>
              <input 
                type="number" 
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              onClick={handleGetGPS}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold transition-all border border-emerald-200"
            >
              <Crosshair className="w-5 h-5" />
              Use My Current GPS Context
            </button>
          </div>
        </div>

        <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden relative min-h-[400px]">
           <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
             <MapIcon className="w-4 h-4 text-indigo-500" />
             <span className="text-sm font-bold text-slate-800">Preview Radius: {radius}m</span>
           </div>
           <Map userLocation={null} officeLocation={{lat, lng}} radius={radius} />
        </div>
      </div>
    </div>
  );
}
