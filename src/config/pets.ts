// =====================================================================
//  สัตว์เลี้ยง: หมา / แมว และสีขน
//  sprite เป็นตาราง 24 x 20 ช่อง แต่ละตัวอักษรคือ 1 พิกเซล
//
//  เส้นขอบสีเข้มรอบตัวน้องถูกวาดให้อัตโนมัติ ไม่ต้องวาดเอง
//  แต่ต้องเว้นขอบตารางไว้ 1 ช่องรอบด้าน ไม่งั้นเส้นขอบด้านนั้นจะหาย
//
//  ตัวอักษรที่ใช้
//    .  = โปร่งใส            o = เส้นสีเข้ม (ไว้วาดเส้นด้านใน)
//    f  = สีขน               F = ขนส่วนเงา/หู     g = ขนส่วนสว่าง (ปาก พุง เท้า)
//    i  = ในหู               c = แก้ม
//    e  = ตา                 w = ประกายตา
//    n  = จมูก               m = ปาก              t = ลิ้น
// =====================================================================

export type PetKind = "cat" | "dog";
export type PetKindOption = { id: PetKind; name: string; emoji: string };
export type Coat = { id: string; name: string; color: string; detail: string };

export const PET_WIDTH = 24;
export const PET_HEIGHT = 20;

export const petKinds: PetKindOption[] = [
  { id: "cat", name: "แมว", emoji: "🐱" },
  { id: "dog", name: "หมา", emoji: "🐶" },
];

// color = สีขนหลัก, detail = สีขนส่วนเงา (เข้มกว่า)
export const coats: Coat[] = [
  { id: "cream", name: "ครีม", color: "#F6DDB4", detail: "#D3A56A" },
  { id: "orange", name: "ส้ม", color: "#F4B56F", detail: "#C77C36" },
  { id: "brown", name: "น้ำตาล", color: "#B07858", detail: "#7A4C33" },
  { id: "gray", name: "เทา", color: "#B9C0CC", detail: "#7F8A9D" },
  { id: "black", name: "ดำ", color: "#6B6676", detail: "#45404F" },
  { id: "white", name: "ขาว", color: "#FFF9F1", detail: "#D9CBCF" },
  { id: "pink", name: "ชมพู", color: "#F4ACCB", detail: "#D0739F" },
];

const EMPTY = "........................";
const blank = (count: number) => Array.from({ length: count }, () => EMPTY);

export const petSprites: Record<PetKind, string[]> = {
  cat: [
    EMPTY,
    ".....ff..........ff.....",
    "....fiif........fiif....",
    "....fiiff......ffiif....",
    "....ffffffffffffffff....",
    "...ffgggfffffffffffff...",
    "...fggffffffffffffffF...",
    "...ffffweffffffwefffF...",
    "...ffffeeffffffeefffF...",
    "...ffffeeffffffeefffF...",
    "...ffccfffgnngfffccfF...",
    "....fffffgmggmgffffF....",
    ".....FfffggmmggfffF.....",
    ".......fffffffffF....f..",
    "......fffggggggffF...ff.",
    "......fffggggggffF..fff.",
    ".....ffffggggggfffffff..",
    ".....FfffggggggfffFff...",
    "......ggggFFFFgggg......",
    EMPTY,
  ],
  dog: [
    EMPTY,
    EMPTY,
    ".......ffffffffff.......",
    ".....ffgggfffffffff.....",
    "...FFfggfffffffffffFF...",
    "..FFFffffffffffffffFFF..",
    "..FFFffffffffffffffFFF..",
    "..FFFffweffffffweffFFF..",
    "..FFFffeeffffffeeffFFF..",
    "..FFFffeefggggfeeffFFF..",
    "..FFFccfgggnngggfccFFF..",
    "...FFfffggmttmggfffFF...",
    ".....FFffggttggffFF.....",
    ".......fffffffffF..ff...",
    "......fffggggggffF.ff...",
    "......fffggggggffFff....",
    ".....ffffggggggfffF.....",
    ".....FfffggggggfffF.....",
    "......ggggFFFFgggg......",
    EMPTY,
  ],
};

// เฟรมขยับของน้อง: แถวที่ระบุจะถูกแทนที่ชั่วครู่ (เลขคือลำดับแถว เริ่มนับจาก 0)
// blink = หลับตา, tail = หางอีกท่าหนึ่ง (สลับกับท่าปกติเป็นการกระดิกหาง)
export const petBlinkRows: Record<PetKind, Record<number, string>> = {
  cat: {
    7: "...fffffffffffffffffF...",
    9: "...fffffffffffffffffF...",
  },
  dog: {
    7: "..FFFffffffffffffffFFF..",
    9: "..FFFfffffggggfffffFFF..",
  },
};

export const petTailRows: Record<PetKind, Record<number, string>> = {
  cat: {
    13: ".......fffffffffF.......",
    14: "......fffggggggffF......",
    15: "......fffggggggffF...ff.",
    16: ".....ffffggggggffffffff.",
  },
  dog: {
    13: ".......fffffffffF.......",
    14: "......fffggggggffF..ff..",
    15: "......fffggggggffFfff...",
  },
};

