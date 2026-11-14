"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import PixelSprite from "@/components/PixelSprite";
import { mix } from "@/lib/color";
import { petSprites, PET_WIDTH, PET_HEIGHT, type PetKind, type Coat, type PetAccessory } from "@/config/pets";

type Props = {
  kind: PetKind;
  coat: Coat;
  accessories?: PetAccessory[];
  name?: string;
  // คำพูดตอนจิ้ม (แทน {name}/{pet} มาแล้ว)
  lines?: string[];
  onTap?: () => void;
  scale?: number;
};

type Burst = { id: number; dx: number; delay: number };

export default function PixelPet({ kind, coat, accessories = [], name, lines = [], onTap, scale = 7 }: Props) {
  const [taps, setTaps] = useState(0);
  const [speech, setSpeech] = useState<string | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const lastLine = useRef(-1);
  const nextId = useRef(0);
  const speechTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const timer = speechTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  const handleTap = () => {
    setTaps((count) => count + 1);
    onTap?.();

    if (lines.length > 0) {
      let index = Math.floor(Math.random() * lines.length);
      if (lines.length > 1 && index === lastLine.current) index = (index + 1) % lines.length;
      lastLine.current = index;
      setSpeech(lines[index]);
      window.clearTimeout(speechTimer.current);
      speechTimer.current = window.setTimeout(() => setSpeech(null), 2800);
    }

    const created = Array.from({ length: 5 }, (_, i) => ({
      id: nextId.current++,
      dx: Math.round((Math.random() - 0.5) * 100),
      delay: i * 45,
    }));
    const createdIds = new Set(created.map((item) => item.id));
    setBursts((current) => [...current, ...created]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => !createdIds.has(item.id))), 1300);
  };

  const layers = [
    {
      rows: petSprites[kind],
      palette: {
        f: coat.color,
        o: coat.detail,
        i: mix(coat.color, "#F08CAE", 0.6),
        c: mix(coat.color, "#F06A96", 0.5),
        e: "#3E2E3A",
        n: kind === "cat" ? "#E889A9" : "#3E2E3A",
      },
    },
    ...accessories.map((item) => ({ rows: item.rows[kind], palette: item.palette })),
  ];

  const label = kind === "cat" ? "แมวพิกเซล" : "หมาพิกเซล";

  return (
    <div className={`sprite-wrap sprite-pet sprite-${kind}`}>
      {speech && (
        <div className="speech-bubble" role="status">
          {speech}
        </div>
      )}
      {name && <div className="name-tag">♡ {name}</div>}
      <div className="sprite-shadow" />
      <button type="button" className="pet-button" onClick={handleTap} aria-label={`จิ้ม${name ?? "น้อง"}`}>
        <span key={taps} className={taps > 0 ? "pet-jump" : "pet-still"}>
          <PixelSprite layers={layers} width={PET_WIDTH} height={PET_HEIGHT} scale={scale} label={label} />
        </span>
      </button>
      {bursts.map((item) => (
        <span
          key={item.id}
          className="burst-heart"
          style={{ "--dx": `${item.dx}px`, animationDelay: `${item.delay}ms` } as CSSProperties}
          aria-hidden="true"
        >
          ♥
        </span>
      ))}
    </div>
  );
}
