"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// =====================================================================
//  เพลงพื้นหลังแบบ 8-bit สร้างสดด้วย Web Audio (ไม่ต้องมีไฟล์เพลง)
//  เริ่มแบบปิดเสมอ เสียงจะดังก็ต่อเมื่อกดปุ่มเปิดเท่านั้น
// =====================================================================

const BPM = 128;
const STEP = 60 / BPM / 2; // โน้ตเขบ็ตหนึ่งชั้น

// เลข MIDI (72 = โด กลาง ๆ สูง), null = เว้นจังหวะ
// 4 ห้อง วนไปเรื่อย ๆ คอร์ด C - Am - F - G
const MELODY: (number | null)[] = [
  76, 79, 84, 79, 76, null, 74, 76,
  81, null, 79, 76, 72, null, null, null,
  77, 81, 84, 81, 79, 77, 76, null,
  74, 76, 77, 79, 74, null, 71, null,
];
const BASS: (number | null)[] = [
  48, null, 55, null, 48, null, 55, null,
  45, null, 52, null, 45, null, 52, null,
  41, null, 48, null, 41, null, 48, null,
  43, null, 50, null, 43, null, 50, null,
];

const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

export function useChiptune() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const nextTimeRef = useRef(0);

  const tone = useCallback((midi: number, at: number, length: number, type: OscillatorType, volume: number) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency(midi), at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
    osc.connect(gain).connect(master);
    osc.start(at);
    osc.stop(at + length + 0.02);
  }, []);

  const schedule = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    // กลับมาจากแท็บที่ซ่อนอยู่ อย่าเล่นโน้ตที่ค้างทีเดียวพร้อมกัน
    if (nextTimeRef.current < ctx.currentTime - 0.1) nextTimeRef.current = ctx.currentTime + 0.05;
    while (nextTimeRef.current < ctx.currentTime + 0.2) {
      const step = stepRef.current % MELODY.length;
      const note = MELODY[step];
      const bass = BASS[step];
      if (note !== null) tone(note, nextTimeRef.current, STEP * 0.9, "square", 0.1);
      if (bass !== null) tone(bass, nextTimeRef.current, STEP * 1.8, "triangle", 0.22);
      nextTimeRef.current += STEP;
      stepRef.current += 1;
    }
  }, [tone]);

  const stopTimer = () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const toggle = useCallback(() => {
    if (enabled) {
      stopTimer();
      void ctxRef.current?.suspend();
      setEnabled(false);
      return;
    }
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.3;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    const ctx = ctxRef.current;
    void ctx.resume();
    stepRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.05;
    stopTimer();
    timerRef.current = window.setInterval(schedule, 50);
    setEnabled(true);
  }, [enabled, schedule]);

  // เสียง "ปิ๊ง" ตอนจิ้มน้อง ดังเฉพาะตอนเปิดเพลงอยู่
  const blip = useCallback(() => {
    const ctx = ctxRef.current;
    if (!enabled || !ctx) return;
    const now = ctx.currentTime;
    tone(84, now, 0.08, "square", 0.14);
    tone(91, now + 0.07, 0.14, "square", 0.14);
  }, [enabled, tone]);

  // สลับไปแอปอื่นแล้วเพลงหยุด กลับมาแล้วเล่นต่อ
  useEffect(() => {
    if (!enabled) return;
    const onVisibility = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      if (document.hidden) void ctx.suspend();
      else void ctx.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  useEffect(() => {
    const timer = timerRef;
    const context = ctxRef;
    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
      void context.current?.close();
    };
  }, []);

  return { enabled, toggle, blip };
}
