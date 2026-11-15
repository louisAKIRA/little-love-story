import { girlLayers, petLayers, renderSprite, type GirlLook, type PetLook, type SpriteLayer } from "@/lib/sprites";
import { BEACH_DECOR, CUP_COLORS, FLOWERS, LIGHT_COLORS, STARS } from "@/lib/scene";
import { scenes, type SceneId } from "@/config/scenes";
import type { Festival } from "@/config/festivals";
import { GIRL_WIDTH, GIRL_HEIGHT } from "@/config/character";
import { PET_WIDTH, PET_HEIGHT } from "@/config/pets";

// =====================================================================
//  ทำรูปฉากขนาดสตอรี่ (1080 x 1920) ด้วย canvas
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
  scene: SceneId;
  festival: Festival | null;
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
  for (const p of renderSprite(layers, width, height)) {
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

type Area = { x: number; y: number; w: number; h: number };
type FontOf = (weight: number) => (size: number) => string;

// ฉากบนจอสูง 300px ส่วนในรูปสูงกว่านั้น ค่านี้ใช้แปลงระยะจาก CSS มาเป็นในรูป
const cssScale = (area: Area) => area.h / 300;

// ท้องฟ้าของฉากกลางแจ้ง: ไล่สี ดาว พระอาทิตย์/พระจันทร์ เมฆ
function drawSky(ctx: Ctx, area: Area, night: boolean, stops: [number, string][]) {
  const sky = ctx.createLinearGradient(0, area.y, 0, area.y + area.h);
  for (const [offset, color] of stops) sky.addColorStop(offset, color);
  ctx.fillStyle = sky;
  ctx.fillRect(area.x, area.y, area.w, area.h);

  if (night) {
    ctx.save();
    ctx.fillStyle = "#FFF6C9";
    ctx.shadowColor = "#FFF6C9";
    ctx.shadowBlur = 16;
    for (const [left, top] of STARS) {
      const x = area.x + (left / 100) * area.w;
      const y = area.y + (top / 100) * area.h;
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 9, y);
      ctx.lineTo(x, y + 9);
      ctx.lineTo(x - 9, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    drawMoon(ctx, area.x + area.w - 130, area.y + 130);
  } else {
    drawSun(ctx, area.x + area.w - 130, area.y + 130);
  }

  ctx.fillStyle = night ? "rgba(255, 249, 252, 0.25)" : "rgba(255, 249, 252, 0.92)";
  drawCloud(ctx, area.x + 0.12 * area.w + 100, area.y + 170, 1);
  drawCloud(ctx, area.x + 0.72 * area.w, area.y + 270, 0.7);
}

// หน้าต่างของฉากในร่ม กลางคืนจะเห็นพระจันทร์กับดาว
function drawWindow(ctx: Ctx, night: boolean, x: number, y: number, w: number, h: number) {
  roundRectPath(ctx, x - 14, y - 14, w + 28, h + 28, 34);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  const glass = ctx.createLinearGradient(0, y, 0, y + h);
  glass.addColorStop(0, night ? "#1C2654" : "#BFE6F3");
  glass.addColorStop(1, night ? "#34437E" : "#E6F5EC");
  roundRectPath(ctx, x, y, w, h, 22);
  ctx.fillStyle = glass;
  ctx.fill();
  if (night) {
    ctx.fillStyle = "#FFF1B8";
    ctx.beginPath();
    ctx.arc(x + w * 0.72, y + h * 0.3, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFF6C9";
    for (const [sx, sy] of [[0.24, 0.22], [0.38, 0.7], [0.6, 0.8]]) {
      ctx.beginPath();
      ctx.arc(x + w * sx, y + h * sy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(x + w / 2 - 5, y, 10, h);
  ctx.fillRect(x, y + h / 2 - 5, w, 10);
}

function drawFloor(ctx: Ctx, area: Area, color: string, line: string, edge: string, plank: number) {
  const top = area.y + area.h * 0.78;
  ctx.fillStyle = color;
  ctx.fillRect(area.x, top, area.w, area.y + area.h - top);
  ctx.fillStyle = line;
  for (let x = area.x + plank; x < area.x + area.w; x += plank) ctx.fillRect(x, top, 6, area.y + area.h - top);
  ctx.fillStyle = edge;
  ctx.fillRect(area.x, top, area.w, 10);
}

// ฉากหลังส่วนที่อยู่หลังตัวละคร
function drawBackdrop(ctx: Ctx, o: SceneImageOptions, area: Area, font: FontOf) {
  const { x, y, w, h } = area;
  const bottom = y + h;
  const night = o.night;

  if (o.scene === "meadow") {
    const snowy = Boolean(o.festival?.snowyGround);
    const daySky: [number, string][] = snowy ? [[0, "#B9DDF0"], [0.7, "#DCEEF6"], [1, "#F4F8FB"]] : [[0, "#C8E9F2"], [0.7, "#E5F4E8"], [1, "#A9D7A5"]];
    drawSky(ctx, area, night, night ? [[0, "#1C2654"], [0.55, "#2E3B73"], [1, "#3D5A6B"]] : daySky);
    ctx.fillStyle = snowy ? (night ? "#C2CDE3" : "#EEF4FA") : night ? "#557F66" : "#A9D99E";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.45, bottom + 90, w * 0.85, 470, -0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = snowy ? (night ? "#D9E1F0" : "#FFFFFF") : night ? "#3F6B52" : "#83C78E";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.58, bottom + 200, w * 0.85, 420, 0.07, 0, Math.PI * 2);
    ctx.fill();
    drawFlowerRow(ctx, bottom - 190, 46, 2, snowy ? "#FFFFFF" : "#FFF4FB", 0.85, font(400));
    return;
  }

  if (o.scene === "beach") {
    drawSky(ctx, area, night, night ? [[0, "#1C2654"], [0.38, "#2E3B73"], [0.52, "#3A4A86"]] : [[0, "#BDE8F5"], [0.36, "#E4F3F1"], [0.52, "#FDEBD3"]]);
    const seaTop = y + h * 0.5;
    const seaH = h * 0.26;
    const sea = ctx.createLinearGradient(0, seaTop, 0, seaTop + seaH);
    sea.addColorStop(0, night ? "#2F4F86" : "#7DD0E6");
    sea.addColorStop(1, night ? "#1F3A66" : "#4FA9D0");
    ctx.fillStyle = sea;
    ctx.fillRect(x, seaTop, w, seaH);
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (const [left, top, width] of [[0.08, 0.22, 0.16], [0.46, 0.4, 0.22], [0.7, 0.16, 0.14], [0.24, 0.62, 0.18]]) {
      roundRectPath(ctx, x + w * left, seaTop + seaH * top, w * width, 8, 4);
      ctx.fill();
    }
    ctx.fillStyle = night ? "#C7B796" : "#FBEFD2";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 1.01 - 16, w * 0.65, h * 0.37, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = night ? "#B5A383" : "#F6DFB0";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 1.01, w * 0.65, h * 0.37, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (o.scene === "cafe") {
    ctx.fillStyle = "#FBE7D3";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#F8DDC4";
    for (let sx = x + 63; sx < x + w; sx += 126) ctx.fillRect(sx, y, 63, h);
    ctx.fillStyle = "#E7C4A0";
    ctx.fillRect(x, y + h * 0.56, w, h * 0.44);
    ctx.fillStyle = "#F6E3CF";
    ctx.fillRect(x, y + h * 0.56, w, 10);

    drawWindow(ctx, night, x + w * 0.08, y + h * 0.11, w * 0.36, h * 0.34);

    const shelfX = x + w * 0.58;
    const shelfY = y + h * 0.32;
    const shelfW = w * 0.34;
    const cup = shelfW * 0.15;
    CUP_COLORS.forEach((color, index) => {
      roundRectPath(ctx, shelfX + shelfW * (0.08 + index * 0.24), shelfY - cup, cup, cup, 10);
      ctx.fillStyle = color;
      ctx.fill();
    });
    roundRectPath(ctx, shelfX, shelfY, shelfW, 16, 8);
    ctx.fillStyle = "#B98558";
    ctx.fill();

    const lampX = x + w * 0.68;
    ctx.fillStyle = "#8C6A55";
    ctx.fillRect(lampX - 3, y, 6, h * 0.09);
    ctx.save();
    ctx.shadowColor = "rgba(255, 215, 122, 0.8)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = "#FFD77A";
    ctx.beginPath();
    ctx.arc(lampX, y + h * 0.09 + 52, 52, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    drawFloor(ctx, area, "#C99A6E", "#BC8C60", "#A97A50", 132);
    return;
  }

  // ห้องนอน
  ctx.fillStyle = "#EADFF8";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  for (let dy = y + 37; dy < bottom; dy += 75) {
    for (let dx = x + 37; dx < x + w; dx += 75) {
      ctx.beginPath();
      ctx.arc(dx, dy, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const k = cssScale(area);
  ctx.save();
  for (let index = 0; index < 11; index++) {
    const lx = x + w * (0.04 + index * 0.092) + 11;
    const ly = y + h * 0.05 + Math.sin((index / 10) * Math.PI) * 10 * k + 11;
    ctx.fillStyle = LIGHT_COLORS[index % LIGHT_COLORS.length];
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(lx, ly, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  const winX = x + w * 0.61;
  const winY = y + h * 0.16;
  drawWindow(ctx, night, winX, winY, w * 0.3, h * 0.3);
  roundRectPath(ctx, winX - 14, winY - 44, w * 0.3 + 28, 34, 14);
  ctx.fillStyle = "#F7A8C8";
  ctx.fill();

  const bedX = x + w * 0.05;
  const bedY = y + h * 0.44;
  const bedW = w * 0.46;
  const bedH = h * 0.34;
  roundRectPath(ctx, bedX, bedY, bedW * 0.24, bedH, 36);
  ctx.fillStyle = "#F1A7C6";
  ctx.fill();
  roundRectPath(ctx, bedX + bedW * 0.08, bedY + bedH * 0.46, bedW * 0.92, bedH * 0.54, 26);
  ctx.fillStyle = "#FFF9FC";
  ctx.fill();
  roundRectPath(ctx, bedX + bedW * 0.12, bedY + bedH * 0.3 + 8, bedW * 0.26, bedH * 0.26, 26);
  ctx.fillStyle = "#EADCF0";
  ctx.fill();
  roundRectPath(ctx, bedX + bedW * 0.12, bedY + bedH * 0.3, bedW * 0.26, bedH * 0.26, 26);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  roundRectPath(ctx, bedX + bedW * 0.42, bedY + bedH * 0.42, bedW * 0.58, bedH * 0.58, 30);
  ctx.fillStyle = "#DCCBF7";
  ctx.fill();
  roundRectPath(ctx, bedX + bedW * 0.42, bedY + bedH * 0.42 + 18, bedW * 0.58, bedH * 0.58 - 18, 30);
  ctx.fillStyle = "#C9B2F2";
  ctx.fill();

  drawFloor(ctx, area, "#E8CDAE", "#DDBF9D", "#CFAE8A", 149);

  ctx.fillStyle = "#FBE0EC";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.56, y + h * 0.865, w * 0.36, h * 0.085, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#F7C4DA";
  ctx.beginPath();
  ctx.ellipse(x + w * 0.56, y + h * 0.865, w * 0.36 - 14, h * 0.085 - 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ของลอยตามเทศกาล (หิมะ หัวใจ โคมลอย) วางตำแหน่งตายตัวเหมือนบนจอ
function drawParticles(ctx: Ctx, o: SceneImageOptions, area: Area, font: FontOf) {
  const particles = o.festival?.particles;
  const indoor = scenes.find((item) => item.id === o.scene)?.indoor ?? false;
  if (!particles || (indoor && particles.outdoorOnly)) return;
  const k = cssScale(area);
  ctx.save();
  ctx.globalAlpha = 0.92;
  for (let index = 0; index < 14; index++) {
    const size = (11 + (index % 3) * 4) * k;
    const px = area.x + (((index * 37 + 5) % 96) / 100) * area.w + size / 2;
    const top = particles.motion === "float" ? 6 + ((index * 13) % 42) : 4 + ((index * 53 + 11) % 70);
    ctx.font = font(400)(size);
    ctx.fillStyle = particles.color ?? "#FFFFFF";
    ctx.fillText(particles.glyphs[index % particles.glyphs.length], px, area.y + (top / 100) * area.h + size / 2);
  }
  ctx.restore();
}

// ฉากหลังส่วนที่อยู่หน้าตัวละคร และไฟหรี่ของฉากในร่มตอนกลางคืน
function drawForeground(ctx: Ctx, o: SceneImageOptions, area: Area, font: FontOf) {
  const bottom = area.y + area.h;
  if (o.scene === "meadow") {
    drawFlowerRow(ctx, bottom - 70, 64, 1, o.festival?.snowyGround ? "#FFFFFF" : "#FFE6F1", 1, font(400));
  }
  if (o.scene === "beach") {
    const k = cssScale(area);
    const styles: [string, number][] = [["#F58F7C", 17 * k], ["#FFF4FB", 14 * k], ["#F7A8C8", 9 * k]];
    BEACH_DECOR.forEach((glyph, index) => {
      const [color, size] = styles[index % 3];
      ctx.font = font(400)(size);
      ctx.fillStyle = color;
      ctx.fillText(glyph, area.x + ((index * 12.5 + 3) / 100) * area.w + size / 2, bottom - (6 + ((index * 7) % 14)) * k - size / 2);
    });
  }
}

// หรี่ไฟฉากในร่มตอนกลางคืน (วาดก่อนตัวละคร ตัวละครจะไม่มืดตาม)
function drawDim(ctx: Ctx, o: SceneImageOptions, area: Area) {
  const indoor = scenes.find((item) => item.id === o.scene)?.indoor ?? false;
  if (!o.night || !indoor) return;
  ctx.fillStyle = "rgba(27, 22, 64, 0.3)";
  ctx.fillRect(area.x, area.y, area.w, area.h);
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

  const area: Area = { x: CARD_X, y: MY, w: CARD_W, h: MH };
  drawBackdrop(ctx, o, area, font);
  drawDim(ctx, o, area);
  drawParticles(ctx, o, area, font);

  // ตัวหวานกับน้องยืนบนพื้นเดียวกัน
  const scale = 16;
  const baseline = MB - 140;
  const girlW = GIRL_WIDTH * scale;
  const girlH = GIRL_HEIGHT * scale;
  const petW = PET_WIDTH * scale;
  const petH = PET_HEIGHT * scale;
  const gap = 40;
  const girlX = W / 2 - (girlW + gap + petW) / 2;
  const petX = girlX + girlW + gap;

  ctx.fillStyle = o.scene === "meadow" ? "rgba(71, 123, 74, 0.28)" : "rgba(70, 45, 70, 0.18)";
  for (const centerX of [girlX + girlW / 2, petX + petW / 2]) {
    ctx.beginPath();
    ctx.ellipse(centerX, baseline + 6, 120, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawSprite(ctx, girlLayers(o.girl), GIRL_WIDTH, GIRL_HEIGHT, girlX, baseline - girlH, scale);
  drawSprite(ctx, petLayers(o.pet), PET_WIDTH, PET_HEIGHT, petX, baseline - petH, scale);

  const tagFont = font(800)(34);
  if (o.girlName) drawNameTag(ctx, `♡ ${o.girlName}`, girlX + girlW / 2, baseline - girlH - 24, tagFont);
  drawNameTag(ctx, `♡ ${o.petName}`, petX + petW / 2, baseline - petH - 30, tagFont);

  drawForeground(ctx, o, area, font);
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
