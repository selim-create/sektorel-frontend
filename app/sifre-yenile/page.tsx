"use client";

import { useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { CheckCircle2, KeyRound } from "lucide-react";

const RESET_PASSWORD = gql`
  mutation ResetSektorelPassword($login: String!, $key: String!, $newPassword: String!) {
    resetSektorelPassword(
      input: {
        clientMutationId: "password-reset"
        login: $login
        key: $key
        newPassword: $newPassword
      }
    ) {
      success
      message
    }
  }
`;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const params = new URLSearchParams(window.location.search);
    const login = params.get("login") || "";
    const key = params.get("key") || "";

    if (!login || !key) {
      setError("Parola sıfırlama bağlantısı eksik veya geçersiz.");
      return;
    }

    if (password.length < 10) {
      setError("Yeni şifre en az 10 karakter olmalıdır.");
      return;
    }

    if (password !== passwordAgain) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: { login, key, newPassword: password },
      });
      setMessage(data?.resetSektorelPassword?.message || "Şifreniz güncellendi.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Şifre güncellenemedi.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 shadow-sm">
        <span className="inline-flex w-11 h-11 items-center justify-center bg-orange-50 text-primary rounded-full mb-4">
          <KeyRound size={20} />
        </span>
        <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Yeni Şifre Belirle</h1>
        <p className="text-sm text-gray-500 mt-2 mb-8">Yeni şifreniz en az 10 karakter olmalıdır.</p>

        {message ? (
          <div className="space-y-5">
            <div className="flex gap-3 bg-green-50 border border-green-200 p-4 text-sm text-green-800">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
            <Link href="/giris" className="block text-center w-full bg-primary text-white py-4 text-sm font-black uppercase">
              Giriş Yap
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold uppercase text-gray-500 mb-2">Yeni şifre</label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="new-password-again" className="block text-xs font-bold uppercase text-gray-500 mb-2">Yeni şifre tekrar</label>
              <input
                id="new-password-again"
                type="password"
                autoComplete="new-password"
                required
                minLength={10}
                value={passwordAgain}
                onChange={(event) => setPasswordAgain(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 text-sm font-black uppercase tracking-wide hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
