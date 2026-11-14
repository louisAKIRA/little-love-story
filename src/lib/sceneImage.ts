import { compositeLayers, girlLayers, petLayers, type GirlLook, type PetLook, type SpriteLayer } from "@/lib/sprites";
import { FLOWERS, STARS } from "@/lib/scene";
import { GIRL_WIDTH, GIRL_HEIGHT } from "@/config/character";
import { PET_WIDTH, PET_HEIGHT } from "@/config/pets";

// =====================================================================
//  ทำรูปฉากทุ่งดอกไม้ขนาดสตอรี่ (1080 x 1920) ด้วย canvas
//  วาดเองทั้งหมดจากข้อมูลตัวละคร ไม่ได้ถ่ายรูปหน้าจอ เลยคมชัดทุกเครื่อง
// =====================================================================

export type SceneImageOptions = {
  girl: GirlLook;
  pet: PetLook;
  girlName?: string;
  petName: string;
  brand: string;
  title: string;
  dateText: string;
  label: string;
  message: string;
  footer: string;
  night: boolean;
};

const W = 1080;
const H = 1920;
const CARD_X = 70;
const CARD_W = W - CARD_X * 2;

type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };

function roundRectPath(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawSprite(ctx: Ctx, layers: SpriteLayer[], width: number, height: number, x: number, y: number, scale: number) {
  for (const p of compositeLayers(layers, width, height)) {
    ctx.fillStyle = p.fill;
    ctx.fillRect(Math.round(x + p.x * scale), Math.round(y + p.y * scale), scale, scale);
  }
}

// ตัดคำภาษาไทยด้วย Intl.Segmenter แล้วขึ้นบรรทัดใหม่เมื่อยาวเกิน
function wrapText(ctx: Ctx, text: string, maxWidth: number): string[] {
  const words =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? Array.from(new Intl.Segmenter("th", { granularity: "word" }).segment(text), (part) => part.segment)
      : Array.from(text);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line + word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line.trimEnd());
      line = word.trimStart();
    } else {
      line = next;
    }
    // คำเดียวยาวเกินบรรทัด ตัดเป็นตัวอักษร
    while (ctx.measureText(line).width > maxWidth && line.length > 1) {
      let cut = line.length - 1;
      while (cut > 1 && ctx.measureText(line.slice(0, cut)).width > maxWidth) cut--;
      lines.push(line.slice(0, cut));
      line = line.slice(cut);
    }
  }
  if (line.trim()) lines.push(line.trimEnd());
  return lines;
}

function fitFont(ctx: Ctx, text: string, makeFont: (size: number) => string, size: number, maxWidth: number) {
  let current = size;
  ctx.font = makeFont(current);
  while (current > 24 && ctx.measureText(text).width > maxWidth) {
    current -= 2;
    ctx.font = makeFont(current);
  }
}

