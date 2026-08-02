"use client";

import { useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestSektorelPasswordReset($email: String!) {
    requestSektorelPasswordReset(
      input: {
        clientMutationId: "password-reset-request"
        email: $email
      }
    ) {
      success
      message
    }
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [requestReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await requestReset({ variables: { email: email.trim() } });
      setMessage(
        data?.requestSektorelPasswordReset?.message ||
          "E-posta adresiniz kayıtlıysa sıfırlama bağlantısı gönderildi.",
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "İstek gönderilemedi.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 shadow-sm">
        <div className="mb-8">
          <span className="inline-flex w-11 h-11 items-center justify-center bg-orange-50 text-primary rounded-full mb-4">
            <Mail size={20} />
          </span>
          <h1 className="text-2xl font-black text-secondary uppercase tracking-tight">Şifremi Unuttum</h1>
          <p className="text-sm text-gray-500 mt-2">
            Hesabınıza bağlı e-posta adresini girin. Kayıtlıysa güvenli bir yenileme bağlantısı göndereceğiz.
          </p>
        </div>

        {message ? (
          <div className="space-y-5">
            <div className="flex gap-3 bg-green-50 border border-green-200 p-4 text-sm text-green-800">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p>{message}</p>
            </div>
            <button
              type="button"
              onClick={() => setMessage("")}
              className="w-full border border-gray-300 py-3 text-sm font-bold uppercase hover:bg-gray-50"
            >
              Başka e-posta dene
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-bold uppercase text-gray-500 mb-2">
                E-posta adresi
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 text-sm focus:outline-none focus:border-primary"
                placeholder="ornek@sirket.com"
              />
            </div>

            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 text-sm font-black uppercase tracking-wide hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </button>
          </form>
        )}

        <Link href="/giris" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary">
          <ArrowLeft size={14} /> Giriş ekranına dön
        </Link>
      </div>
    </div>
  );
}
