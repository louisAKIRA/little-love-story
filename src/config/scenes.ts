// =====================================================================
//  ฉากหลังที่เลือกได้ในหน้าสุดท้าย (ลำดับในนี้คือลำดับปุ่ม)
//  indoor = ฉากในร่ม (ไม่มีหิมะหรือโคมลอยตกลงมาในห้อง)
//  หน้าตาของแต่ละฉากอยู่ใน src/components/Scene.tsx, src/lib/scene.ts และ src/app/globals.css
//  ลุคสำเร็จรูปใน looks.ts เลือกฉากให้เองได้ ด้วยช่อง scene
// =====================================================================

export type SceneId = "meadow" | "pond" | "mountain" | "beach" | "sunset" | "cafe" | "bedroom";
export type SceneOption = { id: SceneId; name: string; emoji: string; indoor: boolean };

export const scenes: SceneOption[] = [
  { id: "meadow", name: "ทุ่งดอกไม้", emoji: "🌷", indoor: false },
  { id: "pond", name: "สนามหญ้าริมสระ", emoji: "🌼", indoor: false },
  { id: "mountain", name: "ดอยตอนเช้า", emoji: "⛰️", indoor: false },
  { id: "beach", name: "ชายหาด", emoji: "🏖️", indoor: false },
  { id: "sunset", name: "หาดพระอาทิตย์ตก", emoji: "🌅", indoor: false },
  { id: "cafe", name: "คาเฟ่", emoji: "☕", indoor: true },
  { id: "bedroom", name: "ห้องนอน", emoji: "🛏️", indoor: true },
];
