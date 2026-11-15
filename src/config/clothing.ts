// =====================================================================
//  เสื้อผ้าแยกชิ้น: เลือกทีละชิ้นได้อิสระ หรือกดลุคสำเร็จรูปใน looks.ts เพื่อใส่ทั้งชุด
//  sprite เป็นตาราง 24 x 34 ช่อง เหมือนตัวละคร (ดูตำแหน่งลำตัวใน character.ts)
//
//  หมวด (slot)
//    dress  = เดรส / ชุดเต็มตัว (ใส่แล้วจะถอดเสื้อกับกางเกงออกให้)
//    top    = เสื้อ            bottom = กางเกง / กระโปรง
//    outer  = เสื้อคลุม (ไม่ใส่ก็ได้)      shoes = รองเท้า
//
//  ตัวอักษรใน rows ใช้สีจาก palette ของชิ้นนั้น
//    ตัวพิมพ์ใหญ่ = เงาของสีเดียวกัน ระบบคำนวณให้เอง ไม่ต้องใส่ใน palette (จะใส่เองก็ได้)
//    s = สีผิวของตัวละคร (เผื่อวาดนิ้วเท้าหรือช่องว่างของเสื้อ)
//
//  ลำดับใน array คือลำดับการวาดทับ: รองเท้า → กางเกง → เสื้อ → เดรส → เสื้อคลุม
// =====================================================================

export type ClothingSlot = "dress" | "top" | "bottom" | "outer" | "shoes";

export type ClothingPiece = {
  id: string;
  slot: ClothingSlot;
  name: string;
  palette: Record<string, string>;
  rows: string[];
};

// ลำดับแท็บในหน้าเกม optional = มีปุ่ม "ไม่ใส่"
export const clothingSlots: { id: ClothingSlot; name: string; emoji: string; optional: boolean }[] = [
  { id: "dress", name: "เดรส", emoji: "👗", optional: true },
  { id: "top", name: "เสื้อ", emoji: "👚", optional: false },
  { id: "bottom", name: "กางเกง / กระโปรง", emoji: "🩳", optional: false },
  { id: "outer", name: "เสื้อคลุม", emoji: "🧥", optional: true },
  { id: "shoes", name: "รองเท้า", emoji: "👟", optional: false },
];

// ชิ้นที่ใส่ให้เองเมื่อหมวดนั้นว่าง (ตัวละครจะไม่มีวันตัวเปล่า)
export const defaultTopId = "tee-cream";
export const defaultBottomId = "shorts-white";
export const defaultShoesId = "shoes-brown";
// ชุดเริ่มต้นของตัวละครใหม่
export const defaultClothesIds = ["dress-pink", "shoes-brown"];

const EMPTY = "........................";
const blank = (count: number) => Array.from({ length: count }, () => EMPTY);

const shortsRows = [...blank(26), "........aaaaaaaa........", "........aaa..aaA........"];
const skirtRows = [
  ...blank(24),
  "........aaaaaaaa........",
  ".......aaAaaaaAaa.......",
  "......aaaAaaaaAaaA......",
  "......AAAAAAAAAAAA......",
];
const openShirtRows = [
  ...blank(20),
  ".......aa......aa.......",
  "......aaa......aaa......",
  "......aaa......aaa......",
  "......aaa......aaa......",
  "......AAa......aAA......",
  "........a......a........",
  "........A......A........",
];

