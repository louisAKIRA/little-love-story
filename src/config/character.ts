// =====================================================================
//  ตัวละครหญิง: สีผิว / ทรงผม / สีผม / เสื้อผ้า / เครื่องประดับ
//  sprite เป็นตาราง 24 x 34 ช่อง แต่ละตัวอักษรคือ 1 พิกเซล
//
//  เส้นขอบสีเข้มรอบตัวละครถูกวาดให้อัตโนมัติ ไม่ต้องวาดเอง
//  แต่ต้องเว้นขอบตารางไว้ 1 ช่องรอบด้าน ไม่งั้นเส้นขอบด้านนั้นจะหาย
//
//  ตัวอักษรที่ใช้ (ตัวพิมพ์ใหญ่ = เงาของสีเดียวกัน ระบบคำนวณสีให้เอง)
//    .  = โปร่งใส           o = เส้นสีเข้ม (ไว้วาดเส้นด้านใน)
//    s/S = ผิว / เงาผิว     e = ตา   w = ประกายตา/สีขาว   c = แก้ม   m = ปาก
//    k/K = รองเท้า
//    h/H = ผม / เงาผม       i = ประกายผม    r/R = โบว์ (สีชมพูคงที่)
//    a/A = สีหลักของชุด     b/B = สีรองของชุด
// =====================================================================

export const GIRL_WIDTH = 24;
export const GIRL_HEIGHT = 34;

export type SkinTone = { id: string; name: string; color: string };
export type HairColor = { id: string; name: string; color: string };
// rows = ผมด้านหน้า (ทับตัว), back = ผมด้านหลัง (อยู่หลังตัว ใช้กับผมยาว)
export type HairStyle = { id: string; name: string; rows: string[]; back?: string[] };
export type Outfit = { id: string; name: string; colors: { a: string; b: string }; rows: string[] };

export const skinTones: SkinTone[] = [
  { id: "porcelain", name: "ขาวอมชมพู", color: "#FFE3D2" },
  { id: "fair", name: "ขาวเหลือง", color: "#F7CFAA" },
  { id: "tan", name: "น้ำผึ้ง", color: "#E0A77C" },
  { id: "brown", name: "น้ำตาล", color: "#B97A5A" },
  { id: "deep", name: "เข้ม", color: "#7D4B35" },
];

export const hairColors: HairColor[] = [
  { id: "black", name: "ดำ", color: "#3B3542" },
  { id: "brown", name: "น้ำตาล", color: "#7A4E3A" },
  { id: "chestnut", name: "น้ำตาลแดง", color: "#A9583C" },
  { id: "blonde", name: "ทอง", color: "#EFC878" },
  { id: "pink", name: "ชมพู", color: "#F4A2C5" },
  { id: "lavender", name: "ม่วง", color: "#A88DE0" },
];

const EMPTY = "........................";
const blank = (count: number) => Array.from({ length: count }, () => EMPTY);

// ลำตัว (ไม่มีผม ไม่มีเสื้อผ้า)
// หัว แถว 5-18 / ตา แถว 11-13 / คอ แถว 19 / ตัว แถว 20-26 / ขา แถว 27-30 / รองเท้า แถว 31-32
export const bodyRows: string[] = [
  ...blank(5),
  "........ssssssss........",
  "......ssssssssssss......",
  ".....ssssssssssssss.....",
  "....ssssssssssssssss....",
  "....ssssssssssssssss....",
  "....SSSSSSSSSSSSSSSS....",
  "....ssswesssssswesss....",
  "....ssseesssssseesss....",
  "....ssseesssssseesss....",
  "....ssccssmssmssccss....",
  "....sssssssmmsssssss....",
  ".....ssssssssssssss.....",
  "......ssssssssssss......",
  "........SSSSSSSS........",
  "..........SSSS..........",
  ".......ssssssssss.......",
  "......ssssssssssss......",
  "......ssssssssssss......",
  "......ssssssssssss......",
  "......ssssssssssss......",
  "......ssssssssssss......",
  "........ssssssss........",
  ".........ss..ss.........",
  ".........ss..ss.........",
  ".........ss..ss.........",
  ".........sS..sS.........",
  "........kkk..kkk........",
  "........kkK..kkK........",
  EMPTY,
];

