import PixelSprite from "@/components/PixelSprite";
import { mix } from "@/lib/color";
import { petSprites, PET_WIDTH, PET_HEIGHT, type PetKind, type Coat } from "@/config/pets";

type Props = {
  kind: PetKind;
  coat: Coat;
  scale?: number;
};

export default function PixelPet({ kind, coat, scale = 7 }: Props) {
  const layers = [
    {
      rows: petSprites[kind],
      palette: {
        f: coat.color,
        o: coat.detail,
        i: mix(coat.color, "#F08CAE", 0.6),
        c: mix(coat.color, "#F06A96", 0.5),
        e: "#3E2E3A",
        n: kind === "cat" ? "#E889A9" : "#3E2E3A",
      },
    },
  ];

  return (
    <div className={`sprite-wrap sprite-pet sprite-${kind}`}>
      <div className="sprite-shadow" />
      <PixelSprite layers={layers} width={PET_WIDTH} height={PET_HEIGHT} scale={scale} label={kind === "cat" ? "แมวพิกเซล" : "หมาพิกเซล"} />
      <span className="sprite-heart" aria-hidden="true">♥</span>
    </div>
  );
}
