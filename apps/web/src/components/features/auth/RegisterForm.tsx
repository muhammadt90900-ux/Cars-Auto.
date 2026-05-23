'use client';
// apps/web/src/components/features/auth/RegisterForm.tsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2, CheckCircle2,
} from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'ناو دەبێت لانیکەم ٢ پیت بێت'),
  email: z.string().email('ئیمەیڵی دروست بنووسە'),
  phone: z.string().optional().refine(
    (v) => !v || /^[+\d\s\-()]{7,20}$/.test(v),
    'ژمارەی تەلەفۆن دروست نییە',
  ),
  password: z.string().min(6, 'پاسوۆرد دەبێت لانیکەم ٦ پیت بێت'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'پاسوۆردەکان یەک نین',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const inputClass = (hasError: boolean) => `
  w-full pr-11 pl-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25
  bg-white/[0.05] border transition-all duration-200 outline-none
  focus:bg-white/[0.08] focus:border-[#c8a84b]/60 focus:shadow-[0_0_20px_rgba(200,168,75,0.1)]
  ${hasError ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}
`;

function Toast({ message, type }: { message: string; type: 'error' | 'success' }) {
  if (!message) return null;
  return (
    <div className={`rounded-xl px-4 py-3 text-sm border ${
      type === 'error'
        ? 'bg-red-500/10 border-red-500/30 text-red-400'
        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
        {message}
      </div>
    </div>
  );
}

export function RegisterForm() {
  const { register: registerUser } = useAuthStore();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError('');
    setSuccessMsg('');
    try {
      const payload: Record<string, string> = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };
      if (data.phone?.trim()) payload.phone = data.phone.trim();

      await registerUser(payload as any);
      setSuccessMsg('بەسەرکەوتوویی تۆمار کرایت! بەرەوپێش دەکرێیتەوە…');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'تۆمارکردن سەرنەکەوت. دووبارە هەوڵ بدەوە.';
      setServerError(Array.isArray(msg) ? msg.join(' · ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #050e18 0%, #0a1628 60%, #050e18 100%)' }}
    >
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse, #c8a84b 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #c8a84b 0%, #e8c96b 100%)' }}
          >
            <span className="text-2xl">🚗</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">ئەکاونتێکی نوێ دروست بکە</h1>
          <p className="text-white/40 text-sm">Create your Auto Bazaar Pro account</p>
        </div>

        <div
          className="rounded-3xl border border-white/[0.08] p-8"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}
        >
          <div
            className="h-1 rounded-full mb-8 -mx-8 -mt-8 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, #c8a84b, transparent)' }}
          />

          <div className="space-y-5" dir="rtl">
            {serverError && <Toast message={serverError} type="error" />}
            {successMsg && <Toast message={successMsg} type="success" />}

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-semibold tracking-wider uppercase">ناو / Name</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" {...register('name')} placeholder="ناوی تەواو" className={inputClass(!!errors.name)} />
              </div>
              {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-semibold tracking-wider uppercase">ئیمەیڵ / Email</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" {...register('email')} placeholder="you@example.com" dir="ltr" className={inputClass(!!errors.email)} />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-semibold tracking-wider uppercase">
                تەلەفۆن / Phone <span className="text-white/25 normal-case font-normal">(ئارەزووی)</span>
              </label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="tel" {...register('phone')} placeholder="+964 750 000 0000" dir="ltr" className={inputClass(!!errors.phone)} />
              </div>
              {errors.phone && <p className="text-red-400 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-semibold tracking-wider uppercase">پاسوۆرد / Password</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  dir="ltr"
                  className={`${inputClass(!!errors.password)} pl-11`}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-semibold tracking-wider uppercase">دووبارە پاسوۆرد / Confirm</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  dir="ltr"
                  className={`${inputClass(!!errors.confirmPassword)} pl-11`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 mt-2
                disabled:opacity-60 disabled:cursor-not-allowed
                hover:shadow-lg hover:shadow-[#c8a84b]/30 hover:scale-[1.01] active:scale-[0.99]
                flex items-center justify-center gap-2"
              style={{
                background: isLoading ? 'rgba(200,168,75,0.5)' : 'linear-gradient(135deg, #c8a84b 0%, #e8c96b 50%, #c8a84b 100%)',
                color: '#050e18',
              }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />چاوەڕێ بکە...</>
              ) : (
                <>تۆمارکردن / Register<ArrowLeft className="w-4 h-4" /></>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-white/25 text-xs">یان / or</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            <p className="text-center text-sm text-white/40">
              ئەکاونتت هەیە؟{' '}
              <Link href="/login" className="text-[#c8a84b] hover:text-[#f5d98b] font-semibold transition-colors">
                چوونەژوورەوە / Login
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          {['Iraq 🇮🇶', 'Kurdistan 🏔️', 'Dubai 🇦🇪'].map(region => (
            <span key={region} className="text-xs text-white/20">{region}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
