// =====================================================================
//  ตัวละครหญิง: สีผิว / ทรงผม / สีผม / เสื้อผ้า
//  sprite เป็นตาราง 16 x 26 ช่อง แต่ละตัวอักษรคือ 1 พิกเซล
//
//  ตัวอักษรที่ใช้
//    .  = โปร่งใส
//    s  = ผิว          e = ตา          m = ปาก         c = แก้ม        k = รองเท้า
//    h  = ผม           r = โบว์/ริบบิ้น (สีชมพูคงที่)
//    a  = สีหลักของชุด b = สีรองของชุด  w = สีขาวตกแต่ง
// =====================================================================

export const GIRL_WIDTH = 16;
export const GIRL_HEIGHT = 26;

export type SkinTone = { id: string; name: string; color: string };
export type HairColor = { id: string; name: string; color: string };
export type HairStyle = { id: string; name: string; rows: string[] };
export type Outfit = { id: string; name: string; colors: { a: string; b: string }; rows: string[] };

export const skinTones: SkinTone[] = [
  { id: "porcelain", name: "ขาวอมชมพู", color: "#FFE3D2" },
  { id: "fair", name: "ขาวเหลือง", color: "#F7CFAA" },
  { id: "tan", name: "น้ำผึ้ง", color: "#E0A77C" },
  { id: "brown", name: "น้ำตาล", color: "#B97A5A" },
  { id: "deep", name: "เข้ม", color: "#7D4B35" },
];

export const hairColors: HairColor[] = [
  { id: "black", name: "ดำ", color: "#2F2A35" },
  { id: "brown", name: "น้ำตาล", color: "#6E4634" },
  { id: "chestnut", name: "น้ำตาลแดง", color: "#A0553B" },
  { id: "blonde", name: "ทอง", color: "#E9C57F" },
  { id: "pink", name: "ชมพู", color: "#F2A3C4" },
  { id: "lavender", name: "ม่วง", color: "#A58BDD" },
];

// ลำตัว (ไม่มีผม ไม่มีเสื้อผ้า) หัวอยู่คอลัมน์ 4-11 แถว 3-11 ขาอยู่แถว 21-23
export const bodyRows: string[] = [
  "................",
  "................",
  "................",
  ".....ssssss.....",
  "....ssssssss....",
  "....ssssssss....",
  "....ssssssss....",
  "....ssessess....",
  "....scsssscs....",
  "....sssmmsss....",
  ".....ssssss.....",
  "......ssss......",
  ".......ss.......",
  "....ssssssss....",
  "...ssssssssss...",
  "...ssssssssss...",
  "...ssssssssss...",
  "...ssssssssss...",
  ".....ssssss.....",
  ".....ssssss.....",
  ".....ssssss.....",
  ".....ss..ss.....",
  ".....ss..ss.....",
  ".....ss..ss.....",
  "....kkk..kkk....",
  "....kkk..kkk....",
];

export const hairStyles: HairStyle[] = [
  {
    id: "bob",
    name: "บ๊อบสั้น",
    rows: [
      "................",
      "......hhhh......",
      ".....hhhhhh.....",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "...hhhhhhhhhh...",
      "...hh......hh...",
      "...hh......hh...",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "...hh......hh...",
    ],
  },
  {
    id: "long",
    name: "ยาวตรง",
    rows: [
      "................",
      "......hhhh......",
      ".....hhhhhh.....",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "...hhhhhhhhhh...",
      "...hh......hh...",
      "...hh......hh...",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "..hhh......hhh..",
      "...hh......hh...",
      "...hh......hh...",
    ],
  },
  {
    id: "twintails",
    name: "มัดสองข้าง",
    rows: [
      "................",
      "......hhhh......",
      ".....hhhhhh.....",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "...hhhhhhhhhh...",
      "..rhh......hhr..",
      ".hhhh......hhhh.",
      ".hhh........hhh.",
      ".hhh........hhh.",
      ".hhh........hhh.",
      ".hhh........hhh.",
      "..hh........hh..",
      "..hh........hh..",
      "..h..........h..",
    ],
  },
  {
    id: "bun",
    name: "มวยผม",
    rows: [
      ".......hh.......",
      "......hhhh......",
      ".....hhrrhh.....",
      "....hhhhhhhh....",
      "...hhhhhhhhhh...",
      "...hh.hhhhhhh...",
      "...h........h...",
      "...h........h...",
    ],
  },
  {
    id: "ponytail",
    name: "หางม้า",
    rows: [
      "................",
      "......hhhh......",
      ".....hhhhhh.....",
      "....hhhhhhhhr...",
      "...hhhhhhhhhhh..",
      "...hhhhhhhhhhh..",
      "...h........hh..",
      "...h........hh..",
      "............hh..",
      "............hh..",
      "............hh..",
      "............hh..",
      ".............h..",
      ".............h..",
    ],
  },
];

// เสื้อผ้า วาดทับลำตัวตั้งแต่แถว 13 ลงไป (แถว 0-12 เว้นว่างไว้)
const blank = Array.from({ length: 13 }, () => "................");

export const outfits: Outfit[] = [
  {
    id: "dress",
    name: "เดรสชมพู",
    colors: { a: "#F6A5C6", b: "#FFFFFF" },
    rows: [
      ...blank,
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....bbbbbb.....",
      "....aaaaaaaa....",
      "...aaaaaaaaaa...",
      "...aaaaaaaaaa...",
      "...aaaaaaaaaa...",
    ],
  },
  {
    id: "tee-skirt",
    name: "เสื้อยืด + กระโปรง",
    colors: { a: "#FFF4D6", b: "#8B5CF6" },
    rows: [
      ...blank,
      ".....aaaaaa.....",
      "....aaaaaaaa....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....bbbbbb.....",
      "....bbbbbbbb....",
      "....bbbbbbbb....",
    ],
  },
  {
    id: "overalls",
    name: "เอี๊ยมยีนส์",
    colors: { a: "#6F8FD1", b: "#FFF9F1" },
    rows: [
      ...blank,
      ".....bbbbbb.....",
      "....bbabbabb....",
      ".....babbab.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....aa..aa.....",
      ".....aa..aa.....",
    ],
  },
  {
    id: "hoodie",
    name: "ฮู้ดดี้",
    colors: { a: "#B8E1C9", b: "#4E6B5C" },
    rows: [
      ...blank,
      "....aaaaaaaa....",
      "...aaaaaaaaaa...",
      "...aaawaawaaa...",
      "...aaaaaaaaaa...",
      "...aaabbbbaaa...",
      ".....aaaaaa.....",
      ".....bbbbbb.....",
      ".....bbbbbb.....",
    ],
  },
  {
    id: "sailor",
    name: "ชุดกะลาสี",
    colors: { a: "#FFFFFF", b: "#3F4F8C" },
    rows: [
      ...blank,
      ".....bbbbbb.....",
      "....babaabab....",
      ".....aabbaa.....",
      ".....aaaaaa.....",
      ".....aaaaaa.....",
      ".....bbbbbb.....",
      "....bbbbbbbb....",
      "....bbbbbbbb....",
    ],
  },
];
