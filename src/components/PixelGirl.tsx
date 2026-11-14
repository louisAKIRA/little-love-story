import PixelSprite from "@/components/PixelSprite";
import { girlLayers, type GirlLook } from "@/lib/sprites";
import { GIRL_WIDTH, GIRL_HEIGHT } from "@/config/character";

type Props = {
  look: GirlLook;
  scale?: number;
  name?: string;
};

export default function PixelGirl({ look, scale = 7, name }: Props) {
  return (
    <div className="sprite-wrap sprite-girl">
      {name && <div className="name-tag">♡ {name}</div>}
      <div className="sprite-shadow" />
      <PixelSprite layers={girlLayers(look)} width={GIRL_WIDTH} height={GIRL_HEIGHT} scale={scale} label="ตัวละครพิกเซล" />
    </div>
  );
}
