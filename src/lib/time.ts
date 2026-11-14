"use client";

import { useSyncExternalStore } from "react";
import { nightMode } from "@/config/messages";

// เช็กเวลาใหม่ทุกนาที เผื่อเปิดค้างไว้จนข้ามเวลา
const subscribeEveryMinute = (onChange: () => void) => {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
};

export function isNightHour(hour: number): boolean {
  const { startHour, endHour } = nightMode;
  return startHour > endHour ? hour >= startHour || hour < endHour : hour >= startHour && hour < endHour;
}

// ?night=1 บังคับกลางคืน, ?night=0 บังคับกลางวัน (ไว้ลองดูหน้าตา)
function nightSnapshot(): boolean {
  const forced = new URLSearchParams(window.location.search).get("night");
  if (forced === "1") return true;
  if (forced === "0") return false;
  return isNightHour(new Date().getHours());
}

// ตอน build หน้าเว็บยังไม่รู้เวลาของคนเปิด จึงเริ่มเป็นกลางวันก่อน แล้วค่อยเปลี่ยนในเครื่อง
export function useIsNight(): boolean {
  return useSyncExternalStore(subscribeEveryMinute, nightSnapshot, () => false);
}

// เลขวันตามปฏิทินในเครื่อง เปลี่ยนตอนเที่ยงคืน ใช้เลือกข้อความประจำวัน
export function localDayNumber(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function useDayNumber(): number | null {
  return useSyncExternalStore(subscribeEveryMinute, () => localDayNumber(new Date()), () => null);
}
