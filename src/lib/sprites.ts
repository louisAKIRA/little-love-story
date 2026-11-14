import { mix } from "@/lib/color";
import { bodyRows, type GirlAccessory, type HairStyle, type Outfit } from "@/config/character";
import { petSprites, type Coat, type PetAccessory, type PetKind } from "@/config/pets";

// เลเยอร์ของ sprite: ตารางตัวอักษร + สีของแต่ละตัวอักษร
export type SpriteLayer = {
  rows: string[];
  palette: Record<string, string | undefined>;
};

export type Pixel = { x: number; y: number; fill: string };

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

export type GirlLook = {
  skin: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfit: Outfit;
  accessories: GirlAccessory[];
};

export function girlLayers(look: GirlLook): SpriteLayer[] {
  return [
    {
      rows: bodyRows,
      palette: {
        s: look.skin,
        e: "#3E2E3A",
        m: mix(look.skin, "#D9557E", 0.75),
        c: mix(look.skin, "#F06A96", 0.45),
        k: "#5A3A4A",
      },
    },
    { rows: look.outfit.rows, palette: { a: look.outfit.colors.a, b: look.outfit.colors.b, w: "#FFFFFF" } },
    { rows: look.hairStyle.rows, palette: { h: look.hairColor, r: "#F26A9E" } },
    ...look.accessories.map((item) => ({ rows: item.rows, palette: item.palette })),
  ];
}

export type PetLook = {
  kind: PetKind;
  coat: Coat;
  accessories: PetAccessory[];
};

export function petLayers(look: PetLook): SpriteLayer[] {
  return [
    {
      rows: petSprites[look.kind],
      palette: {
        f: look.coat.color,
        o: look.coat.detail,
        i: mix(look.coat.color, "#F08CAE", 0.6),
        c: mix(look.coat.color, "#F06A96", 0.5),
        e: "#3E2E3A",
        n: look.kind === "cat" ? "#E889A9" : "#3E2E3A",
      },
    },
    ...look.accessories.map((item) => ({ rows: item.rows[look.kind], palette: item.palette })),
  ];
}
