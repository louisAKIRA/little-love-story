// =====================================================================
//  ลุคสำเร็จรูป: กดครั้งเดียวใส่ทั้งชุด (เสื้อผ้า + เครื่องประดับ) แล้วยังแก้ทีละชิ้นต่อได้
//  ออกแบบจากชุดจริงของหวาน
//
//  clothes     = id ของเสื้อผ้าใน clothing.ts
//  accessories = id ของเครื่องประดับใน character.ts
//  เพิ่มลุคใหม่ได้ โดยเพิ่ม object ในรายการนี้
// =====================================================================

export type PresetLook = {
  id: string;
  name: string;
  emoji: string;
  clothes: string[];
  accessories: string[];
};

export const presetLooks: PresetLook[] = [
  {
    id: "white-maxi",
    name: "เดรสขาวริมสระ",
    emoji: "🤍",
    clothes: ["maxi-white", "flats-white"],
    accessories: [],
  },
  {
    id: "rose-day",
    name: "วันได้ช่อกุหลาบ",
    emoji: "🌹",
    clothes: ["peplum-cream", "shorts-white", "sandals-cream"],
    accessories: ["rose-bouquet", "iced-tea"],
  },
  {
    id: "pink-cafe",
    name: "ชมพูหวานในคาเฟ่",
    emoji: "🎀",
    clothes: ["puff-pink", "shorts-pink", "flats-white"],
    accessories: ["iced-tea"],
  },
  {
    id: "mountain-morning",
    name: "ขึ้นดอยตอนเช้า",
    emoji: "⛰️",
    clothes: ["longsleeve-black", "shorts-black", "clogs-socks"],
    accessories: ["sunglasses", "coffee"],
  },
  {
    id: "polka-dot",
    name: "เดรสลายจุด",
    emoji: "🖤",
    clothes: ["polka-dress", "sandals-cream"],
    accessories: [],
  },
  {
    id: "boat-day",
    name: "วันล่องเรือ",
    emoji: "⛵",
    clothes: ["bikini-top-blue", "bikini-bottom-blue", "barefoot"],
    accessories: [],
  },
  {
    id: "cap-chill",
    name: "สายชิลใส่หมวกแก๊ป",
    emoji: "🧢",
    clothes: ["bandeau-floral", "trousers-white", "shirt-white", "sandals-cream"],
    accessories: ["cap", "sunglasses"],
  },
  {
    id: "sunset-beach",
    name: "ชายหาดตอนเย็น",
    emoji: "🌅",
    clothes: ["bikini-top-black", "bikini-bottom-black", "barefoot"],
    accessories: [],
  },
];
