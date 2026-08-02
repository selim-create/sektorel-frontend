"use client";

import { LocateFixed, Minus, Plus } from "lucide-react";
import { useMap } from "react-leaflet";

const TURKEY_CENTER: [number, number] = [39, 35];
const DEFAULT_ZOOM = 6;

export default function MapControls() {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 z-[500] flex flex-col border border-gray-200 bg-white shadow-lg">
      <button
        aria-label="Yakınlaştır"
        className="border-b border-gray-200 p-2 text-secondary hover:bg-gray-50"
        onClick={() => map.zoomIn()}
        type="button"
      >
        <Plus size={16} />
      </button>
      <button
        aria-label="Uzaklaştır"
        className="border-b border-gray-200 p-2 text-secondary hover:bg-gray-50"
        onClick={() => map.zoomOut()}
        type="button"
      >
        <Minus size={16} />
      </button>
      <button
        aria-label="Haritayı sıfırla"
        className="p-2 text-secondary hover:bg-gray-50"
        onClick={() => map.setView(TURKEY_CENTER, DEFAULT_ZOOM)}
        type="button"
      >
        <LocateFixed size={16} />
      </button>
    </div>
  );
}
