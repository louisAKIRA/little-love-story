import { compositeLayers, type SpriteLayer } from "@/lib/sprites";

type Props = {
  layers: SpriteLayer[];
  width: number;
  height: number;
  scale: number;
  label: string;
  className?: string;
};

// วาด sprite เป็น SVG สี่เหลี่ยมเล็ก ๆ หนึ่งช่องต่อหนึ่งพิกเซล
export default function PixelSprite({ layers, width, height, scale, label, className }: Props) {
  const pixels = compositeLayers(layers, width, height);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      width={width * scale}
      height={height * scale}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
    >
      {pixels.map((p) => (
        <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} fill={p.fill} />
      ))}
    </svg>
  );
}
