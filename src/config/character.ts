// =====================================================================
//  ตัวละครหญิง: สีผิว / ทรงผม / สีผม / เครื่องประดับ (เสื้อผ้าอยู่ใน clothing.ts)
//  sprite เป็นตาราง 24 x 34 ช่อง แต่ละตัวอักษรคือ 1 พิกเซล
//
//  เส้นขอบสีเข้มรอบตัวละครถูกวาดให้อัตโนมัติ ไม่ต้องวาดเอง
//  แต่ต้องเว้นขอบตารางไว้ 1 ช่องรอบด้าน ไม่งั้นเส้นขอบด้านนั้นจะหาย
//
//  ตัวอักษรที่ใช้ (ตัวพิมพ์ใหญ่ = เงาของสีเดียวกัน ระบบคำนวณสีให้เอง)
//    .  = โปร่งใส           o = เส้นสีเข้ม (ไว้วาดเส้นด้านใน)
//    s/S = ผิว / เงาผิว     e = ตา   w = ประกายตา/สีขาว   c = แก้ม   m = ปาก
//    h/H = ผม / เงาผม       i = ประกายผม    r/R = โบว์ (สีชมพูคงที่)
// =====================================================================

export const GIRL_WIDTH = 24;
export const GIRL_HEIGHT = 34;

export type SkinTone = { id: string; name: string; color: string };
export type HairColor = { id: string; name: string; color: string };
// rows = ผมด้านหน้า (ทับตัว), back = ผมด้านหลัง (อยู่หลังตัว ใช้กับผมยาว)
export type HairStyle = { id: string; name: string; rows: string[]; back?: string[] };

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
// หัว แถว 5-18 / ตา แถว 11-13 / คอ แถว 19 / ไหล่ แถว 20 / แขน คอลัมน์ 6-7 กับ 16-17 แถว 21-25
// ลำตัว คอลัมน์ 8-15 แถว 21-26 / ขา แถว 27-30 / เท้า แถว 31-32
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
  ".........ss..ss.........",
  "........sss..sss........",
  EMPTY,
];

// เฟรมกะพริบตา: แถวที่ระบุจะถูกแทนที่ชั่วครู่ตอนตัวละครหลับตา (เลขคือลำดับแถว เริ่มนับจาก 0)
export const bodyBlinkRows: Record<number, string> = {
  11: "....ssssssssssssssss....",
  13: "....ssssssssssssssss....",
};

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

// =====================================================================
//  เครื่องประดับตัวละคร แยกเป็นหมวด เลือกได้หมวดละ 1 อย่าง ใส่ข้ามหมวดพร้อมกันได้
//
//  girlAccessoryCategories = หมวดและลำดับแท็บที่แสดงในหน้าเกม
//  girlAccessories = ของแต่ละชิ้น ลำดับใน array คือลำดับการวาดทับ (อันหลังอยู่บนสุด)
//  ตัวอักษรใน rows ใช้สีจาก palette ของเครื่องประดับชิ้นนั้น
//
//  เพิ่มของใหม่: เพิ่ม object ใน girlAccessories แล้วใส่ category ให้ตรงกับ id ของหมวด
// =====================================================================
export type AccessoryCategory = { id: string; name: string; emoji: string };

export type GirlAccessory = {
  id: string;
  category: string;
  name: string;
  emoji: string;
  palette: Record<string, string>;
  rows: string[];
};

export const girlAccessoryCategories: AccessoryCategory[] = [
  { id: "head", name: "หมวก", emoji: "👒" },
  { id: "face", name: "ใบหน้า", emoji: "👓" },
  { id: "hair", name: "ติดผม", emoji: "🎀" },
  { id: "neck", name: "คอ", emoji: "🧣" },
  { id: "drink", name: "เครื่องดื่ม", emoji: "🧋" },
  { id: "hand", name: "ในมือ", emoji: "🌷" },
];

