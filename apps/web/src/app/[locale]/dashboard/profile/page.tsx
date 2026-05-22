// apps/web/src/app/[locale]/dashboard/profile/page.tsx
'use client';

import { useState } from 'react';
import { Camera, Save, User, Phone, MapPin, Globe, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function Field({
  label,
  type = 'text',
  placeholder,
  defaultValue,
  icon: Icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  icon?: React.ElementType;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}
        <input
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e94560]/20 focus:border-[#e94560]/40 transition-all`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-5 lg:p-7 max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account information</p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-[#e94560]/25">
            U
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <Camera className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Your Name</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Pro member since 2024</p>
          <button className="text-xs text-[#e94560] font-medium hover:underline">Change photo</button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#e94560]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Personal Information</h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" placeholder="John" defaultValue="John" icon={User} />
          <Field label="Last Name" placeholder="Doe" defaultValue="Doe" />
          <Field label="Email Address" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
          <Field label="Phone Number" type="tel" placeholder="+964 750 000 0000" icon={Phone} />
          <div className="sm:col-span-2">
            <Field label="Location / City" placeholder="Sulaymaniyah, Kurdistan" defaultValue="Sulaymaniyah" icon={MapPin} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea
              rows={3}
              placeholder="Tell buyers a little about yourself..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#e94560]/20 focus:border-[#e94560]/40 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-[#0f0f1a]/80 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#e94560]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Security</h2>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Field label="Current Password" type="password" placeholder="••••••••" />
          </div>
          <Field label="New Password" type="password" placeholder="••••••••" />
          <Field label="Confirm New Password" type="password" placeholder="••••••••" />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-1">
        {saved && (
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            Changes saved successfully
          </div>
        )}
        <div className="flex gap-3 ml-auto">
          <button className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e94560] hover:bg-[#d63d57] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#e94560]/25 hover:shadow-[#e94560]/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
