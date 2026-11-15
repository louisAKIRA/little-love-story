import { clothing, defaultBottomId, defaultClothesIds, defaultShoesId, defaultTopId, type ClothingSlot } from "@/config/clothing";

const slotOf = (id: string) => clothing.find((piece) => piece.id === id)?.slot;

// จัดชุดให้ถูกกติกา: หมวดละ 1 ชิ้น, ใส่เดรสแล้วไม่มีเสื้อกับกางเกง,
// ไม่ได้ใส่เดรสต้องมีทั้งเสื้อและกางเกง, และต้องมีรองเท้า (เท้าเปล่าก็นับเป็นหนึ่งชิ้น)
export function normalizeClothes(ids: unknown): string[] {
  const wanted = Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : [];
  const bySlot = new Map<ClothingSlot, string>();
  for (const id of wanted) {
    const slot = slotOf(id);
    if (slot && !bySlot.has(slot)) bySlot.set(slot, id);
  }
  if (bySlot.has("dress")) {
    bySlot.delete("top");
    bySlot.delete("bottom");
  } else {
    if (!bySlot.has("top")) bySlot.set("top", defaultTopId);
    if (!bySlot.has("bottom")) bySlot.set("bottom", defaultBottomId);
  }
  if (!bySlot.has("shoes")) bySlot.set("shoes", defaultShoesId);
  const chosen = new Set(bySlot.values());
  return clothing.filter((piece) => chosen.has(piece.id)).map((piece) => piece.id);
}

// เลือกชิ้นใหม่ในหมวดหนึ่ง (id = null คือถอดออก)
// เลือกเดรสจะถอดเสื้อกับกางเกง เลือกเสื้อหรือกางเกงจะถอดเดรส
export function pickClothing(current: string[], slot: ClothingSlot, id: string | null): string[] {
  let next = current.filter((item) => slotOf(item) !== slot);
  if (id) {
    if (slot === "dress") next = next.filter((item) => slotOf(item) !== "top" && slotOf(item) !== "bottom");
    if (slot === "top" || slot === "bottom") next = next.filter((item) => slotOf(item) !== "dress");
    next = [id, ...next];
  }
  return normalizeClothes(next);
}

// ชุดแบบเก่า (ก่อนแยกชิ้น) ที่อาจยังจำอยู่ในเครื่อง แปลงเป็นชิ้นแยก
const legacyOutfits: Record<string, string[]> = {
  dress: ["dress-pink"],
  "tee-skirt": ["tee-cream", "skirt-purple"],
  overalls: ["overalls"],
  hoodie: ["hoodie-mint", "shorts-green"],
  sailor: ["sailor-top", "skirt-navy"],
};

export function clothesFromSaved(savedClothes: unknown, legacyOutfit: unknown): string[] {
  if (Array.isArray(savedClothes) && savedClothes.length > 0) return normalizeClothes(savedClothes);
  if (typeof legacyOutfit === "string" && legacyOutfits[legacyOutfit]) return normalizeClothes(legacyOutfits[legacyOutfit]);
  return normalizeClothes(defaultClothesIds);
}