function drawCloud(ctx: Ctx, cx: number, cy: number, s: number) {
  roundRectPath(ctx, cx - 100 * s, cy - 28 * s, 200 * s, 58 * s, 29 * s);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx - 38 * s, cy - 22 * s, 42 * s, 0, Math.PI * 2);
  ctx.arc(cx + 42 * s, cy - 14 * s, 33 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawSun(ctx: Ctx, cx: number, cy: number) {
  ctx.fillStyle = "#FFD77A";
  ctx.beginPath();
  ctx.arc(cx, cy, 44, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 12; i++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((i * Math.PI) / 6);
    ctx.fillRect(58, -6, 26, 12);
    ctx.restore();
  }
}

function drawMoon(ctx: Ctx, cx: number, cy: number) {
  const moon = document.createElement("canvas");
  moon.width = 160;
  moon.height = 160;
  const m = moon.getContext("2d");
  if (!m) return;
  m.fillStyle = "#FFF1B8";
  m.beginPath();
  m.arc(80, 80, 52, 0, Math.PI * 2);
  m.fill();
  m.globalCompositeOperation = "destination-out";
  m.beginPath();
  m.arc(104, 62, 48, 0, Math.PI * 2);
  m.fill();
  ctx.save();
  ctx.shadowColor = "rgba(255, 241, 184, 0.7)";
  ctx.shadowBlur = 30;
  ctx.drawImage(moon, cx - 80, cy - 80);
  ctx.restore();
}

function drawNameTag(ctx: Ctx, text: string, cx: number, cy: number, font: string) {
  ctx.font = font;
  const w = ctx.measureText(text).width + 44;
  const h = 62;
  roundRectPath(ctx, cx - w / 2, cy - h / 2, w, h, 14);
  ctx.fillStyle = "rgba(255, 249, 242, 0.95)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#FFFFFF";
  ctx.stroke();
  ctx.fillStyle = "#8C5A7A";
  ctx.fillText(text, cx, cy + 2);
}

function drawFlowerRow(ctx: Ctx, y: number, size: number, offset: number, color: string, alpha: number, font: (size: number) => string) {
  ctx.font = font(size);
  ctx.globalAlpha = alpha;
  FLOWERS.forEach((flower, index) => {
    const x = CARD_X + ((index * 11 + offset) / 100) * CARD_W + size / 2;
    ctx.fillStyle = "#D47DA2";
    ctx.fillText(flower, x + 3, y + 5);
    ctx.fillStyle = color;
    ctx.fillText(flower, x, y);
  });
  ctx.globalAlpha = 1;
}

export async function renderSceneImage(o: SceneImageOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d") as Ctx | null;
  if (!ctx) throw new Error("เบราว์เซอร์นี้วาดรูปไม่ได้");

  // ใช้ฟอนต์เดียวกับหน้าเว็บ และรอให้ตัวอักษรไทยโหลดครบก่อนวาด
  const family = getComputedStyle(document.body).fontFamily;
  const font = (weight: number) => (size: number) => `${weight} ${size}px ${family}`;
  try {
    await Promise.all([
      document.fonts.load(font(800)(64), `${o.title}${o.girlName ?? ""}${o.petName}${o.brand}`),
      document.fonts.load(font(600)(44), `${o.message}${o.footer}${o.dateText}${o.label}`),
    ]);
  } catch {
    // ถ้าโหลดฟอนต์ไม่ได้ก็วาดด้วยฟอนต์ที่มีอยู่
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // วัดความยาวข้อความก่อน แล้วจัดทุกอย่างให้อยู่กึ่งกลางแนวตั้งของรูป
  const MH = 860;
  const lineH = 70;
  ctx.font = font(600)(44);
  let lines = o.message ? wrapText(ctx, o.message, CARD_W - 120) : [];
  if (lines.length > 4) lines = [...lines.slice(0, 3), `${lines[3]}…`];
  const cardH = lines.length > 0 ? 132 + lines.length * lineH + 30 : 0;
  const contentH = 250 + MH + (cardH > 0 ? 54 + cardH : 0) + 116;
  const top = Math.max(80, Math.round((H - contentH) / 2));

  // ---------- พื้นหลังชมพู ----------
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#F8B9D2");
  bg.addColorStop(0.45, "#F7A8C8");
  bg.addColorStop(1, "#F6B4CE");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, 520, 0, W / 2, 520, 560);
  glow.addColorStop(0, "rgba(255, 248, 252, 0.5)");
  glow.addColorStop(1, "rgba(255, 248, 252, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ---------- หัวข้อ ----------
  ctx.letterSpacing = "6px";
  ctx.font = font(800)(30);
  ctx.fillStyle = "#8C4D6B";
  ctx.fillText(`♥ ${o.brand}`, W / 2, top);
  ctx.letterSpacing = "0px";

  fitFont(ctx, o.title, font(800), 76, CARD_W);
  ctx.fillStyle = "#DC83AA";
  ctx.fillText(o.title, W / 2 + 5, top + 116 + 7);
  ctx.fillStyle = "#FFFAFD";
  ctx.fillText(o.title, W / 2, top + 116);

  ctx.font = font(600)(32);
  ctx.fillStyle = "#7A4560";
  ctx.fillText(o.dateText, W / 2, top + 192);

  // ---------- ฉากทุ่งดอกไม้ ----------
  const MY = top + 250;
  const MB = MY + MH;
  const R = 56;

  roundRectPath(ctx, CARD_X, MY + 22, CARD_W, MH, R);
  ctx.fillStyle = "rgba(216, 137, 174, 0.35)";
  ctx.fill();

  ctx.save();
  roundRectPath(ctx, CARD_X, MY, CARD_W, MH, R);
  ctx.clip();

  const sky = ctx.createLinearGradient(0, MY, 0, MB);
  if (o.night) {
    sky.addColorStop(0, "#1C2654");
    sky.addColorStop(0.55, "#2E3B73");
    sky.addColorStop(1, "#3D5A6B");
  } else {
    sky.addColorStop(0, "#C8E9F2");
    sky.addColorStop(0.7, "#E5F4E8");
    sky.addColorStop(1, "#A9D7A5");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(CARD_X, MY, CARD_W, MH);

  if (o.night) {
    ctx.save();
    ctx.fillStyle = "#FFF6C9";
    ctx.shadowColor = "#FFF6C9";
    ctx.shadowBlur = 16;
    for (const [left, top] of STARS) {
      const x = CARD_X + (left / 100) * CARD_W;
      const y = MY + (top / 100) * MH;
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 9, y);
      ctx.lineTo(x, y + 9);
      ctx.lineTo(x - 9, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    drawMoon(ctx, CARD_X + CARD_W - 130, MY + 130);
  } else {
    drawSun(ctx, CARD_X + CARD_W - 130, MY + 130);
  }

  ctx.fillStyle = o.night ? "rgba(255, 249, 252, 0.25)" : "rgba(255, 249, 252, 0.92)";
  drawCloud(ctx, CARD_X + 0.12 * CARD_W + 100, MY + 170, 1);
  drawCloud(ctx, CARD_X + 0.72 * CARD_W, MY + 270, 0.7);

  ctx.fillStyle = o.night ? "#557F66" : "#A9D99E";
  ctx.beginPath();
  ctx.ellipse(CARD_X + CARD_W * 0.45, MB + 90, CARD_W * 0.85, 470, -0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = o.night ? "#3F6B52" : "#83C78E";
  ctx.beginPath();
  ctx.ellipse(CARD_X + CARD_W * 0.58, MB + 200, CARD_W * 0.85, 420, 0.07, 0, Math.PI * 2);
  ctx.fill();

  drawFlowerRow(ctx, MB - 190, 46, 2, "#FFF4FB", 0.85, font(400));

  // ตัวหวานกับน้องยืนบนพื้นเดียวกัน
  const scale = 20;
  const baseline = MB - 140;
  const girlW = GIRL_WIDTH * scale;
  const girlH = GIRL_HEIGHT * scale;
  const petW = PET_WIDTH * scale;
  const petH = PET_HEIGHT * scale;
  const gap = 40;
  const girlX = W / 2 - (girlW + gap + petW) / 2;
  const petX = girlX + girlW + gap;

  ctx.fillStyle = "rgba(71, 123, 74, 0.28)";
  for (const centerX of [girlX + girlW / 2, petX + petW / 2]) {
    ctx.beginPath();
    ctx.ellipse(centerX, baseline + 6, 120, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSprite(ctx, girlLayers(o.girl), GIRL_WIDTH, GIRL_HEIGHT, girlX, baseline - girlH, scale);
  drawSprite(ctx, petLayers(o.pet), PET_WIDTH, PET_HEIGHT, petX, baseline - petH, scale);

  const tagFont = font(800)(34);
  if (o.girlName) drawNameTag(ctx, `♡ ${o.girlName}`, girlX + girlW / 2, baseline - girlH - 48, tagFont);
  drawNameTag(ctx, `♡ ${o.petName}`, petX + petW / 2, baseline - petH - 40, tagFont);

  drawFlowerRow(ctx, MB - 70, 64, 1, "#FFE6F1", 1, font(400));
  ctx.restore();

  roundRectPath(ctx, CARD_X, MY, CARD_W, MH, R);
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#FFF7FB";
  ctx.stroke();

  // ---------- การ์ดข้อความ ----------
  const CY = MB + 54;
  if (cardH > 0) {
    roundRectPath(ctx, CARD_X, CY + 18, CARD_W, cardH, 48);
    ctx.fillStyle = "rgba(216, 137, 174, 0.3)";
    ctx.fill();
    roundRectPath(ctx, CARD_X, CY, CARD_W, cardH, 48);
    ctx.fillStyle = "#FFF9FC";
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.letterSpacing = "5px";
    ctx.font = font(800)(26);
    ctx.fillStyle = "#B9829D";
    ctx.fillText(o.label, W / 2, CY + 70);
    ctx.letterSpacing = "0px";

    ctx.font = font(600)(44);
    ctx.fillStyle = "#75445D";
    lines.forEach((line, index) => ctx.fillText(line, W / 2, CY + 142 + index * lineH));
  }

  // ---------- ท้ายรูป ----------
  fitFont(ctx, `${o.footer} ♡`, font(600), 32, CARD_W);
  ctx.fillStyle = "#7F4661";
  ctx.fillText(`${o.footer} ♡`, W / 2, (cardH > 0 ? CY + cardH : MB) + 96);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("ทำรูปไม่สำเร็จ"))), "image/png");
  });
}
