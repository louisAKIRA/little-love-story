import { useSyncExternalStore } from "react";
import type { PetKind } from "@/config/pets";

// =====================================================================
//  จำค่าที่หวานเลือกไว้ในเครื่อง (localStorage) เปิดครั้งหน้าจะได้ไม่ต้องแต่งใหม่
//  เก็บเฉพาะในเบราว์เซอร์ของเครื่องที่เปิด ไม่ได้ส่งไปไหน
// =====================================================================

export type SavedState = {
  version: 1;
  skin?: string;
  hairStyle?: string;
  hairColor?: string;
  outfit?: string;
  girlAccessories?: string[];
  petKind?: PetKind;
  coat?: string;
  petAccessories?: string[];
  petName?: string;
  completed?: boolean;
  tapCount?: number;
  visitDays?: number;
  lastDay?: number;
  letterOpened?: boolean;
};

const KEY = "little-flower-field:v1";

export function loadSaved(): SavedState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    return data && typeof data === "object" ? (data as SavedState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: SavedState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // โหมดส่วนตัวหรือปิด storage ไว้ ก็เล่นต่อได้ แค่จำค่าไม่ได้
  }
}

// false ตอน build หน้าเว็บ และตอนเปิดหน้าครั้งแรก, true หลังจากหน้าเว็บพร้อมในเบราว์เซอร์แล้ว
const subscribeNever = () => () => {};
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}
