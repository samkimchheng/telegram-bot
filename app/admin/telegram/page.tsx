'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function AdminTelegramPage() {
  const [groupId, setGroupId] = useState('-100123456789'); // Demo value
  const [botToken, setBotToken] = useState('123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11');
  
  const handleSave = () => {
    alert('Telegram settings saved (In a real app, this would update process.env or settings db)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Telegram Bot Integration</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
        <div className="prose text-slate-600 max-w-none">
          <p>
            SecureAttend supports sending immediate check-in notifications to an Admin Telegram Group 
            and private Direct Messages to employees.
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>Admin Group:</strong> Receives all IN/OUT activities for auditing.</li>
            <li><strong>Employee DM:</strong> Bound to their <code>Employee ID</code> via Telegram Mini App.</li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telegram Bot Token</label>
            <input 
              type="text" 
              value={botToken} onChange={e => setBotToken(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono text-sm"
              placeholder="e.g. 123456789:ABCDEF..."
            />
            <p className="text-xs text-slate-500 mt-2">Get this from @BotFather</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Group Chat ID</label>
            <input 
              type="text" 
              value={groupId} onChange={e => setGroupId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono text-sm"
              placeholder="e.g. -1001234567890"
            />
            <p className="text-xs text-slate-500 mt-2">The bot must be added to this group as an admin.</p>
          </div>

          <button 
             onClick={handleSave}
             className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1f8fc2] text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            <Send className="w-5 h-5" />
            Save Telegram Settings
          </button>
        </div>
      </div>
    </div>
  );
}