export const girlAccessories: GirlAccessory[] = [
  // ---------- คอ ----------
  {
    id: "scarf",
    category: "neck",
    name: "ผ้าพันคอ",
    emoji: "🧣",
    palette: { a: "#EF6A5B", A: "#C94B40" },
    rows: [
      ...blank(19),
      "........aaaaaaaa........",
      ".......aAaaAaaAaa.......",
      ".............aaA........",
      ".............aAa........",
      ".............aaA........",
      ".............A.A........",
    ],
  },
  {
    id: "necklace",
    category: "neck",
    name: "สร้อยหัวใจ",
    emoji: "💗",
    palette: { y: "#F2C14E", p: "#F45C8E" },
    rows: [
      ...blank(20),
      ".........y....y.........",
      "..........y..y..........",
      "...........pp...........",
    ],
  },
  {
    id: "bowtie",
    category: "neck",
    name: "โบว์ผูกคอ",
    emoji: "🎗️",
    palette: { p: "#8B5CF6", P: "#6A3FD0", k: "#5632B0" },
    rows: [
      ...blank(20),
      ".........ppkkpp.........",
      ".........pP..Pp.........",
    ],
  },

  // ---------- ใบหน้า ----------
  {
    id: "glasses",
    category: "face",
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
    id: "sunglasses",
    category: "face",
    name: "แว่นกันแดด",
    emoji: "🕶️",
    palette: { k: "#3A2733", L: "#9C8DB5" },
    rows: [
      ...blank(11),
      "......kLkk....kLkk......",
      "......kkkkkkkkkkkk......",
      ".......kk......kk.......",
    ],
  },
  {
    id: "star-sticker",
    category: "face",
    name: "สติกเกอร์ดาว",
    emoji: "⭐",
    palette: { y: "#FFD23F" },
    rows: [
      ...blank(14),
      "................y.......",
      "...............yyy......",
      "................y.......",
    ],
  },

  // ---------- หมวก ----------
  {
    id: "hat",
    category: "head",
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
    id: "beanie",
    category: "head",
    name: "หมวกไหมพรม",
    emoji: "🧶",
    palette: { a: "#F47C9C", A: "#CF5A7D", i: "#FBB1C4", b: "#FFF4E6", B: "#E8D5C4" },
    rows: [
      EMPTY,
      "..........bbbb..........",
      ".........bbbbbB.........",
      ".......aaaaaaaaaa.......",
      ".....aaaaaaaaaaaaaA.....",
      "....aaiaaaaaaaaaaaAA....",
      "...aaiaaaaaaaaaaaaaAA...",
      "...aaaaaaaaaaaaaaaaAA...",
      "..bbBbbBbbBbbBbbBbbBbb..",
      "..bbBbbBbbBbbBbbBbbBBB..",
    ],
  },
  {
    id: "flower-crown",
    category: "head",
    name: "มงกุฎดอกไม้",
    emoji: "🌼",
    palette: { p: "#FF8FB8", w: "#FFFFFF", y: "#FFD86B", g: "#7CC47F" },
    rows: [
      ...blank(6),
      "....ppgwwgyyyygwwgpp....",
      "...gppgwwgyyyygwwgppg...",
    ],
  },
  {
    id: "cat-ears",
    category: "head",
    name: "ที่คาดผมหูแมว",
    emoji: "🐱",
    palette: { k: "#4A3F55", i: "#F9A8C4" },
    rows: [
      EMPTY,
      "......k..........k......",
      ".....kik........kik.....",
      ".....kiik......kiik.....",
      ".....kkkk......kkkk.....",
    ],
  },
  {
    id: "beret",
    category: "head",
    name: "เบเร่ต์",
    emoji: "🎨",
    palette: { a: "#E5484D", A: "#B8323A", i: "#F4838A" },
    rows: [
      EMPTY,
      "............a...........",
      "........aaaaaaaaa.......",
      "......aaiaaaaaaaaaA.....",
      ".....aaiaaaaaaaaaaaAA...",
      ".....aaaaaaaaaaaaaaAA...",
      "......AAAAAAAAAAAAAA....",
    ],
  },

  {
    id: "cap",
    category: "head",
    name: "หมวกแก๊ป",
    emoji: "🧢",
    palette: { a: "#F3E3C3", A: "#D9C39A", i: "#FFF6E2" },
    rows: [
      EMPTY,
      EMPTY,
      "........aaaaaaaa........",
      "......aaiaaaaaaaaA......",
      ".....aaiaaaaaaaaaaA.....",
      "....aaaaaaaaaaaaaaAA....",
      "....aaaaaaaaaaaaaaAA....",
      ".AAAAAAAAAAAA...........",
    ],
  },

  // ---------- ติดผม ----------
  {
    id: "clip",
    category: "hair",
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
  {
    id: "hair-bow",
    category: "hair",
    name: "โบว์ติดผม",
    emoji: "🎀",
    palette: { p: "#F45C8E", P: "#C93F72", k: "#A82E5C" },
    rows: [
      ...blank(4),
      "..............pp...pp...",
      "..............pppkppp...",
      "..............pP...Pp...",
    ],
  },
  {
    id: "star-clips",
    category: "hair",
    name: "กิ๊บดาว",
    emoji: "✨",
    palette: { y: "#FFD23F" },
    rows: [
      ...blank(7),
      "......y.................",
      ".....yyy................",
      "......y.................",
    ],
  },

  // ---------- เครื่องดื่ม (ถือมือซ้ายของจอ) ----------
  {
    id: "bubble-tea",
    category: "drink",
    name: "ชานมไข่มุก",
    emoji: "🧋",
    palette: { w: "#FFFFFF", t: "#D9A066", b: "#5A3A2E", k: "#F45C8E" },
    rows: [
      ...blank(20),
      "....k...................",
      "....k...................",
      "..wwww..................",
      "..tttt..................",
      "..tttt..................",
      "..tbtb..................",
      "...tt...................",
    ],
  },
  {
    id: "iced-tea",
    category: "drink",
    name: "ชาเย็น",
    emoji: "🧃",
    palette: { k: "#3A3540", w: "#FFFFFF", o: "#F2A65A", O: "#D9853B" },
    rows: [
      ...blank(20),
      "....k...................",
      "....k...................",
      "..wwww..................",
      "..owoo..................",
      "..oooo..................",
      "..oooO..................",
      "...oO...................",
    ],
  },
  {
    id: "coffee",
    category: "drink",
    name: "กาแฟแก้วกระดาษ",
    emoji: "☕",
    palette: { w: "#FFFFFF", W: "#E6E0EA", b: "#B98558" },
    rows: [
      ...blank(22),
      "..wwww..................",
      "..wwwW..................",
      "..bbbb..................",
      "..wwwW..................",
      "...wW...................",
    ],
  },

  // ---------- ในมือ (ถือมือขวาของจอ) ----------
  {
    id: "tulip",
    category: "hand",
    name: "ดอกทิวลิป",
    emoji: "🌷",
    palette: { p: "#FF7FA8", P: "#D9557E", g: "#6DBE72" },
    rows: [
      ...blank(19),
      ".................p.p....",
      ".................ppp....",
      ".................pPp....",
      "..................g.....",
      "..................gg....",
      "..................g.....",
      "..................g.....",
    ],
  },
  {
    id: "rose-bouquet",
    category: "hand",
    name: "ช่อกุหลาบ",
    emoji: "🌹",
    palette: { r: "#E5484D", R: "#B8323A", g: "#6DBE72", w: "#FFFFFF", W: "#E6E0EA" },
    rows: [
      ...blank(18),
      ".................rr.....",
      "................rRrr....",
      "................rrRg....",
      "................wwww....",
      ".................wwW....",
      ".................wWw....",
      "..................ww....",
      "..................w.....",
    ],
  },
  {
    id: "ice-cream",
    category: "hand",
    name: "ไอศกรีม",
    emoji: "🍦",
    palette: { p: "#FFB3CF", P: "#F58FB4", c: "#E8B26A", C: "#C98F45" },
    rows: [
      ...blank(19),
      "..................pp....",
      ".................pppp...",
      ".................ppPP...",
      ".................cCcC...",
      "..................cC....",
      "..................cC....",
      "..................c.....",
    ],
  },
];
