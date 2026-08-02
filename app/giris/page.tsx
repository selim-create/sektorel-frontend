"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { Mail, Lock, ArrowRight, AlertCircle, Briefcase } from "lucide-react";
import { LOGIN_MUTATION } from "@/lib/mutations";
import { hydrateSessionUser, saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      const session = data?.login;

      if (!session?.authToken || !session?.refreshToken || !session?.user) {
        setErrorMsg("Oturum bilgileri alınamadı. Lütfen tekrar deneyin.");
        return;
      }

      saveSession(session.authToken, session.refreshToken, session.user);
      await hydrateSessionUser(session.authToken);
      router.replace("/hesabim");
      router.refresh();
    },
    onError: (error) => {
      setErrorMsg(error.message || "Giriş yapılamadı. Bilgilerinizi kontrol edin.");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    login({ variables: { username: formData.email.trim(), password: formData.password } });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-black text-secondary uppercase tracking-tight mb-2">Hoş Geldiniz</h1>
            <p className="text-gray-500 text-sm">Sektörel Ajanda hesabınıza giriş yaparak fırsatları yakalayın.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm flex items-center gap-2 rounded-sm" role="alert">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <Mail size={12} /> E-Posta Adresi
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                placeholder="ornek@sirket.com"
                className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Lock size={12} /> Şifre
                </label>
                <Link href="/sifremi-unuttum" className="text-xs font-bold text-primary hover:underline">Şifremi Unuttum?</Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                placeholder="••••••••••"
                className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-black uppercase tracking-widest text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Hesabınız yok mu? <Link href="/kayit" className="font-bold text-primary hover:underline">Hemen Kayıt Olun</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white">
          <div className="inline-flex w-fit items-center gap-2 bg-primary/20 border border-primary/50 text-primary px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
            <Briefcase size={14} /> Kurumsal Portal
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight leading-tight mb-4">İş Dünyasının<br />Dijital Ajandası</h2>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">Firmalar, sektörel haberler ve yeni iş fırsatları tek platformda.</p>
        </div>
      </div>
    </div>
  );
}
