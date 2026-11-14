import PixelSprite from "@/components/PixelSprite";
import { mix } from "@/lib/color";
import { bodyRows, GIRL_WIDTH, GIRL_HEIGHT, type GirlAccessory, type HairStyle, type Outfit } from "@/config/character";

type Props = {
  skin: string;
  hairStyle: HairStyle;
  hairColor: string;
  outfit: Outfit;
  accessories?: GirlAccessory[];
  scale?: number;
  name?: string;
};

export default function PixelGirl({ skin, hairStyle, hairColor, outfit, accessories = [], scale = 7, name }: Props) {
  const layers = [
    {
      rows: bodyRows,
      palette: {
        s: skin,
        e: "#3E2E3A",
        m: mix(skin, "#D9557E", 0.75),
        c: mix(skin, "#F06A96", 0.45),
        k: "#5A3A4A",
      },
    },
    { rows: outfit.rows, palette: { a: outfit.colors.a, b: outfit.colors.b, w: "#FFFFFF" } },
    { rows: hairStyle.rows, palette: { h: hairColor, r: "#F26A9E" } },
    ...accessories.map((item) => ({ rows: item.rows, palette: item.palette })),
  ];

  return (
    <div className="sprite-wrap sprite-girl">
      {name && <div className="name-tag">♡ {name}</div>}
      <div className="sprite-shadow" />
      <PixelSprite layers={layers} width={GIRL_WIDTH} height={GIRL_HEIGHT} scale={scale} label="ตัวละครพิกเซล" />
    </div>
  );
}