// =====================================================================
//  เครื่องประดับน้อง แยกเป็นหมวด เลือกได้หมวดละ 1 อย่าง ใส่ข้ามหมวดพร้อมกันได้
//
//  petAccessoryCategories = หมวดและลำดับแท็บที่แสดงในหน้าเกม
//  petAccessories = ของแต่ละชิ้น ลำดับใน array คือลำดับการวาดทับ (อันหลังอยู่บนสุด)
//  หมากับแมวหัวไม่เท่ากัน เลยแยก rows ของแต่ละตัว (ชิ้นไหนใช้ร่วมกันได้ก็ใส่ชุดเดียวกัน)
// =====================================================================
export type PetAccessoryCategory = { id: string; name: string; emoji: string };

export type PetAccessory = {
  id: string;
  category: string;
  name: string;
  emoji: string;
  palette: Record<string, string>;
  rows: Record<PetKind, string[]>;
};

export const petAccessoryCategories: PetAccessoryCategory[] = [
  { id: "head", name: "บนหัว", emoji: "🎀" },
  { id: "face", name: "ใบหน้า", emoji: "🕶️" },
  { id: "neck", name: "คอ", emoji: "🔔" },
];

const both = (rows: string[]): Record<PetKind, string[]> => ({ cat: rows, dog: rows });

export const petAccessories: PetAccessory[] = [
  // ---------- คอ ----------
  {
    id: "collar",
    category: "neck",
    name: "ปลอกคอกระดิ่ง",
    emoji: "🔔",
    palette: { r: "#8B5CF6", y: "#FFD15C", Y: "#E0A52E" },
    rows: both([
      ...blank(13),
      ".......rrrryyrrrr.......",
      "...........yY...........",
    ]),
  },
  {
    id: "bandana",
    category: "neck",
    name: "ผ้าพันคอ",
    emoji: "🧣",
    palette: { a: "#EF6A5B", w: "#FFFFFF" },
    rows: both([
      ...blank(13),
      ".......aaaaaaaaaa.......",
      ".........awaawa.........",
      "..........aaaa..........",
      "...........aa...........",
    ]),
  },
  {
    id: "bowtie",
    category: "neck",
    name: "โบว์หูกระต่าย",
    emoji: "🎗️",
    palette: { p: "#5B8DEF", P: "#3E6BC4", k: "#2F55A3" },
    rows: both([
      ...blank(13),
      ".........ppkkpp.........",
      ".........pP..Pp.........",
    ]),
  },

  // ---------- ใบหน้า ----------
  {
    id: "sunglasses",
    category: "face",
    name: "แว่นกันแดด",
    emoji: "🕶️",
    palette: { k: "#3A2733", L: "#9C8DB5" },
    rows: both([
      ...blank(7),
      "......kLkk....kLkk......",
      "......kkkkkkkkkkkk......",
      ".......kk......kk.......",
    ]),
  },

  // ---------- บนหัว ----------
  {
    id: "bow",
    category: "head",
    name: "โบว์",
    emoji: "🎀",
    palette: { p: "#F45C8E", P: "#C93F72", k: "#A82E5C" },
    rows: {
      cat: [
        ...blank(3),
        "............pp...pp.....",
        "............pppkppp.....",
        "............pP...Pp.....",
      ],
      dog: [
        EMPTY,
        "............pp...pp.....",
        "............pppkppp.....",
        "............pP...Pp.....",
      ],
    },
  },
  {
    id: "party-hat",
    category: "head",
    name: "หมวกปาร์ตี้",
    emoji: "🥳",
    palette: { a: "#8B5CF6", b: "#FFD15C", y: "#FF8FB8", w: "#FFFFFF" },
    rows: both([
      EMPTY,
      "...........yy...........",
      "..........abab..........",
      ".........bababa.........",
      "........wwwwwwww........",
    ]),
  },
  {
    id: "santa-hat",
    category: "head",
    name: "หมวกซานต้า",
    emoji: "🎅",
    palette: { a: "#E5484D", A: "#B8323A", w: "#FFFFFF" },
    rows: both([
      EMPTY,
      "............aaaw........",
      "..........aaaaAw........",
      ".........aaaaaA.........",
      "........wwwwwwww........",
    ]),
  },
  {
    id: "crown",
    category: "head",
    name: "มงกุฎ",
    emoji: "👑",
    palette: { y: "#FFD15C", r: "#EF4F80" },
    rows: both([
      ...blank(2),
      ".........y.yy.y.........",
      ".........yyyyyy.........",
      ".........yryyry.........",
    ]),
  },
  {
    id: "flower",
    category: "head",
    name: "ดอกไม้ทัดหู",
    emoji: "🌸",
    palette: { p: "#FF8FB8", y: "#FFE066" },
    rows: {
      cat: [
        ...blank(3),
        "......p.................",
        ".....pyp................",
        "......p.................",
      ],
      dog: [
        ...blank(4),
        ".....p..................",
        "....pyp.................",
        ".....p..................",
      ],
    },
  },
];
