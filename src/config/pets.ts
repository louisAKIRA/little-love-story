// =====================================================================
//  สัตว์เลี้ยง: หมา / แมว และสีขน
//  sprite เป็นตาราง 16 x 15 ช่อง
//
//  ตัวอักษรที่ใช้
//    .  = โปร่งใส
//    f  = สีขน (fill)   o = เส้นขอบ (สีขนเข้ม)   i = ในหู
//    e  = ตา            n = จมูก                  c = แก้ม
// =====================================================================

export type PetKind = "cat" | "dog";
export type PetKindOption = { id: PetKind; name: string; emoji: string };
export type Coat = { id: string; name: string; color: string; detail: string };

export const PET_WIDTH = 16;
export const PET_HEIGHT = 15;

export const petKinds: PetKindOption[] = [
  { id: "cat", name: "แมว", emoji: "🐱" },
  { id: "dog", name: "หมา", emoji: "🐶" },
];

// color = สีขนหลัก, detail = สีเส้นขอบ (เข้มกว่าเล็กน้อย)
export const coats: Coat[] = [
  { id: "cream", name: "ครีม", color: "#F4D9AD", detail: "#C9975B" },
  { id: "orange", name: "ส้ม", color: "#F2B06A", detail: "#B9702E" },
  { id: "brown", name: "น้ำตาล", color: "#A96F50", detail: "#6A4029" },
  { id: "gray", name: "เทา", color: "#B4BBC8", detail: "#6E7A8E" },
  { id: "black", name: "ดำ", color: "#55515F", detail: "#25222C" },
  { id: "white", name: "ขาว", color: "#FFF9F1", detail: "#CDBFC3" },
  { id: "pink", name: "ชมพู", color: "#F2A8C8", detail: "#C9699A" },
];

export const petSprites: Record<PetKind, string[]> = {
  cat: [
    "....o......o....",
    "...oio....oio...",
    "...offoooooffo..",
    "..offffffffffo..",
    "..offeffffeffo..",
    "..ocffffffffco..",
    "..offffnnffffo..",
    "...offffffffo...",
    "....oooooooo....",
    "...offffffffo...",
    "..offffffffffo..",
    "..offffffffffo..",
    "..offffffffffo..",
    "...ofo....ofo...",
    "...ooo....ooo...",
  ],
  dog: [
    "................",
    "....oooooooo....",
    "...offffffffo...",
    "..offffffffffo..",
    ".ooffeffffeffoo.",
    ".oocffffffffcoo.",
    ".ooffffnnffffoo.",
    ".oooffffffffooo.",
    ".oo.oooooooo.oo.",
    "...offffffffo...",
    "..offffffffffo..",
    "..offffffffffo..",
    "..offffffffffo..",
    "...ofo....ofo...",
    "...ooo....ooo...",
  ],
};
