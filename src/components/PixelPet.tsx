"use client";

import { useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from "react";
import PixelSprite from "@/components/PixelSprite";
import { petLayers, type PetLook } from "@/lib/sprites";
import { PET_WIDTH, PET_HEIGHT } from "@/config/pets";

// ให้หน้าเกมสั่งโยนขนมได้: ส่งคำพูดตอนกินมาด้วย
export type PetHandle = { feed: (line: string | null) => void };

type Props = {
  look: PetLook;
  name?: string;
  // คำพูดสุ่มตอนจิ้ม (แทน {name}/{pet} มาแล้ว)
  lines?: string[];
  // เรียกทุกครั้งที่จิ้ม ถ้าคืนข้อความกลับมา น้องจะพูดข้อความนั้นแทนคำสุ่ม (ใช้กับจิ้มครบ 50 ที)
  onTap?: () => string | null;
  // คำทักตอนน้องโผล่มา (ใช้ตอนกลางคืน)
  greeting?: string | null;
  treatEmoji?: string;
  scale?: number;
  ref?: Ref<PetHandle>;
};

type Burst = { id: number; dx: number; delay: number };
type Motion = { key: number; kind: "jump" | "eat" };

const TREAT_FALL_MS = 650;

export default function PixelPet({ look, name, lines = [], onTap, greeting = null, treatEmoji = "🍪", scale = 7, ref }: Props) {
  const [motion, setMotion] = useState<Motion | null>(null);
  const [speech, setSpeech] = useState<string | null>(greeting);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [treats, setTreats] = useState<number[]>([]);
  const lastLine = useRef(-1);
  const nextId = useRef(0);
  const speechTimer = useRef<number | undefined>(undefined);
  const pendingTimers = useRef<number[]>([]);

  // คำทักกลางคืนแสดงอยู่สักพักแล้วหายไปเอง
  useEffect(() => {
    if (!greeting) return;
    const timer = window.setTimeout(() => setSpeech((current) => (current === greeting ? null : current)), 4200);
    return () => window.clearTimeout(timer);
  }, [greeting]);

  useEffect(() => {
    const pending = pendingTimers.current;
    const speechRef = speechTimer;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(speechRef.current);
    };
  }, []);

  const later = (fn: () => void, ms: number) => {
    pendingTimers.current.push(window.setTimeout(fn, ms));
  };

  const say = (line: string, ms: number) => {
    setSpeech(line);
    window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech(null), ms);
  };

  const burst = (count: number) => {
    const created = Array.from({ length: count }, (_, i) => ({
      id: nextId.current++,
      dx: Math.round((Math.random() - 0.5) * (count > 8 ? 180 : 100)),
      delay: i * (count > 8 ? 30 : 45),
    }));
    const createdIds = new Set(created.map((item) => item.id));
    setBursts((current) => [...current, ...created]);
    later(() => setBursts((current) => current.filter((item) => !createdIds.has(item.id))), 1500);
  };

  const randomLine = () => {
    if (lines.length === 0) return null;
    let index = Math.floor(Math.random() * lines.length);
    if (lines.length > 1 && index === lastLine.current) index = (index + 1) % lines.length;
    lastLine.current = index;
    return lines[index];
  };

  const move = (kind: Motion["kind"]) => setMotion((current) => ({ key: (current?.key ?? 0) + 1, kind }));

  const handleTap = () => {
    const special = onTap?.() ?? null;
    move("jump");
    const line = special ?? randomLine();
    if (line) say(line, special ? 3800 : 2800);
    burst(special ? 14 : 5);
  };

  const feed = (line: string | null) => {
    const id = nextId.current++;
    setTreats((current) => [...current, id]);
    later(() => {
      setTreats((current) => current.filter((item) => item !== id));
      move("eat");
      if (line) say(line, 3200);
      burst(7);
    }, TREAT_FALL_MS);
  };

  useImperativeHandle(ref, () => ({ feed }));

  const label = look.kind === "cat" ? "แมวพิกเซล" : "หมาพิกเซล";

  return (
    <div className={`sprite-wrap sprite-pet sprite-${look.kind}`}>
      {speech && (
        <div className="speech-bubble" role="status">
          {speech}
        </div>
      )}
      {name && <div className="name-tag">♡ {name}</div>}
      <div className="sprite-shadow" />
      <button type="button" className="pet-button" onClick={handleTap} aria-label={`จิ้ม${name ?? "น้อง"}`}>
        <span key={motion?.key ?? 0} className={motion ? `pet-${motion.kind}` : "pet-still"}>
          <PixelSprite layers={petLayers(look)} width={PET_WIDTH} height={PET_HEIGHT} scale={scale} label={label} />
        </span>
      </button>
      {treats.map((id) => (
        <span key={id} className="treat" aria-hidden="true">
          {treatEmoji}
        </span>
      ))}
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
