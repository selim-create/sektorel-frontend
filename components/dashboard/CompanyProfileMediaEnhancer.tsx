"use client";

import { useEffect, useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { usePathname } from "next/navigation";
import { AlertCircle, CheckCircle2, Crop, Loader2, X } from "lucide-react";

const COMPLETION_QUERY = gql`
  query SektorelProfileCompletionDiagnostics {
    sektorelCompanySettings {
      completionPercent
      completionMissing
    }
  }
`;

type CropState = {
  file: File;
  url: string;
  width: number;
  height: number;
};

function readImage(file: File) {
  return new Promise<{ image: HTMLImageElement; url: string }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({ image, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel okunamadı."));
    };
    image.src = url;
  });
}

function dispatchValidatedFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
  input.dataset.enhancedPass = "1";
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export default function CompanyProfileMediaEnhancer() {
  const pathname = usePathname();
  const active = pathname === "/hesabim/ayarlar";
  const [crop, setCrop] = useState<CropState | null>(null);
  const [coverInput, setCoverInput] = useState<HTMLInputElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [notice, setNotice] = useState("");

  const completionQuery = useQuery(COMPLETION_QUERY, {
    skip: !active,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  useEffect(() => {
    if (!active) return;

    const onChange = async (event: Event) => {
      const input = event.target as HTMLInputElement | null;
      if (!input || input.type !== "file") return;
      if (input.dataset.enhancedPass === "1") {
        delete input.dataset.enhancedPass;
        return;
      }
      if (input.id !== "upload-logo" && input.id !== "upload-cover") return;

      const file = input.files?.[0];
      if (!file) return;

      event.stopImmediatePropagation();
      event.preventDefault();
      input.value = "";
      setNotice("");

      try {
        const loaded = await readImage(file);
        if (input.id === "upload-logo") {
          const square = loaded.image.naturalWidth === loaded.image.naturalHeight;
          URL.revokeObjectURL(loaded.url);
          if (!square) {
            setNotice("Firma logosu yalnızca kare (1:1) görsel olarak yüklenebilir.");
            return;
          }
          dispatchValidatedFile(input, file);
          return;
        }

        setCoverInput(input);
        setCrop({
          file,
          url: loaded.url,
          width: loaded.image.naturalWidth,
          height: loaded.image.naturalHeight,
        });
        setZoom(1);
        setPositionX(50);
        setPositionY(50);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Görsel hazırlanamadı.");
      }
    };

    document.addEventListener("change", onChange, true);
    return () => document.removeEventListener("change", onChange, true);
  }, [active]);

  useEffect(() => () => {
    if (crop?.url) URL.revokeObjectURL(crop.url);
  }, [crop]);

  const missing: string[] = completionQuery.data?.sektorelCompanySettings?.completionMissing || [];
  const percent = Number(completionQuery.data?.sektorelCompanySettings?.completionPercent || 0);

  const previewStyle = useMemo(() => ({
    backgroundImage: crop ? `url(${crop.url})` : undefined,
    backgroundSize: `${zoom * 100}%`,
    backgroundPosition: `${positionX}% ${positionY}%`,
  }), [crop, zoom, positionX, positionY]);

  const closeCrop = () => {
    if (crop?.url) URL.revokeObjectURL(crop.url);
    setCrop(null);
    setCoverInput(null);
  };

  const confirmCrop = async () => {
    if (!crop || !coverInput) return;
    setProcessing(true);
    setNotice("");

    try {
      const { image, url } = await readImage(crop.file);
      const outputWidth = 1500;
      const outputHeight = 500;
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      let cropWidth = sourceRatio > 3 ? image.naturalHeight * 3 : image.naturalWidth;
      let cropHeight = sourceRatio > 3 ? image.naturalHeight : image.naturalWidth / 3;
      cropWidth /= zoom;
      cropHeight /= zoom;

      const maxX = Math.max(0, image.naturalWidth - cropWidth);
      const maxY = Math.max(0, image.naturalHeight - cropHeight);
      const sourceX = maxX * (positionX / 100);
      const sourceY = maxY * (positionY / 100);

      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Kırpma alanı oluşturulamadı.");
      context.drawImage(
        image,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputWidth,
        outputHeight,
      );

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      URL.revokeObjectURL(url);
      if (!blob) throw new Error("Kırpılmış kapak oluşturulamadı.");

      const baseName = crop.file.name.replace(/\.[^.]+$/, "");
      const croppedFile = new File([blob], `${baseName}-kapak.jpg`, { type: "image/jpeg" });
      dispatchValidatedFile(coverInput, croppedFile);
      closeCrop();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Kapak görseli kırpılamadı.");
    } finally {
      setProcessing(false);
    }
  };

  if (!active) return null;

  return (
    <>
      <div className="mb-6 space-y-3">
        {completionQuery.loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin" /> Profil kriterleri kontrol ediliyor...
          </div>
        ) : missing.length ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <div className="flex items-start gap-3">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-black">Profil %{percent}: {missing.length} kriter eksik</p>
                <p className="mt-1 text-sm">Eksik: {missing.join(", ")}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
            <CheckCircle2 size={18} /> Profil kriterlerinin tamamı dolu.
          </div>
        )}
        {notice ? (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            <AlertCircle size={18} /> {notice}
          </div>
        ) : null}
      </div>

      {crop ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-black text-secondary"><Crop size={20} /> Kapak Görselini Ayarla</h2>
                <p className="mt-1 text-sm text-gray-500">Görsel 1500×500 px ve 3:1 oranında kaydedilecek.</p>
              </div>
              <button type="button" onClick={closeCrop} className="rounded-full p-2 text-gray-500 hover:bg-gray-100"><X size={20} /></button>
            </div>

            <div className="mt-5 aspect-[3/1] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 bg-cover bg-no-repeat" style={previewStyle} />

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="text-xs font-bold uppercase text-gray-500">Yakınlaştır
                <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full" />
              </label>
              <label className="text-xs font-bold uppercase text-gray-500">Yatay Konum
                <input type="range" min="0" max="100" value={positionX} onChange={(event) => setPositionX(Number(event.target.value))} className="mt-2 w-full" />
              </label>
              <label className="text-xs font-bold uppercase text-gray-500">Dikey Konum
                <input type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} className="mt-2 w-full" />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeCrop} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600">Vazgeç</button>
              <button type="button" onClick={confirmCrop} disabled={processing} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black uppercase text-white disabled:opacity-60">
                {processing ? <Loader2 size={16} className="animate-spin" /> : <Crop size={16} />} Kırp ve Yükle
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
