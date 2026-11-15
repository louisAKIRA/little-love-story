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

// =====================================================================
//  เครื่องประดับน้อง (เลือกได้หลายอัน)
//  หมากับแมวหัวไม่เท่ากัน เลยแยก rows ของแต่ละตัว
// =====================================================================
export type PetAccessory = {
  id: string;
  name: string;
  emoji: string;
  palette: Record<string, string>;
  rows: Record<PetKind, string[]>;
};

const collarRows = [
  ...blank(13),
  ".......rrrryyrrrr.......",
  "...........yY...........",
];

export const petAccessories: PetAccessory[] = [
  {
    id: "collar",
    name: "ปลอกคอกระดิ่ง",
    emoji: "🔔",
    palette: { r: "#8B5CF6", y: "#FFD15C", Y: "#E0A52E" },
    rows: { cat: collarRows, dog: collarRows },
  },
  {
    id: "bow",
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
];
