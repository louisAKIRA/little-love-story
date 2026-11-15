// =====================================================================
//  ฉากหลังที่เลือกได้ในหน้าสุดท้าย
//  indoor = ฉากในร่ม (ไม่มีหิมะหรือโคมลอยตกลงมาในห้อง)
//  หน้าตาของแต่ละฉากอยู่ใน src/components/Scene.tsx และ src/app/globals.css
// =====================================================================

export type SceneId = "meadow" | "beach" | "cafe" | "bedroom";
export type SceneOption = { id: SceneId; name: string; emoji: string; indoor: boolean };

export const scenes: SceneOption[] = [
  { id: "meadow", name: "ทุ่งดอกไม้", emoji: "🌷", indoor: false },
  { id: "beach", name: "ชายหาด", emoji: "🏖️", indoor: false },
  { id: "cafe", name: "คาเฟ่", emoji: "☕", indoor: true },
  { id: "bedroom", name: "ห้องนอน", emoji: "🛏️", indoor: true },
];