// ส่วนบนของหัวที่หลายทรงใช้ร่วมกัน (แถว 3-10: กระหม่อม + หน้าม้า)
// แสงมาจากซ้ายบน: ประกาย i อยู่ซ้ายบน เงา H อยู่ขวาและขอบล่าง
const capRows = [
  "........hhhhhhhh........",
  "......hhhhhhhhhhhH......",
  ".....hhhhiiiihhhhHH.....",
  "....hhiiihhhhhhhhhHH....",
  "...hhhhhhhhhhhhhhhhHH...",
  "...hhhhhhhhhhhhhhhhHH...",
  "...hhhhHhhhhhhhhHhhHH...",
  "...hhHh..hh..hh..hHHH...",
];
const sideRow = "...hhH............HhH...";

export const hairStyles: HairStyle[] = [
  {
    id: "bob",
    name: "บ๊อบสั้น",
    rows: [
      ...blank(3),
      ...capRows,
      sideRow,
      sideRow,
      sideRow,
      sideRow,
      sideRow,
      sideRow,
      "...hhhH..........HhHH...",
      "....HHHH........HHHH....",
    ],
  },
  {
    id: "long",
    name: "ยาวตรง",
    rows: [
      ...blank(3),
      ...capRows,
      ...Array.from({ length: 16 }, () => sideRow),
      "....HH............HH....",
    ],
    back: [
      ...blank(17),
      "......HHHHHHHHHHHH......",
      "......HHHHHHHHHHHH......",
      "......HHHHHHHHHHHH......",
      "......HHHHHHHHHHHH......",
    ],
  },
  {
    id: "twintails",
    name: "มัดสองข้าง",
    rows: [
      ...blank(3),
      "........hhhhhhhh........",
      "......hhhhhhhhhhhH......",
      ".....hhhhiiiihhhhHH.....",
      "....hhiiihhhhhhhhhHH....",
      "...hhhhhhhhhhhhhhhhHH...",
      "..rrhhhhhhhhhhhhhhhHrr..",
      "..rRhhhHhhhhhhhhHhhHRr..",
      ".hhhhHh..hh..hh..hHhhhH.",
      ".hihhH............HhhhH.",
      ".hihhH............HhhhH.",
      ".hihhH............HhhhH.",
      ".hhhhH............HhhhH.",
      ".hhhhH............HhhhH.",
      ".hhhhH............HhhhH.",
      ".hhhhh............hhhhH.",
      ".hhhhH............HhhhH.",
      ".hhhhH............HhhhH.",
      "..hhhH............HhhH..",
      "..hhH..............HhH..",
      "...HH..............HH...",
    ],
  },
  {
    id: "bun",
    name: "มวยผม",
    rows: [
      EMPTY,
      "..........hhhh..........",
      ".........hiihhH.........",
      ".........HrrrrH.........",
      "......hhhhhhhhhhhH......",
      ".....hhhhiiiihhhhHH.....",
      "....hhiiihhhhhhhhhHH....",
      "...hhhhhhhhhhhhhhhhHH...",
      "...hhhhhhhhhhhhhhhhHH...",
      "...hhhhHhhhhhhhhHhhHH...",
      "...hhH....hhhh....HHH...",
      "...hH..............HH...",
      "...hH..............HH...",
      "...hH..............HH...",
      "....H..............H....",
    ],
  },
  {
    id: "ponytail",
    name: "หางม้า",
    rows: [
      ...blank(3),
      "........hhhhhhhh........",
      "......hhhhhhhhhhhH......",
      ".....hhhhiiiihhhhHH.....",
      "....hhiiihhhhhhhhhHHrr..",
      "...hhhhhhhhhhhhhhhhHRrh.",
      "...hhhhhhhhhhhhhhhhHhhh.",
      "...hhhhHhhhhhhhhHhhHhiH.",
      "...hhHh..hh..hh..hHHhiH.",
      "...hhH............HHhhH.",
      "...hhH............HHhhH.",
      "...hhH............HHhhH.",
      "...hhH............HHhhH.",
      "...hhH............HHhhH.",
      "...hhH............HHhhH.",
      "...hhhH..........HHHhhH.",
      "....HHHH..........HhhhH.",
      "...................hhhH.",
      "...................hhhH.",
      "....................hhH.",
      ".....................HH.",
    ],
  },
];

