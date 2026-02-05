"use client";

import { useState } from "react";
import Link from "next/link";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react"; 
import { CREATE_COMPANY_MUTATION } from "@/lib/mutations";
import { GET_ALL_SECTORS } from "@/lib/queries";
import { 
  Building2, MapPin, Globe, Phone, Mail, Upload, 
  CheckCircle, AlertCircle, ChevronRight, Info, X, Loader2
} from "lucide-react";

// Lokasyon Sorgusu (Şehir ve İlçeler için)
const GET_LOCATIONS = gql`
  query GetLocations {
    locations(where: { parent: 0 }, first: 100) {
      nodes {
        id
        name
        slug
        children {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
`;

export default function AddCompanyPage() {
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    officialName: "",
    sector: "", // Alt sektör veya Ana sektör slug'ı
    companyType: "Limited Şirket",
    description: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    district: "",
    postalCode: "",
    address: ""
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Dinamik Veri Yönetimi
  const [subSectors, setSubSectors] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // API'den Verileri Çekme
  const { data: sectorData, loading: sectorLoading } = useQuery(GET_ALL_SECTORS);
  const { data: locationData, loading: locationLoading } = useQuery(GET_LOCATIONS);

  const sectors = sectorData?.sectors?.nodes || [];
  const locations = locationData?.locations?.nodes || [];

  // Mutation
  const [submitCompany, { loading: creating }] = useMutation(CREATE_COMPANY_MUTATION, {
    onCompleted: (data) => {
      // DÜZELTME: createCompany yerine submitCompany kontrol ediliyor
      if (data.submitCompany && data.submitCompany.success) {
        setStatusMsg({ type: 'success', text: 'Firma başvurunuz başarıyla alındı! Editör onayından sonra yayınlanacaktır.' });
        window.scrollTo(0, 0);
        setFormData({
          title: "", officialName: "", sector: "", companyType: "Limited Şirket", description: "",
          phone: "", email: "", website: "", city: "", district: "", postalCode: "", address: ""
        });
        setLogoPreview(null);
        setCoverPreview(null);
      } else {
        const errorMsg = data.submitCompany?.message || 'Bir hata oluştu.';
        setStatusMsg({ type: 'error', text: errorMsg });
      }
    },
    onError: (error) => {
      setStatusMsg({ type: 'error', text: error.message });
    }
  });

  // Handle Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ana Sektör Değişimi
  const handleMainSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mainSlug = e.target.value;
    // Alt sektörleri bul
    const selectedSector = sectors.find((s: any) => s.slug === mainSlug);
    const children = selectedSector?.children?.nodes || [];
    
    setSubSectors(children);
    // Form verisine şimdilik ana sektörü ata (kullanıcı alt sektör seçmezse bu kalır)
    setFormData({ ...formData, sector: mainSlug });
  };

  // Alt Sektör Değişimi
  const handleSubSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, sector: e.target.value });
  };

  // Şehir Değişimi
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const citySlug = e.target.value;
    
    // İlçeleri bul
    const selectedLocation = locations.find((l: any) => l.slug === citySlug);
    const children = selectedLocation?.children?.nodes || [];

    setDistricts(children);
    // Backend 'name' veya 'slug' bekliyor olabilir, 'slug' gönderiyoruz backend'de resolve ediyoruz
    setFormData({ ...formData, city: citySlug, district: "" });
  };

  // İlçe Değişimi
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtSlug = e.target.value; // Select value district slug ise
    // Ancak backend district name bekliyorsa display name yollamalıyız.
    // Backend'de "get_term_by('name', $input['district'], ...)" kullandık.
    // O yüzden burada select option value'su name olmalı veya backend'i slug yapmalıyız.
    // Tutarlılık için burada slug alıp name'i bulup göndermek daha güvenli.
    const selectedDistrict = districts.find((d: any) => d.slug === districtSlug);
    setFormData({ ...formData, district: selectedDistrict?.name || districtSlug });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setLogoPreview(reader.result as string);
        else setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setStatusMsg(null);
    
    if (!formData.title || !formData.sector || !formData.email) {
      setStatusMsg({ type: 'error', text: 'Lütfen zorunlu alanları (Firma Adı, Sektör, E-Posta) doldurunuz.' });
      window.scrollTo(0, 0);
      return;
    }

    submitCompany({
      variables: {
        ...formData
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans">
      
      {/* 1. HERO HEADER */}
      <section className="bg-secondary text-white py-12 px-4 border-b border-gray-800">
        <div className="container mx-auto max-w-5xl">
           <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
             <Link href="/" className="hover:text-white transition">Anasayfa</Link>
             <ChevronRight size={12} />
             <span className="text-primary">Firma Ekle</span>
           </div>
           
           <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight flex items-center gap-3">
             <Building2 className="text-primary" size={32} /> Firmanızı Kaydedin
           </h1>
           <p className="text-gray-400 mt-2 text-lg max-w-2xl">
             Sektörel Ajanda'da yerinizi alın, dijital görünürlüğünüzü artırın ve binlerce potansiyel müşteriye ulaşın.
           </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        
        {statusMsg && (
          <div className={`mb-8 p-4 border-l-4 rounded-sm flex items-start gap-3 ${statusMsg.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
            {statusMsg.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            <div>
              <h4 className="font-bold text-sm uppercase">{statusMsg.type === 'success' ? 'Başarılı!' : 'Hata!'}</h4>
              <p className="text-sm">{statusMsg.text}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SOL: Firma Ekleme Formu */}
          <main className="w-full lg:w-2/3">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              {/* BÖLÜM 1: Kurumsal Kimlik */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm border-t-4 border-t-primary">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  1. Kurumsal Kimlik
                </h2>
                
                <div className="space-y-6">
                  {/* Firma Adı & Ünvan */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      Firma Adı (Marka) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Örn: Sektörel Ajanda" 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                      Resmi Ticari Ünvan
                    </label>
                    <input 
                      type="text" 
                      name="officialName"
                      value={formData.officialName}
                      onChange={handleChange}
                      placeholder="Örn: Sektörel Ajanda Bilişim Hizmetleri A.Ş." 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  {/* Sektör Seçimi (API'den) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                        Ana Sektör <span className="text-red-500">*</span>
                        {sectorLoading && <Loader2 size={12} className="animate-spin text-primary"/>}
                      </label>
                      <select onChange={handleMainSectorChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                        <option value="">Sektör Seçiniz...</option>
                        {sectors.map((sector: any) => (
                          <option key={sector.id} value={sector.slug}>{sector.name}</option>
                        ))}
                      </select>
                    </div>

                    {subSectors.length > 0 && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Alt Sektör</label>
                        <select name="sector" onChange={handleSubSectorChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                          <option value={formData.sector}>Genel / Tümü</option>
                          {subSectors.map((sub: any) => (
                            <option key={sub.id} value={sub.slug}>{sub.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Firma Tipi</label>
                      <select name="companyType" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary cursor-pointer rounded-none">
                        <option>Limited Şirket</option>
                        <option>Anonim Şirket</option>
                        <option>Şahıs Firması</option>
                        <option>Kooperatif</option>
                      </select>
                    </div>
                  </div>

                  {/* Hakkımızda */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Hakkımızda / Firma Tanıtımı</label>
                    <textarea 
                      name="description"
                      rows={6} 
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Firmanızı, tarihçenizi, vizyonunuzu ve faaliyet alanlarınızı anlatan etkileyici bir metin yazın..." 
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary bg-white transition-colors rounded-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: İletişim ve Lokasyon */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  2. İletişim ve Lokasyon
                </h2>

                <div className="space-y-6">
                  {/* İletişim Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Phone size={12}/> Telefon</label>
                      <input type="tel" name="phone" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="+90 ..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Mail size={12}/> E-Posta <span className="text-red-500">*</span></label>
                      <input type="email" name="email" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="info@firma.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Globe size={12}/> Web Sitesi</label>
                      <input type="url" name="website" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" placeholder="https://" />
                    </div>
                  </div>

                  {/* Adres (API'den) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                        Şehir
                        {locationLoading && <Loader2 size={12} className="animate-spin text-primary"/>}
                      </label>
                      <select onChange={handleCityChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none">
                        <option value="">Şehir Seçiniz</option>
                        {locations.map((loc: any) => (
                          <option key={loc.id} value={loc.slug}>{loc.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">İlçe</label>
                      <select onChange={handleDistrictChange} disabled={districts.length === 0} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="">İlçe Seçiniz</option>
                        {districts.map((dist: any) => (
                          <option key={dist.id} value={dist.slug}>{dist.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Posta Kodu</label>
                      <input type="text" name="postalCode" onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><MapPin size={12}/> Açık Adres</label>
                    <textarea name="address" onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 p-4 text-sm font-medium focus:outline-none focus:border-primary rounded-none resize-none"></textarea>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 3: Görsel Medya (Kapak Görseli Eklendi) */}
              <div className="bg-white border border-gray-200 p-8 shadow-sm">
                <h2 className="text-lg font-black text-secondary uppercase tracking-tight mb-6 pb-2 border-b border-gray-100 flex items-center gap-2">
                  3. Görsel Medya
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Logo Upload */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Firma Logosu (Kare)</label>
                      <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 cursor-pointer h-48 flex flex-col items-center justify-center overflow-hidden group">
                         <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                         {logoPreview ? (
                           <>
                             <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
                             <button onClick={(e) => {e.preventDefault(); setLogoPreview(null)}} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-20 hover:text-red-500"><X size={16}/></button>
                           </>
                         ) : (
                           <div className="text-center text-gray-400 group-hover:text-primary transition-colors">
                             <Upload size={20} className="mx-auto mb-2"/>
                             <span className="text-xs font-bold">Logo Seç</span>
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Kapak Upload (Yeni) */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Kapak Görseli (Yatay)</label>
                      <div className="relative border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 cursor-pointer h-48 flex flex-col items-center justify-center overflow-hidden group">
                         <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                         {coverPreview ? (
                           <>
                             <img src={coverPreview} alt="Kapak" className="h-full w-full object-cover" />
                             <button onClick={(e) => {e.preventDefault(); setCoverPreview(null)}} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-20 hover:text-red-500"><X size={16}/></button>
                           </>
                         ) : (
                           <div className="text-center text-gray-400 group-hover:text-primary transition-colors">
                             <Upload size={20} className="mx-auto mb-2"/>
                             <span className="text-xs font-bold">Kapak Seç</span>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col gap-4 pt-4">
                 <div className="flex items-start gap-2">
                    <input type="checkbox" className="accent-primary w-4 h-4 mt-0.5" />
                    <span className="text-xs text-gray-500 leading-tight">
                      Firma yetkilisi olduğumu beyan ederim.
                    </span>
                 </div>
                 <button 
                   type="button" 
                   onClick={handleSubmit} 
                   disabled={creating}
                   className="w-full bg-primary hover:bg-primary-hover text-white py-5 text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                 >
                   {creating && <Loader2 size={16} className="animate-spin"/>}
                   BAŞVURUYU TAMAMLA
                 </button>
              </div>

            </form>
          </main>

          {/* SAĞ: Bilgi Sidebar (Aynı kalıyor) */}
          <aside className="w-full lg:w-1/3 space-y-8">
             <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
               <h3 className="text-sm font-black text-blue-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                 <Info size={16} /> Bilgilendirme
               </h3>
               <p className="text-xs text-blue-900/80 leading-relaxed">
                 Girdiğiniz bilgiler editörlerimiz tarafından kontrol edildikten sonra yayına alınacaktır.
                 Onay süreci ortalama 24 saattir.
               </p>
             </div>
          </aside>

        </div>
      </div>
    </div>
  );
}