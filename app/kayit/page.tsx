"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// DÜZELTME: Import yolu @apollo/client/react olarak güncellendi
import { useMutation, useQuery } from "@apollo/client/react";
import { REGISTER_MUTATION } from "@/lib/mutations";
import { GET_ALL_SECTORS } from "@/lib/queries";
import { User, Building2, CheckCircle, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"bireysel" | "kurumsal">("kurumsal");
  
  // Sektör Seçim State'leri
  const [selectedMainSector, setSelectedMainSector] = useState("");
  const [subSectors, setSubSectors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    sector: "" // Nihai sektör (slug)
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Sektörleri Çek
  const { data: sectorsData, loading: sectorsLoading } = useQuery(GET_ALL_SECTORS);
  const sectors = sectorsData?.sectors?.nodes || [];

  // Kayıt Mutation
  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      if (data.registerSektorelUser.success) {
        setSuccessMsg("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/giris"), 2000);
      } else {
        setErrorMsg(data.registerSektorelUser.message);
      }
    },
    onError: (error) => {
      setErrorMsg(error.message || "Kayıt sırasında bir hata oluştu.");
    }
  });

  // Ana Sektör Değiştiğinde
  const handleMainSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainSlug = e.target.value;
    setSelectedMainSector(mainSlug);
    
    // Alt sektörleri bul
    const selectedSector = sectors.find((s: any) => s.slug === mainSlug);
    const children = selectedSector?.children?.nodes || [];
    setSubSectors(children);
    
    // Form verisini güncelle (Henüz alt sektör seçilmediği için ana sektörü ata)
    setFormData({ ...formData, sector: mainSlug });
  };

  // Alt Sektör Değiştiğinde
  const handleSubSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, sector: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Şifreler eşleşmiyor.");
      return;
    }

    if (accountType === 'kurumsal' && !formData.sector) {
      setErrorMsg("Lütfen sektör seçiniz.");
      return;
    }

    register({
      variables: {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        phone: formData.phone,
        accountType: accountType,
        companyName: accountType === 'kurumsal' ? formData.companyName : "",
        taxOffice: accountType === 'kurumsal' ? formData.taxOffice : "",
        taxNumber: accountType === 'kurumsal' ? formData.taxNumber : "",
        sector: accountType === 'kurumsal' ? formData.sector : ""
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex">
      
      {/* SOL: Görsel Alanı */}
      <div className="hidden lg:block w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200" alt="Register Cover" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-secondary via-secondary/90 to-transparent"></div>
        <div className="relative z-10 h-full flex flex-col justify-center px-16 text-white text-right items-end">
           <div className="mb-8">
             <h2 className="text-4xl font-black uppercase tracking-tight leading-tight mb-4">Aramıza Katılın</h2>
             <p className="text-gray-400 text-lg max-w-md leading-relaxed ml-auto">Sektörel Ajanda ile iş ağınızı genişletin, yeni pazarlara açılın.</p>
           </div>
        </div>
      </div>

      {/* SAĞ: Form Alanı */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-lg space-y-8">
          
          <div>
            <h1 className="text-3xl font-black text-secondary uppercase tracking-tight mb-2">Hesap Oluştur</h1>
            <p className="text-gray-500 text-sm">Formu doldurarak Sektörel Ajanda ailesine katılın.</p>
          </div>

          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm rounded-sm flex items-center gap-2"><AlertCircle size={16}/> {errorMsg}</div>}
          {successMsg && <div className="bg-green-50 border border-green-200 text-green-600 p-3 text-sm rounded-sm flex items-center gap-2"><CheckCircle size={16}/> {successMsg}</div>}

          {/* Hesap Tipi */}
          <div className="flex bg-gray-50 p-1 border border-gray-200">
            <button type="button" onClick={() => setAccountType("bireysel")} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide transition-all ${accountType === 'bireysel' ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <User size={16} /> Bireysel
            </button>
            <button type="button" onClick={() => setAccountType("kurumsal")} className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wide transition-all ${accountType === 'kurumsal' ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              <Building2 size={16} /> Kurumsal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Ad Soyad</label>
                <input required name="firstName" onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                <input required name="phone" onChange={handleChange} type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">E-Posta</label>
              <input required name="email" onChange={handleChange} type="email" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Şifre</label>
                <input required name="password" onChange={handleChange} type="password" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Şifre Tekrar</label>
                <input required name="confirmPassword" onChange={handleChange} type="password" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
              </div>
            </div>

            {/* Kurumsal Özel Alanlar */}
            {accountType === "kurumsal" && (
              <div className="border-t border-gray-100 pt-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-primary uppercase flex items-center gap-1"><Building2 size={12} /> Firma Ünvanı</label>
                  <input required name="companyName" onChange={handleChange} type="text" className="w-full bg-blue-50/30 border border-blue-100 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Vergi Dairesi</label>
                    <input required name="taxOffice" onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Vergi No</label>
                    <input required name="taxNumber" onChange={handleChange} type="text" className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                  </div>
                </div>

                {/* Dinamik Sektör Seçimi (API) */}
                <div className="space-y-4">
                  {/* Ana Sektör */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                      Ana Sektör
                      {sectorsLoading && <Loader2 size={12} className="animate-spin text-primary"/>}
                    </label>
                    <select 
                      onChange={handleMainSectorChange} 
                      className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none cursor-pointer"
                    >
                      <option value="">Sektör Seçiniz...</option>
                      {sectors.map((sector: any) => (
                        <option key={sector.id} value={sector.slug}>
                          {sector.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alt Sektör (Varsa Göster) */}
                  {subSectors.length > 0 && (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Alt Sektör</label>
                      <select 
                        name="sector" 
                        onChange={handleSubSectorChange} 
                        className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-medium focus:outline-none focus:border-primary rounded-none cursor-pointer"
                      >
                        <option value={selectedMainSector}>Genel / Tümü</option>
                        {subSectors.map((sub: any) => (
                          <option key={sub.id} value={sub.slug}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" required className="accent-primary w-4 h-4 mt-0.5 rounded-none" />
              <label className="text-xs text-gray-500">
                <Link href="#" className="font-bold text-secondary underline">Kullanıcı Sözleşmesi</Link>'ni okudum, onaylıyorum.
              </label>
            </div>

            <button disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white py-4 font-black uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70">
              {loading ? "Kaydediliyor..." : "Kayıt Ol"} {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Zaten hesabınız var mı? <Link href="/giris" className="font-bold text-primary hover:underline">Giriş Yapın</Link>
          </p>
        </div>
      </div>
    </div>
  );
}