export const clothing: ClothingPiece[] = [
  // ---------- รองเท้า ----------
  {
    id: "shoes-brown",
    slot: "shoes",
    name: "รองเท้าหนัง",
    palette: { k: "#5A3A4A", K: "#7C566B" },
    rows: [...blank(31), "........kkk..kkk........", "........kkK..kkK........"],
  },
  {
    id: "flats-white",
    slot: "shoes",
    name: "ส้นเตี้ยสีขาว",
    palette: { a: "#FFFFFF" },
    rows: [...blank(32), "........aaa..aaA........"],
  },
  {
    id: "sandals-cream",
    slot: "shoes",
    name: "รองเท้าแตะสองสาย",
    palette: { a: "#F6ECD8", b: "#B8895E" },
    rows: [...blank(31), ".........aa..aa.........", "........bbb..bbb........"],
  },
  {
    id: "clogs-socks",
    slot: "shoes",
    name: "ถุงเท้าขาว + หัวโต",
    palette: { w: "#FFFFFF", c: "#E8DCC0", y: "#FFD23F" },
    rows: [
      ...blank(29),
      ".........ww..ww.........",
      ".........ww..wW.........",
      "........ccc..ccc........",
      "........cyc..cyC........",
    ],
  },
  { id: "barefoot", slot: "shoes", name: "เท้าเปล่า", palette: {}, rows: [] },

  // ---------- กางเกง / กระโปรง ----------
  { id: "shorts-white", slot: "bottom", name: "ขาสั้นขาว", palette: { a: "#FFFFFF" }, rows: shortsRows },
  { id: "shorts-pink", slot: "bottom", name: "ขาสั้นชมพู", palette: { a: "#F9C6D3" }, rows: shortsRows },
  { id: "shorts-black", slot: "bottom", name: "ขาสั้นดำ", palette: { a: "#4A4553" }, rows: shortsRows },
  { id: "shorts-green", slot: "bottom", name: "ขาสั้นเขียว", palette: { a: "#4E6B5C" }, rows: shortsRows },
  { id: "skirt-purple", slot: "bottom", name: "กระโปรงม่วง", palette: { a: "#8B5CF6" }, rows: skirtRows },
  { id: "skirt-navy", slot: "bottom", name: "กระโปรงกรม", palette: { a: "#3F4F8C" }, rows: skirtRows },
  {
    id: "trousers-white",
    slot: "bottom",
    name: "ขายาวขาบาน",
    palette: { a: "#FFFFFF" },
    rows: [
      ...blank(24),
      "........aaaaaaaa........",
      "........aaaaaaaA........",
      "........aaaaaaaA........",
      ".......aaaa..aaaA.......",
      ".......aaaa..aaaA.......",
      ".......aaaa..aaaA.......",
      ".......aaaA..aaAA.......",
    ],
  },
  {
    id: "bikini-bottom-blue",
    slot: "bottom",
    name: "บิกินี่ฟ้า (ล่าง)",
    palette: { a: "#8CC9DD", p: "#C4E6F0" },
    rows: [...blank(25), "........apaaaapa........", ".........aaaaaa........."],
  },
  {
    id: "bikini-bottom-black",
    slot: "bottom",
    name: "บิกินี่ดำ (ล่าง)",
    palette: { a: "#4A4553" },
    rows: [...blank(25), "........aaaaaaaa........", ".........aaaaaa........."],
  },

  // ---------- เสื้อ ----------
  {
    id: "tee-cream",
    slot: "top",
    name: "เสื้อยืดครีม",
    palette: { a: "#FFF4D6", r: "#EF4F80" },
    rows: [
      ...blank(20),
      ".......aaaaaaaaaa.......",
      "......aaaaaaaaaaaA......",
      "........aaarraaA........",
      "........aaaaaaaA........",
      "........aaaaaaaA........",
      "........AAAAAAAA........",
    ],
  },
  {
    id: "sailor-top",
    slot: "top",
    name: "เสื้อกะลาสี",
    palette: { a: "#FFFFFF", b: "#3F4F8C", r: "#EF4F80" },
    rows: [
      ...blank(20),
      ".......bbbaaaabbb.......",
      "......aabbbaabbbaa......",
      "........aabrrbaA........",
      "........aaarraaA........",
      "........aaaaaaaA........",
      "........bbbbbbbb........",
    ],
  },
  {
    id: "hoodie-mint",
    slot: "top",
    name: "ฮู้ดดี้มิ้นต์",
    palette: { a: "#B8E1C9", w: "#FFFFFF" },
    rows: [
      ...blank(19),
      "........aaaaaaaa........",
      "......aaaaaaaaaaaa......",
      "......aaaawaawaaaA......",
      "......aaaawaawaaaA......",
      "......aaaaaaaaaaaA......",
      "......AAaAAAAAAaAA......",
      "........aAAAAAAa........",
      "........AAAAAAAA........",
    ],
  },
  {
    id: "peplum-cream",
    slot: "top",
    name: "เสื้อครีมชายระบาย",
    palette: { a: "#FFF6DF" },
    rows: [
      ...blank(20),
      ".........aaaaaa.........",
      "........aaaaaaaa........",
      "........aaaaaaaA........",
      "........aAaaaAaA........",
      ".......aaaaaaaaaA.......",
      ".......aAaaAaaAaA.......",
      ".......AAAAAAAAAA.......",
    ],
  },
  {
    id: "puff-pink",
    slot: "top",
    name: "เสื้อแขนพองชมพู",
    palette: { a: "#F9C6D3" },
    rows: [
      ...blank(20),
      ".....aaaa......aaaa.....",
      ".....aaaaaaaaaaaaaa.....",
      "......AAaaaaaaaaAA......",
      "........aAaaaaAa........",
      "........AAAAAAAA........",
    ],
  },
  {
    id: "longsleeve-black",
    slot: "top",
    name: "เสื้อแขนยาวดำ",
    palette: { a: "#4A4553" },
    rows: [
      ...blank(20),
      ".......aaaaaaaaaa.......",
      "......aaaaaaaaaaaA......",
      "......aaaaaaaaaaaA......",
      "......aaaaaaaaaaaA......",
      "......AAaaaaaaaaAA......",
      "........aaaaaaaA........",
    ],
  },
  {
    id: "bandeau-floral",
    slot: "top",
    name: "เกาะอกลายดอก",
    palette: { t: "#1F8A9B", w: "#FFFFFF" },
    rows: [
      ...blank(21),
      "........twttwttt........",
      "........ttwttwtT........",
      "...........t............",
      "...........t............",
    ],
  },
  {
    id: "bikini-top-blue",
    slot: "top",
    name: "บิกินี่ฟ้า (บน)",
    palette: { a: "#8CC9DD", p: "#C4E6F0" },
    rows: [...blank(20), ".........a....a.........", "........apa..apa........", "........aaaaaaaa........"],
  },
  {
    id: "bikini-top-black",
    slot: "top",
    name: "บิกินี่ดำติดดอกไม้",
    palette: { a: "#4A4553", y: "#FFD23F" },
    rows: [...blank(20), ".........a....a.........", "........aaa..yaa........", "........aaaaaaaa........"],
  },

  // ---------- เดรส / ชุดเต็มตัว ----------
  {
    id: "dress-pink",
    slot: "dress",
    name: "เดรสชมพู",
    palette: { a: "#F6A5C6", b: "#FFFFFF", w: "#FFFFFF" },
    rows: [
      ...blank(20),
      ".......aaawwwwaaa.......",
      "......aaaaawwaaaaa......",
      "........aaaaaaaA........",
      "........bbbbbbbb........",
      "........aaaaaaaA........",
      ".......aaaaaaaaaA.......",
      "......aaaAaaaaAaaA......",
      "......AAAAAAAAAAAA......",
    ],
  },
  {
    id: "maxi-white",
    slot: "dress",
    name: "เดรสยาวเกาะอกขาว",
    palette: { a: "#FFFFFF" },
    rows: [
      ...blank(21),
      "........aaaaaaaa........",
      "........aaaaaaaA........",
      "........aaaaaaaA........",
      "........AAAAAAAA........",
      ".......aaaaaaaaaA.......",
      "......aaaaaaaaaaaA......",
      "......aaaAaaaaAaaA......",
      "......aaaAaaaaAaaA......",
      ".....aaaaAaaaaAaaaA.....",
      ".....AAAAAAAAAAAAAA.....",
    ],
  },
  {
    id: "polka-dress",
    slot: "dress",
    name: "เดรสสั้นลายจุด",
    palette: { a: "#FBF1DC", d: "#3A3540" },
    rows: [
      ...blank(20),
      ".........a....a.........",
      "........aadaadaa........",
      "........adaaaada........",
      "........aaadaaaa........",
      ".......aaaaaaaaaa.......",
      "......adaaadaaadaA......",
      "......AAAAAAAAAAAA......",
      "......aaadaaadaaaA......",
      "......AAAAAAAAAAAA......",
    ],
  },
  {
    id: "overalls",
    slot: "dress",
    name: "เอี๊ยมยีนส์",
    palette: { a: "#6F8FD1", b: "#FFF9F1", w: "#FFFFFF" },
    rows: [
      ...blank(20),
      ".......bbbbbbbbbb.......",
      "......bbbabbbbabbb......",
      "........bwaaaawb........",
      "........aaaaaaaA........",
      "........aaAAAAaA........",
      "........aaaaaaaA........",
      "........aaaaaaaA........",
      ".........aa..aA.........",
      ".........aa..aA.........",
      ".........aa..aA.........",
      ".........AA..AA.........",
    ],
  },

  // ---------- เสื้อคลุม ----------
  { id: "shirt-white", slot: "outer", name: "เชิ้ตขาวบาง", palette: { a: "#FFFFFF" }, rows: openShirtRows },
  { id: "jacket-denim", slot: "outer", name: "แจ็กเก็ตยีนส์", palette: { a: "#6F8FD1" }, rows: openShirtRows },
];
