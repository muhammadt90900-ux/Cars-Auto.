'use client';
// app/[locale]/dashboard/profile/page.tsx — Fully localized

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Save, User, Phone, MapPin, Globe, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function Field({
  label, type = 'text', placeholder, defaultValue, icon: Icon,
}: { label: string; type?: string; placeholder?: string; defaultValue?: string; icon?: React.ElementType }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden />}
        <input
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={`w-full ${Icon ? 'ps-9' : 'ps-4'} ${isPassword ? 'pe-10' : 'pe-4'} py-2.5 text-sm rounded-xl
            border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5
            text-gray-900 dark:text-white placeholder-gray-400 outline-none
            focus:ring-2 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]/40 transition-all`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const t  = useTranslations('profile');
  const td = useTranslations('dashboard');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-5 lg:p-7 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{t('publicProfile')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('accountSettings')}</p>
      </div>

      {saved && (
        <div role="status" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden />
          {td('profileSaved')}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#9e6e1e] flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <button aria-label="Change avatar"
            className="absolute -bottom-1 -end-1 w-7 h-7 rounded-full bg-white dark:bg-[#0b1525] border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <Camera className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden />
          </button>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">John Doe</p>
          <p className="text-sm text-gray-400">john@example.com</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#0b1525] p-5 space-y-4">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white">{t('publicProfile')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t('fullName')}    placeholder="John Doe"          defaultValue="John Doe"          icon={User}  />
          <Field label={t('phoneNumber')} placeholder="+964 770 000 0000" defaultValue="+964 770 000 0000" icon={Phone} type="tel" />
          <Field label={t('location')}    placeholder="Erbil, Kurdistan"  defaultValue="Erbil, Kurdistan"  icon={MapPin} />
          <Field label={t('website')}     placeholder="https://..."                                        icon={Globe} type="url" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            {t('bio')}
          </label>
          <textarea
            rows={3}
            placeholder="Tell buyers about yourself..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#c9a84c]/20 focus:border-[#c9a84c]/40 transition-all resize-none"
          />
        </div>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#0b1525] p-5 space-y-4">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white">{t('changePassword')}</h2>
        <div className="space-y-4">
          <Field label={t('currentPassword')}    type="password" icon={Lock} />
          <Field label={t('newPassword')}        type="password" icon={Lock} />
          <Field label={t('confirmNewPassword')} type="password" icon={Lock} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/[0.03] p-5">
        <h2 className="font-semibold text-sm text-red-700 dark:text-red-400 mb-3">{t('dangerZone')}</h2>
        <p className="text-xs text-red-500 dark:text-red-400/70 mb-3">{t('deleteAccountWarning')}</p>
        <button className="text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors underline">
          {t('deleteAccount')}
        </button>
      </div>

      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                   shadow-[0_4px_16px_rgba(201,168,76,0.25)] hover:shadow-[0_6px_24px_rgba(201,168,76,0.35)]
                   transition-all hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'linear-gradient(135deg,#c9a84c,#9e6e1e)' }}
      >
        <Save className="w-4 h-4" aria-hidden />
        {td('saveProfile')}
      </button>
    </div>
  );
}
