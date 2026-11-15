import { ImageResponse } from "next/og";
import { compositeLayers, girlLayers, petLayers, renderSprite, type SpriteLayer } from "@/lib/sprites";
import { GIRL_WIDTH, GIRL_HEIGHT, skinTones, hairStyles, hairColors } from "@/config/character";
import { clothing, defaultClothesIds } from "@/config/clothing";
import { PET_WIDTH, PET_HEIGHT, coats, petAccessories } from "@/config/pets";
import { copy } from "@/config/messages";
import { withName } from "@/lib/text";

// =====================================================================
//  รูปพรีวิวตอนส่งลิงก์ใน LINE / Facebook (ทำตอน build ทุกครั้ง)
//  ชื่อหวานกับคำอธิบายมาจาก src/config/messages.ts
// =====================================================================

export const alt = withName(copy.shareTitle);
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEART = [".hh.hh.", "hhhhhhh", "hhhhhhh", ".hhhhh.", "..hhh..", "...h..."];
const FLOWER = [".w.", "wyw", ".w."];

// ดึงฟอนต์ไทยเฉพาะตัวอักษรที่ใช้ในรูป (ถ้าดึงไม่ได้จะใช้ฟอนต์พื้นฐานแทน)
async function loadThaiFont(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(cssUrl).then((response) => response.text());
    const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!fontUrl) return null;
    const response = await fetch(fontUrl);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function Pixels({ layers, width, height, scale, left, top, outline = false }: { layers: SpriteLayer[]; width: number; height: number; scale: number; left: number; top: number; outline?: boolean }) {
  return (
    <div style={{ position: "absolute", left, top, width: width * scale, height: height * scale, display: "flex" }}>
      {(outline ? renderSprite(layers, width, height) : compositeLayers(layers, width, height)).map((p) => (
        <div
          key={`${p.x}-${p.y}`}
          style={{ position: "absolute", left: p.x * scale, top: p.y * scale, width: scale, height: scale, backgroundColor: p.fill }}
        />
      ))}
    </div>
  );
}

export default async function OpengraphImage() {
  const title = withName(copy.steps.result);
  const description = withName(copy.shareDescription);
  const button = withName(copy.shareButton);
  const [bold, semibold] = await Promise.all([loadThaiFont(800, `${title}${copy.brand}${button}`), loadThaiFont(600, description)]);
  const fonts = [
    ...(bold ? [{ name: "Thai", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(semibold ? [{ name: "Thai", data: semibold, weight: 600 as const, style: "normal" as const }] : []),
  ];

  // หน้าตาเริ่มต้นของตัวละครกับน้อง (ตอน build ยังไม่รู้ว่าหวานแต่งแบบไหน)
  const girl = girlLayers({
    skin: skinTones[0].color,
    hairStyle: hairStyles.find((item) => item.id === "long") ?? hairStyles[0],
    hairColor: (hairColors.find((item) => item.id === "black") ?? hairColors[0]).color,
    clothes: clothing.filter((piece) => defaultClothesIds.includes(piece.id)),
    accessories: [],
  });
  const pet = petLayers({ kind: "cat", coat: coats[0], accessories: petAccessories.filter((item) => item.id === "bow") });

  const box = 504; // ด้านในกรอบฉาก
  const scale = 9;
  const baseline = box - 74;
  const girlW = GIRL_WIDTH * scale;
  const petW = PET_WIDTH * scale;
  const startX = (box - (girlW + 24 + petW)) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 56px",
          background: "linear-gradient(180deg, #F8B9D2 0%, #F7A8C8 50%, #F6B4CE 100%)",
          fontFamily: fonts.length > 0 ? "Thai" : undefined,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            width: box + 16,
            height: box + 16,
            border: "8px solid #FFF7FB",
            borderRadius: 44,
            overflow: "hidden",
            background: "linear-gradient(180deg, #C8E9F2 0%, #E5F4E8 70%, #A9D7A5 100%)",
          }}
        >
          <div style={{ position: "absolute", top: 38, right: 46, width: 64, height: 64, borderRadius: 999, backgroundColor: "#FFD77A" }} />
          <div style={{ position: "absolute", top: 70, left: 52, width: 120, height: 34, borderRadius: 999, backgroundColor: "#FFF9FC" }} />
          <div style={{ position: "absolute", top: 50, left: 74, width: 50, height: 50, borderRadius: 999, backgroundColor: "#FFF9FC" }} />
          <div style={{ position: "absolute", top: 136, right: 70, width: 84, height: 24, borderRadius: 999, backgroundColor: "#FFF9FC" }} />
          <div style={{ position: "absolute", left: -90, bottom: -250, width: 690, height: 420, borderRadius: 999, backgroundColor: "#A9D99E" }} />
          <div style={{ position: "absolute", left: -40, bottom: -300, width: 690, height: 400, borderRadius: 999, backgroundColor: "#83C78E" }} />
          <Pixels layers={girl} width={GIRL_WIDTH} height={GIRL_HEIGHT} scale={scale} left={startX} top={baseline - GIRL_HEIGHT * scale} outline />
          <Pixels layers={pet} width={PET_WIDTH} height={PET_HEIGHT} scale={scale} left={startX + girlW + 24} top={baseline - PET_HEIGHT * scale} outline />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <Pixels
              key={index}
              layers={[{ rows: FLOWER, palette: { w: "#FFF4FB", y: "#FFD15C" } }]}
              width={3}
              height={3}
              scale={7}
              left={20 + index * 62}
              top={box - 46 + (index % 2) * 10}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 52 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#8C4D6B", fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>
            <div style={{ position: "relative", display: "flex", width: 42, height: 36 }}>
              <Pixels layers={[{ rows: HEART, palette: { h: "#D979A6" } }]} width={7} height={6} scale={6} left={0} top={0} />
            </div>
            {copy.brand}
          </div>
          <div style={{ display: "flex", marginTop: 22, color: "#FFFAFD", fontSize: 66, fontWeight: 800, lineHeight: 1.4, textShadow: "4px 5px 0 #DC83AA" }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 18, color: "#6E3F58", fontSize: 30, fontWeight: 600, lineHeight: 1.6 }}>{description}</div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 30,
              padding: "14px 28px",
              borderRadius: 18,
              backgroundColor: "#8B5CF6",
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: 800,
              boxShadow: "0 6px 0 #6A3FD0",
            }}
          >
            {button}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
