"use client";

import { useEffect, useState } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// กะพริบตา: หลับตาแวบเดียวทุก ๆ 2.5-5.5 วินาที (สุ่มจังหวะให้ดูเป็นธรรมชาติ)
// ถ้าเครื่องตั้งค่าลดการเคลื่อนไหวไว้ จะไม่กะพริบ
export function useBlink(): boolean {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    let timer: number;
    function open() {
      setClosed(false);
      timer = window.setTimeout(close, 2500 + Math.random() * 3000);
    }
    function close() {
      setClosed(true);
      timer = window.setTimeout(open, 150);
    }
    timer = window.setTimeout(close, 1200 + Math.random() * 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return closed;
}

// สลับ true/false เป็นจังหวะ ใช้สลับท่าหางของน้อง
export function useToggle(intervalMs: number): boolean {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    const timer = window.setInterval(() => setOn((value) => !value), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);

  return on;
}
