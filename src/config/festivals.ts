// =====================================================================
//  ฉากตามเทศกาล: เปลี่ยนเองตามวันที่ในเครื่องของคนเปิด
//
//  from / to   = ช่วงวันที่แบบ "เดือน-วัน" รวมวันแรกและวันสุดท้าย ข้ามปีได้ (เช่น 12-27 ถึง 01-05)
//  year        = ใส่เมื่อเทศกาลนั้นวันไม่ตรงกันทุกปี (เช่น ลอยกระทง) ปีอื่นต้องมาแก้วันที่เอง
//  greeting    = แถบข้อความใต้หัวข้อ ใส่ {name} กับ {pet} ได้
//  particles   = ของที่ลอยในฉาก: glyphs = ตัวอักษร/อีโมจิ, motion = fall (ตก) / rise (ลอยขึ้น) / float (ลอยไปมา)
//                outdoorOnly = true คือไม่แสดงในฉากในร่ม
//  snowyGround = ทุ่งดอกไม้กลายเป็นทุ่งหิมะ
//  petHat      = id เครื่องประดับของน้อง (ดูใน pets.ts) ใส่ให้เองถ้าน้องยังไม่ได้ใส่อะไรบนหัว
//
//  ถ้าตรงกันหลายเทศกาล จะใช้อันที่อยู่ก่อนในรายการ
//  ลองดูหน้าตาเทศกาลได้ทุกวัน โดยเติม ?festival=christmas ท้ายลิงก์ (ใช้ id ของเทศกาล)
// =====================================================================

export type FestivalParticles = {
  glyphs: string[];
  motion: "fall" | "rise" | "float";
  color?: string;
  outdoorOnly?: boolean;
};

export type Festival = {
  id: string;
  name: string;
  from: string;
  to: string;
  year?: number;
  greeting: string;
  particles?: FestivalParticles;
  snowyGround?: boolean;
  petHat?: string;
};

// วันเกิดของหวาน แบบ "เดือน-วัน" เช่น "03-21" (ปล่อยว่างไว้ = ไม่ใช้)
export const birthday = "";

export const birthdayFestival: Omit<Festival, "from" | "to"> = {
  id: "birthday",
  name: "วันเกิด",
  greeting: "🎂 สุขสันต์วันเกิดนะ{name} ปีนี้ขอให้ยิ้มเยอะ ๆ เลย",
  particles: { glyphs: ["🎉", "✨", "🎈", "✨"], motion: "fall" },
  petHat: "party-hat",
};

export const festivals: Festival[] = [
  {
    id: "halloween",
    name: "ฮาโลวีน",
    from: "10-25",
    to: "10-31",
    greeting: "🎃 แฮปปี้ฮาโลวีนนะ{name} ระวังโดน{pet}หลอกเอาขนม",
    particles: { glyphs: ["🎃", "👻", "🦇", "👻"], motion: "float" },
  },
  {
    id: "loykrathong",
    name: "ลอยกระทง",
    from: "11-23",
    to: "11-25",
    year: 2026,
    greeting: "🏮 สุขสันต์วันลอยกระทงนะ{name} อธิษฐานแล้วเผื่อเค้าด้วยนะ",
    particles: { glyphs: ["🏮"], motion: "rise", outdoorOnly: true },
    petHat: "flower",
  },
  {
    id: "christmas",
    name: "คริสต์มาส",
    from: "12-01",
    to: "12-26",
    greeting: "🎄 เมอร์รี่คริสต์มาสนะ{name} หนาวแล้วใส่เสื้ออุ่น ๆ ด้วย",
    particles: { glyphs: ["❄", "•", "❄", "•"], motion: "fall", color: "#FFFFFF", outdoorOnly: true },
    snowyGround: true,
    petHat: "santa-hat",
  },
  {
    id: "newyear",
    name: "ปีใหม่",
    from: "12-27",
    to: "01-05",
    greeting: "🎆 สวัสดีปีใหม่นะ{name} ปีนี้ก็อยู่ด้วยกันต่อไปนะ",
    particles: { glyphs: ["✨", "🎉", "✨", "🎊"], motion: "fall" },
    petHat: "party-hat",
  },
  {
    id: "valentine",
    name: "วาเลนไทน์",
    from: "02-08",
    to: "02-14",
    greeting: "💘 สุขสันต์วันวาเลนไทน์นะ{name} เค้ารักที่สุดเลย",
    particles: { glyphs: ["♥", "♡", "♥"], motion: "rise", color: "#F45C8E" },
    petHat: "bow",
  },
  {
    id: "songkran",
    name: "สงกรานต์",
    from: "04-12",
    to: "04-16",
    greeting: "💦 สุขสันต์วันสงกรานต์นะ{name} เล่นน้ำแล้วอย่าลืมเช็ดผมให้แห้ง",
    particles: { glyphs: ["💧"], motion: "fall", outdoorOnly: true },
    petHat: "flower",
  },
];
