import { mix } from "@/lib/color";
import { bodyRows, type GirlAccessory, type HairStyle, type Outfit } from "@/config/character";
import { petSprites, type Coat, type PetAccessory, type PetKind } from "@/config/pets";

// เลเยอร์ของ sprite: ตารางตัวอักษร + สีของแต่ละตัวอักษร
export type SpriteLayer = {
  rows: string[];
  palette: Record<string, string | undefined>;
};

export type Pixel = { x: number; y: number; fill: string };

// สีเส้นขอบและสีตา (น้ำตาลอมม่วงเข้ม เข้ากับโทนชมพูมากกว่าสีดำสนิท)
export const OUTLINE = "#3A2733";
const EYE = "#2B1F2C";
const SHADE = "#2A1B28";

// รวมหลายเลเยอร์เป็นพิกเซลเดียว เลเยอร์หลังสุดอยู่บนสุด
export function compositeLayers(layers: SpriteLayer[], width: number, height: number): Pixel[] {
  const pixels: Pixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let i = layers.length - 1; i >= 0; i--) {
        const cell = layers[i].rows[y]?.[x];
        if (!cell || cell === ".") continue;
        const fill = layers[i].palette[cell];
        if (!fill) continue;
        pixels.push({ x, y, fill });
        break;
      }
    }
  }
  return pixels;
}

// รวมเลเยอร์แล้วเติมเส้นขอบสีเข้มรอบรูปร่างให้อัตโนมัติ
// ช่องว่างที่ติดกับช่องมีสี (บน ล่าง ซ้าย ขวา) จะกลายเป็นเส้นขอบ
// ไม่ว่าจะเปลี่ยนทรงผม ชุด หรือเครื่องประดับแบบไหน เส้นขอบก็จะพอดีเสมอ
export function renderSprite(layers: SpriteLayer[], width: number, height: number): Pixel[] {
  const pixels = compositeLayers(layers, width, height);
  const filled = new Set(pixels.map((p) => p.y * width + p.x));
  const outline: Pixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (filled.has(index)) continue;
      const touches =
        (x > 0 && filled.has(index - 1)) ||
        (x < width - 1 && filled.has(index + 1)) ||
        (y > 0 && filled.has(index - width)) ||
        (y < height - 1 && filled.has(index + width));
      if (touches) outline.push({ x, y, fill: OUTLINE });
    }
  }
  return [...outline, ...pixels];
}

export type GirlLook = {
  skin: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfit: Outfit;
  accessories: GirlAccessory[];
};

// ลำดับเลเยอร์: ผมด้านหลัง → ตัว → ชุด → ผมด้านหน้า → เครื่องประดับ
// ตัวพิมพ์ใหญ่ = เฉดเงาของสีเดียวกัน (คำนวณให้เองจากสีที่เลือก)
export function girlLayers(look: GirlLook): SpriteLayer[] {
  const hairPalette = {
    h: look.hairColor,
    H: mix(look.hairColor, SHADE, 0.3),
    i: mix(look.hairColor, "#FFFFFF", 0.38),
    r: "#F26A9E",
    R: "#C9457C",
    o: OUTLINE,
  };
  const { a, b } = look.outfit.colors;
  return [
    ...(look.hairStyle.back ? [{ rows: look.hairStyle.back, palette: hairPalette }] : []),
    {
      rows: bodyRows,
      palette: {
        s: look.skin,
        S: mix(look.skin, "#8A3550", 0.24),
        e: EYE,
        w: "#FFFFFF",
        c: mix(look.skin, "#F0608F", 0.5),
        m: mix(look.skin, "#8E2F4A", 0.9),
        k: "#5A3A4A",
        K: "#7C566B",
        o: OUTLINE,
      },
    },
    {
      rows: look.outfit.rows,
      palette: { a, A: mix(a, SHADE, 0.22), b, B: mix(b, SHADE, 0.22), w: "#FFFFFF", r: "#EF4F80", o: OUTLINE },
    },
    { rows: look.hairStyle.rows, palette: hairPalette },
    ...look.accessories.map((item) => ({ rows: item.rows, palette: item.palette })),
  ];
}

export type PetLook = {
  kind: PetKind;
  coat: Coat;
  accessories: PetAccessory[];
};

export function petLayers(look: PetLook): SpriteLayer[] {
  const { color, detail } = look.coat;
  return [
    {
      rows: petSprites[look.kind],
      palette: {
        f: color,
        F: mix(color, detail, 0.7),
        g: mix(color, "#FFFFFF", 0.55),
        i: mix(color, "#F08CAE", 0.75),
        c: mix(color, "#F06A96", 0.5),
        e: EYE,
        w: "#FFFFFF",
        n: look.kind === "cat" ? "#EE7FA4" : OUTLINE,
        m: OUTLINE,
        t: "#F27C9B",
        o: OUTLINE,
      },
    },
    ...look.accessories.map((item) => ({ rows: item.rows[look.kind], palette: item.palette })),
  ];
}
