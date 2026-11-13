// ตัววาดพิกเซลแบบทั่วไป: รับหลายเลเยอร์ (ลำตัว → เสื้อผ้า → ผม) แล้ววาดทับกันตามลำดับ
// เลเยอร์หลังสุดใน array จะอยู่บนสุด

export type SpriteLayer = {
  rows: string[];
  palette: Record<string, string | undefined>;
};

type Props = {
  layers: SpriteLayer[];
  width: number;
  height: number;
  scale: number;
  label: string;
  className?: string;
};

export default function PixelSprite({ layers, width, height, scale, label, className }: Props) {
  const rects: { x: number; y: number; fill: string }[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let i = layers.length - 1; i >= 0; i--) {
        const cell = layers[i].rows[y]?.[x];
        if (!cell || cell === ".") continue;
        const fill = layers[i].palette[cell];
        if (!fill) continue;
        rects.push({ x, y, fill });
        break;
      }
    }
  }

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
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={1} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