// เสื้อผ้า วาดทับลำตัวตั้งแต่แถว 19-20 ลงไป
export const outfits: Outfit[] = [
  {
    id: "dress",
    name: "เดรสชมพู",
    colors: { a: "#F6A5C6", b: "#FFFFFF" },
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
    id: "tee-skirt",
    name: "เสื้อยืด + กระโปรง",
    colors: { a: "#FFF4D6", b: "#8B5CF6" },
    rows: [
      ...blank(20),
      ".......aaaaaaaaaa.......",
      "......aaaaaaaaaaaA......",
      "........aaarraaA........",
      "........aaaaaaaA........",
      "........bbbbbbbb........",
      ".......bbBbbbbBbb.......",
      "......bbbBbbbbBbbB......",
      "......BBBBBBBBBBBB......",
    ],
  },
  {
    id: "overalls",
    name: "เอี๊ยมยีนส์",
    colors: { a: "#6F8FD1", b: "#FFF9F1" },
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
  {
    id: "hoodie",
    name: "ฮู้ดดี้",
    colors: { a: "#B8E1C9", b: "#4E6B5C" },
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
      "........bbbbbbbB........",
      "........bbb..bbB........",
    ],
  },
  {
    id: "sailor",
    name: "ชุดกะลาสี",
    colors: { a: "#FFFFFF", b: "#3F4F8C" },
    rows: [
      ...blank(20),
      ".......bbbaaaabbb.......",
      "......aabbbaabbbaa......",
      "........aabrrbaA........",
      "........aaarraaA........",
      "........bbbbbbbb........",
      ".......bbBbbbbBbb.......",
      "......bbbBbbbbBbbB......",
      "......BBBBBBBBBBBB......",
    ],
  },
];

// =====================================================================
//  เครื่องประดับตัวละคร (เลือกได้หลายอัน)
//  วาดทับตัวละครตามลำดับใน array นี้ อันหลังสุดจะอยู่บนสุด
//  ตัวอักษรใน rows ใช้สีจาก palette ของเครื่องประดับชิ้นนั้น
// =====================================================================
export type GirlAccessory = {
  id: string;
  name: string;
  emoji: string;
  palette: Record<string, string>;
  rows: string[];
};

export const girlAccessories: GirlAccessory[] = [
  {
    id: "glasses",
    name: "แว่นกลม",
    emoji: "👓",
    palette: { g: "#7A4FB0" },
    rows: [
      ...blank(10),
      ".......gg......gg.......",
      "......g..g....g..g......",
      "......g..gggggg..g......",
      "......g..g....g..g......",
      ".......gg......gg.......",
    ],
  },
  {
    id: "hat",
    name: "หมวกสาน",
    emoji: "👒",
    palette: { a: "#FFE3A3", A: "#E6BC66", i: "#FFF4D2", b: "#F26A9E", B: "#C9457C" },
    rows: [
      EMPTY,
      "........aaaaaaaa........",
      ".......aaaaaaaaaa.......",
      "......aiiaaaaaaaaA......",
      "......bbbbbbbbbbbB......",
      "...aaaaaaaaaaaaaaaaaa...",
      ".aaaaaaaaaaaaaaaaaaaaAA.",
      "..AAAAAAAAAAAAAAAAAAAA..",
    ],
  },
  {
    id: "clip",
    name: "กิ๊บดอกไม้",
    emoji: "🌸",
    palette: { p: "#FF8FB8", y: "#FFE066" },
    rows: [
      ...blank(6),
      ".................pp.....",
      "................pppp....",
      "................pyyp....",
      ".................pp.....",
    ],
  },
];
