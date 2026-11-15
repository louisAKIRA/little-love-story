"use client";

import { useSyncExternalStore } from "react";
import { birthday, birthdayFestival, festivals, type Festival } from "@/config/festivals";

const toNumber = (monthDay: string) => {
  const [month, day] = monthDay.split("-").map(Number);
  return month * 100 + day;
};

// หาเทศกาลของวันที่ที่ให้มา (วันเกิดมาก่อนเสมอ)
export function festivalFor(date: Date): Festival | null {
  const today = (date.getMonth() + 1) * 100 + date.getDate();
  if (/^\d{2}-\d{2}$/.test(birthday) && toNumber(birthday) === today) {
    return { ...birthdayFestival, from: birthday, to: birthday };
  }
  for (const festival of festivals) {
    if (festival.year !== undefined && festival.year !== date.getFullYear()) continue;
    const from = toNumber(festival.from);
    const to = toNumber(festival.to);
    const inRange = from <= to ? today >= from && today <= to : today >= from || today <= to;
    if (inRange) return festival;
  }
  return null;
}

// ใช้ id เป็น snapshot เพราะต้องเป็นค่าคงที่ระหว่าง render (object ใหม่ทุกครั้งจะทำให้ render วน)
// ?festival=<id> บังคับเทศกาล, ?festival=none ปิดเทศกาล (ไว้ลองดูหน้าตา)
function festivalIdSnapshot(): string {
  const forced = new URLSearchParams(window.location.search).get("festival");
  if (forced) return forced;
  return festivalFor(new Date())?.id ?? "none";
}

const subscribeEveryMinute = (onChange: () => void) => {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
};

// ตอน build ยังไม่รู้วันที่ของคนเปิด จึงเริ่มแบบไม่มีเทศกาลก่อน แล้วค่อยเปลี่ยนในเครื่อง
export function useFestival(): Festival | null {
  const id = useSyncExternalStore(subscribeEveryMinute, festivalIdSnapshot, () => "none");
  if (id === "none") return null;
  if (id === birthdayFestival.id) return { ...birthdayFestival, from: birthday, to: birthday };
  return festivals.find((festival) => festival.id === id) ?? null;
}
