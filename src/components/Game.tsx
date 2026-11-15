"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles, Shuffle, ArrowLeft, ArrowRight, RefreshCw, Flower2, Pencil, Volume2, VolumeX, Camera } from "lucide-react";
import PixelGirl from "@/components/PixelGirl";
import PixelPet, { type PetHandle } from "@/components/PixelPet";
import Scene from "@/components/Scene";
import SecretLetter from "@/components/SecretLetter";
import { OptionBlock, Swatches, Chips, AccessoryPicker } from "@/components/Controls";
import { skinTones, hairStyles, hairColors, girlAccessories, girlAccessoryCategories } from "@/config/character";
import { clothing, clothingSlots, defaultClothesIds, type ClothingSlot } from "@/config/clothing";
import { presetLooks, type PresetLook } from "@/config/looks";
import { petKinds, coats, petAccessories, petAccessoryCategories, type PetKind } from "@/config/pets";
import { scenes, type SceneId } from "@/config/scenes";
import {
  encouragements,
  copy,
  recipientName,
  moods,
  petDefaultNames,
  petTapLines,
  petTreats,
  petTreatLines,
  tapMilestones,
  nightMode,
  secretLetter,
} from "@/config/messages";
import { withName } from "@/lib/text";
import { useChiptune } from "@/lib/chiptune";
import { localDayNumber, useDayNumber, useIsNight } from "@/lib/time";
import { useFestival } from "@/lib/festival";
import { renderSceneImage } from "@/lib/sceneImage";
import type { GirlLook, PetLook } from "@/lib/sprites";
import { clothesFromSaved, normalizeClothes, pickClothing } from "@/lib/wardrobe";
import { saveState, type SavedState } from "@/lib/storage";

type Step = 0 | 1 | 2;

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
// สุ่มเครื่องประดับ: แต่ละหมวดมีโอกาสได้ของ 1 ชิ้น
const randomPerCategory = <T extends { id: string; category: string }>(list: readonly T[], chance: number) => {
  const categories = [...new Set(list.map((item) => item.category))];
  return categories.flatMap((category) => (Math.random() < chance ? [pick(list.filter((item) => item.category === category)).id] : []));
};

// ใช้ค่าที่จำไว้เฉพาะเมื่อยังมีอยู่ใน config (เผื่อแก้ config แล้วลบตัวเลือกไป)
const validId = <T extends { id: string }>(list: readonly T[], id: unknown, fallback: string) =>
  typeof id === "string" && list.some((item) => item.id === id) ? id : fallback;
const validIds = <T extends { id: string; category: string }>(list: readonly T[], ids: unknown) => {
  if (!Array.isArray(ids)) return [];
  const seen = new Set<string>();
  return list
    .filter((item) => ids.includes(item.id) && !seen.has(item.category) && Boolean(seen.add(item.category)))
    .map((item) => item.id);
};
const toCount = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
const fillNumbers = (text: string, values: Record<string, number>) =>
  Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, String(value)), text);

// เสื้อผ้าสำหรับตัวเลือกแบบแท็บ: จุดสีมาจากสีหลักของชิ้นนั้น
const clothingItems = clothing.map((piece) => ({
  id: piece.id,
  category: piece.slot,
  name: piece.name,
  colors: Object.entries(piece.palette)
    .filter(([key]) => key === key.toLowerCase())
    .map(([, color]) => color)
    .slice(0, 2),
}));

// สุ่มชุด: บางทีได้เดรส บางทีได้เสื้อกับกางเกง
const randomClothes = () => {
  const inSlot = (slot: ClothingSlot) => clothing.filter((piece) => piece.slot === slot);
  const ids = Math.random() < 0.4 ? [pick(inSlot("dress")).id] : [pick(inSlot("top")).id, pick(inSlot("bottom")).id];
  ids.push(pick(inSlot("shoes")).id);
  if (Math.random() < 0.15) ids.push(pick(inSlot("outer")).id);
  return normalizeClothes(ids);
};

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((id) => b.includes(id));

const PET_NAME_MAX = 12;
const FEED_COOLDOWN_MS = 800;

const defaults = {
  skin: skinTones[0].id,
  hairStyle: (hairStyles.find((item) => item.id === "long") ?? hairStyles[0]).id,
  hairColor: (hairColors.find((item) => item.id === "black") ?? hairColors[0]).id,
  petKind: "cat" as PetKind,
  coat: coats[0].id,
};

type Props = {
  // ค่าที่จำไว้ในเครื่อง (null = เปิดครั้งแรก หรือยังไม่ได้โหลด)
  saved: SavedState | null;
  // true = บันทึกค่าลงเครื่องได้แล้ว
  persist: boolean;
};

export default function Game({ saved, persist }: Props) {
  const [step, setStep] = useState<Step>(saved?.completed ? 2 : 0);
  const [completed, setCompleted] = useState(saved?.completed === true);
  const [skinId, setSkinId] = useState(() => validId(skinTones, saved?.skin, defaults.skin));
  const [hairStyleId, setHairStyleId] = useState(() => validId(hairStyles, saved?.hairStyle, defaults.hairStyle));
  const [hairColorId, setHairColorId] = useState(() => validId(hairColors, saved?.hairColor, defaults.hairColor));
  const [clothingIds, setClothingIds] = useState<string[]>(() => clothesFromSaved(saved?.clothes, saved?.outfit));
  const [girlAccessoryIds, setGirlAccessoryIds] = useState<string[]>(() => validIds(girlAccessories, saved?.girlAccessories));
  const [petKind, setPetKind] = useState<PetKind>(saved?.petKind === "dog" || saved?.petKind === "cat" ? saved.petKind : defaults.petKind);
  const [coatId, setCoatId] = useState(() => validId(coats, saved?.coat, defaults.coat));
  const [petAccessoryIds, setPetAccessoryIds] = useState<string[]>(() => validIds(petAccessories, saved?.petAccessories));
  const [petNameInput, setPetNameInput] = useState(typeof saved?.petName === "string" ? saved.petName.slice(0, PET_NAME_MAX) : "");
  const [sceneId, setSceneId] = useState<SceneId>(() => validId(scenes, saved?.scene, scenes[0].id) as SceneId);
  const [moodId, setMoodId] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tapCount, setTapCount] = useState(() => toCount(saved?.tapCount));
  const [letterOpened, setLetterOpened] = useState(saved?.letterOpened === true);
  // นับวันที่แวะมาแบบไม่ซ้ำวัน: วันนี้ยังไม่เคยนับ ก็ +1
  const [visit] = useState(() => {
    const today = localDayNumber(new Date());
    const days = toCount(saved?.visitDays);
    return { today, days: saved?.lastDay === today ? Math.max(days, 1) : days + 1 };
  });
  const [feedLocked, setFeedLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const tapCountRef = useRef(tapCount);
  const petRef = useRef<PetHandle>(null);
  const music = useChiptune();
  const night = useIsNight();
  const festival = useFestival();
  const dayNumber = useDayNumber();

  const skin = skinTones.find((item) => item.id === skinId) ?? skinTones[0];
  const hairStyle = hairStyles.find((item) => item.id === hairStyleId) ?? hairStyles[0];
  const hairColor = hairColors.find((item) => item.id === hairColorId) ?? hairColors[0];
  const coat = coats.find((item) => item.id === coatId) ?? coats[0];

  const girlLook: GirlLook = {
    skin: skin.color,
    hairStyle,
    hairColor: hairColor.color,
    clothes: clothing.filter((piece) => clothingIds.includes(piece.id)),
    accessories: girlAccessories.filter((item) => girlAccessoryIds.includes(item.id)),
  };
  // ช่วงเทศกาล น้องจะใส่หมวกเทศกาลให้เอง ถ้ายังไม่ได้เลือกอะไรไว้บนหัว
  const wornPetItems = petAccessories.filter((item) => petAccessoryIds.includes(item.id));
  const festiveHatId = festival?.petHat && !wornPetItems.some((item) => item.category === "head") ? festival.petHat : null;
  const petLook: PetLook = {
    kind: petKind,
    coat,
    accessories: petAccessories.filter((item) => petAccessoryIds.includes(item.id) || item.id === festiveHatId),
  };

  const petName = petNameInput.trim() || petDefaultNames[petKind];
  const treat = petTreats[petKind];
  const fill = (text: string) => withName(text, petName);
  const tapLines = petTapLines[petKind].map(fill);
  const nightGreeting = night ? fill(nightMode.petGreeting[petKind]) : null;

  // ข้อความ: เริ่มจากข้อความประจำวัน แล้วปุ่ม "ขออีกอัน" วนต่อจากตรงนั้น
  const mood = moods.find((item) => item.id === moodId) ?? null;
  const messagePool = mood && mood.messages.length > 0 ? mood.messages : encouragements;
  const dailyOffset = dayNumber ?? 0;
  const currentMessage = messagePool.length > 0 ? fill(messagePool[(dailyOffset + messageIndex) % messagePool.length]) : "";
  const showDailyLabel = !mood && messageIndex === 0 && dayNumber !== null;

  // บันทึกลงเครื่องทุกครั้งที่มีอะไรเปลี่ยน
  useEffect(() => {
    if (!persist) return;
    saveState({
      version: 1,
      skin: skinId,
      hairStyle: hairStyleId,
      hairColor: hairColorId,
      clothes: clothingIds,
      girlAccessories: girlAccessoryIds,
      petKind,
      coat: coatId,
      petAccessories: petAccessoryIds,
      petName: petNameInput,
      scene: sceneId,
      completed,
      tapCount,
      visitDays: visit.days,
      lastDay: visit.today,
      letterOpened,
    });
  }, [
    persist,
    skinId,
    hairStyleId,
    hairColorId,
    clothingIds,
    girlAccessoryIds,
    petKind,
    coatId,
    petAccessoryIds,
    petNameInput,
    sceneId,
    completed,
    tapCount,
    visit,
    letterOpened,
  ]);

  // จดหมายลับ: จิ้มครบ หรือแวะมาครบ อย่างใดอย่างหนึ่ง
  const letterUnlocked = tapCount >= secretLetter.unlockTaps || visit.days >= secretLetter.unlockDays;
  const tapsLeft = Math.max(0, secretLetter.unlockTaps - tapCount);
  const daysLeft = Math.max(0, secretLetter.unlockDays - visit.days);
  const percent = (value: number, goal: number) => (goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 100);

  const goTo = (next: Step) => {
    setStep(next);
    if (next === 2) setCompleted(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ลุคสำเร็จรูป: ใส่เสื้อผ้าและเครื่องประดับทั้งชุด แล้วแก้ทีละชิ้นต่อได้
  const applyLook = (look: PresetLook) => {
    setClothingIds(normalizeClothes(look.clothes));
    setGirlAccessoryIds(validIds(girlAccessories, look.accessories));
  };
  const activeLookId = presetLooks.find(
    (look) => sameSet(normalizeClothes(look.clothes), clothingIds) && sameSet(validIds(girlAccessories, look.accessories), girlAccessoryIds),
  )?.id;

  const randomizeCharacter = () => {
    setSkinId(pick(skinTones).id);
    setHairStyleId(pick(hairStyles).id);
    setHairColorId(pick(hairColors).id);
    setClothingIds(randomClothes());
    setGirlAccessoryIds(randomPerCategory(girlAccessories, 0.4));
  };

  const randomizePet = () => {
    setPetKind(pick(petKinds).id);
    setCoatId(pick(coats).id);
    setPetAccessoryIds(randomPerCategory(petAccessories, 0.5));
  };

  const chooseMood = (id: string) => {
    setMoodId((current) => (current === id ? null : id));
    setMessageIndex(0);
  };

  // นับจำนวนจิ้ม ถ้าครบตามที่ตั้งไว้ คืนประโยคพิเศษให้น้องพูด
  const handlePetTap = () => {
    music.blip();
    tapCountRef.current += 1;
    const count = tapCountRef.current;
    setTapCount(count);
    if (count === secretLetter.unlockTaps && visit.days < secretLetter.unlockDays) return fill(secretLetter.unlockLine);
    const milestone = tapMilestones.find((item) => item.count === count);
    return milestone ? fill(milestone.text).replaceAll("{count}", String(count)) : null;
  };

  const feedPet = () => {
    if (feedLocked) return;
    setFeedLocked(true);
    window.setTimeout(() => setFeedLocked(false), FEED_COOLDOWN_MS);
    music.blip();
    const lines = petTreatLines[petKind];
    petRef.current?.feed(lines.length > 0 ? fill(pick(lines)) : null);
  };

  const saveImage = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const blob = await renderSceneImage({
        girl: girlLook,
        pet: petLook,
        girlName: recipientName.trim() || undefined,
        petName,
        brand: copy.brand,
        title: fill(copy.steps.result),
        dateText: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }),
        label: copy.resultLabel,
        message: currentMessage,
        footer: fill(copy.footer),
        night,
        scene: sceneId,
        festival,
      });
      const file = new File([blob], copy.imageFileName, { type: "image/png" });

      // มือถือ: เปิดหน้าแชร์ (มีปุ่มบันทึกรูป / ลงสตอรี่) คอมพิวเตอร์: ดาวน์โหลดไฟล์
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (isTouch && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: fill(copy.steps.result) });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          // แชร์ไม่ได้ ก็ดาวน์โหลดแทน
        }
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = copy.imageFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const restart = () => {
    setSkinId(defaults.skin);
    setHairStyleId(defaults.hairStyle);
    setHairColorId(defaults.hairColor);
    setClothingIds(normalizeClothes(defaultClothesIds));
    setGirlAccessoryIds([]);
    setPetKind(defaults.petKind);
    setCoatId(defaults.coat);
    setPetAccessoryIds([]);
    setPetNameInput("");
    setMoodId(null);
    setMessageIndex(0);
    setCompleted(false);
    // จำนวนจิ้ม วันที่แวะมา และจดหมายลับ ยังเก็บไว้เหมือนเดิม
    goTo(0);
  };

  const nextMessage = () => setMessageIndex((current) => current + 1);

  const stepNames = [copy.steps.character, copy.steps.pet, fill(copy.steps.result)];
  const tapStatus = tapCount > 0 ? fill(copy.tapCounter).replaceAll("{count}", String(tapCount)) : fill(copy.petTapHint);

  return (
    <main className="page-shell">
      <div className="sky-glow" />

      <header className="site-header">
        <div className="brand-mark"><Heart size={15} fill="currentColor" /> {copy.brand}</div>
        <span className="header-note">{fill(copy.headerNote)}</span>
      </header>

      <section className="hero">
        <p className="eyebrow"><Sparkles size={13} /> {copy.heroEyebrow}</p>
        <h1>{fill(step === 2 ? copy.resultTitle : copy.heroTitle)}</h1>
        <p className="hero-copy">{fill(step === 2 ? copy.resultSubtitle : copy.heroSubtitle)}</p>
      </section>

      <nav className="progress" aria-label="ขั้นตอน">
        {stepNames.map((name, index) => (
          <div key={name} className="progress-item">
            {index > 0 && <span className="progress-line" />}
            <span className={`progress-step ${step === index ? "active" : ""} ${step > index ? "done" : ""}`} aria-current={step === index ? "step" : undefined}>
              <i>{step > index ? "✓" : index + 1}</i>
              {name}
            </span>
          </div>
        ))}
      </nav>

      {festival && <p className="festival-banner">{fill(festival.greeting)}</p>}

      {/* ---------- ขั้นที่ 1: แต่งตัวละคร ---------- */}
      {step === 0 && (
        <>
          <Scene scene={sceneId} compact night={night} festival={festival} label="พรีวิวตัวละคร">
            <PixelGirl look={girlLook} />
          </Scene>

          <section className="card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">STEP 1</span>
                <h2>{copy.steps.character}</h2>
              </div>
              <button type="button" className="btn-icon" onClick={randomizeCharacter} aria-label={copy.buttons.random}>
                <Shuffle size={16} /> {copy.buttons.random}
              </button>
            </div>

            <OptionBlock title={copy.options.skin} hint={skin.name}>
              <Swatches items={skinTones} value={skinId} onChange={setSkinId} prefix="สีผิว" />
            </OptionBlock>

            <OptionBlock title={copy.options.hairStyle} hint={hairStyle.name}>
              <Chips items={hairStyles} value={hairStyleId} onChange={setHairStyleId} />
            </OptionBlock>

            <OptionBlock title={copy.options.hairColor} hint={hairColor.name}>
              <Swatches items={hairColors} value={hairColorId} onChange={setHairColorId} prefix="สีผม" />
            </OptionBlock>

            <OptionBlock title={fill(copy.options.looks)} hint={copy.options.looksHint}>
              <div className="chips" role="group">
                {presetLooks.map((look) => (
                  <button
                    key={look.id}
                    type="button"
                    className={`chip ${activeLookId === look.id ? "active" : ""}`}
                    onClick={() => applyLook(look)}
                    aria-pressed={activeLookId === look.id}
                  >
                    <span className="chip-emoji">{look.emoji}</span>
                    {look.name}
                  </button>
                ))}
              </div>
            </OptionBlock>

            <OptionBlock title={copy.options.outfit} hint={copy.options.outfitHint}>
              <AccessoryPicker
                categories={clothingSlots}
                items={clothingItems}
                values={clothingIds}
                onPick={(slot, id) => setClothingIds((current) => pickClothing(current, slot as ClothingSlot, id))}
                noneLabel={copy.options.accessoryNone}
              />
            </OptionBlock>

            <OptionBlock title={copy.options.accessories} hint={copy.options.accessoriesHint}>
              <AccessoryPicker
                categories={girlAccessoryCategories}
                items={girlAccessories}
                values={girlAccessoryIds}
                onChange={setGirlAccessoryIds}
                noneLabel={copy.options.accessoryNone}
              />
            </OptionBlock>

            <div className="actions">
              <button type="button" className="btn btn-primary" onClick={() => goTo(1)}>
                {copy.buttons.next} <ArrowRight size={15} />
              </button>
            </div>
          </section>
        </>
      )}

      {/* ---------- ขั้นที่ 2: เลือกเพื่อนซี้ ---------- */}
      {step === 1 && (
        <>
          <Scene scene={sceneId} compact night={night} festival={festival} label="พรีวิวสัตว์เลี้ยง">
            <PixelPet look={petLook} name={petName} lines={tapLines} onTap={handlePetTap} greeting={nightGreeting} treatEmoji={treat.emoji} />
          </Scene>
          <p className="meadow-hint">{tapStatus}</p>

          <section className="card">
            <div className="section-heading">
              <div>
                <span className="section-kicker">STEP 2</span>
                <h2>{copy.steps.pet}</h2>
              </div>
              <button type="button" className="btn-icon" onClick={randomizePet} aria-label={copy.buttons.random}>
                <Shuffle size={16} /> {copy.buttons.random}
              </button>
            </div>

            <OptionBlock title={copy.options.petKind}>
              <Chips items={petKinds} value={petKind} onChange={(id) => setPetKind(id as PetKind)} />
            </OptionBlock>

            <OptionBlock title={copy.options.petName} hint={copy.options.petNameHint}>
              <input
                className="text-input"
                type="text"
                value={petNameInput}
                placeholder={petDefaultNames[petKind]}
                maxLength={PET_NAME_MAX}
                onChange={(event) => setPetNameInput(event.target.value)}
                aria-label={copy.options.petName}
                autoComplete="off"
              />
            </OptionBlock>

            <OptionBlock title={copy.options.petCoat} hint={coat.name}>
              <Swatches items={coats} value={coatId} onChange={setCoatId} prefix="สีขน" />
            </OptionBlock>

            <OptionBlock title={copy.options.petAccessories} hint={copy.options.accessoriesHint}>
              <AccessoryPicker
                categories={petAccessoryCategories}
                items={petAccessories}
                values={petAccessoryIds}
                onChange={setPetAccessoryIds}
                noneLabel={copy.options.accessoryNone}
              />
            </OptionBlock>

            <div className="actions">
              <button type="button" className="btn btn-ghost" onClick={() => goTo(0)}>
                <ArrowLeft size={15} /> {copy.buttons.back}
              </button>
              <button type="button" className="btn btn-primary" onClick={() => goTo(2)}>
                {copy.buttons.finish} <Flower2 size={15} />
              </button>
            </div>
          </section>
        </>
      )}

      {/* ---------- ขั้นที่ 3: ทุ่งดอกไม้ ---------- */}
      {step === 2 && (
        <>
          <Scene scene={sceneId} night={night} festival={festival} label={fill(copy.steps.result)}>
            <span className="float-heart" style={{ left: "18%", animationDelay: "0s" }} aria-hidden="true">♡</span>
            <span className="float-heart" style={{ left: "72%", animationDelay: "1.6s" }} aria-hidden="true">♡</span>
            <span className="float-heart" style={{ left: "48%", animationDelay: "2.9s" }} aria-hidden="true">♡</span>
            <PixelGirl look={girlLook} name={recipientName.trim() || undefined} />
            <PixelPet
              ref={petRef}
              look={petLook}
              name={petName}
              lines={tapLines}
              onTap={handlePetTap}
              greeting={nightGreeting}
              treatEmoji={treat.emoji}
            />
          </Scene>
          <div className="meadow-bar">
            <p className="meadow-hint" aria-live="polite">{tapStatus}</p>
            <button type="button" className="btn-icon feed-button" onClick={feedPet} disabled={feedLocked}>
              <span aria-hidden="true">{treat.emoji}</span> {fill(copy.buttons.feed).replaceAll("{treat}", treat.name)}
            </button>
          </div>

          <section className="card scene-card">
            <div className="option-title">
              <span>{copy.options.scene}</span>
              <small>{scenes.find((item) => item.id === sceneId)?.name}</small>
            </div>
            <Chips items={scenes} value={sceneId} onChange={(id) => setSceneId(id as SceneId)} />
          </section>

          <section className="message-card">
            <div className="message-icon"><Heart size={19} fill="currentColor" /></div>
            <p className="message-label">{copy.resultLabel}</p>

            <p className="mood-question">{fill(copy.moodQuestion)}</p>
            <div className="mood-row" role="group" aria-label={fill(copy.moodQuestion)}>
              {moods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`mood-chip ${moodId === item.id ? "active" : ""}`}
                  onClick={() => chooseMood(item.id)}
                  aria-pressed={moodId === item.id}
                >
                  <span className="mood-emoji" aria-hidden="true">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {showDailyLabel && <p className="daily-label">{copy.dailyLabel}</p>}
            <h2 aria-live="polite">{currentMessage}</h2>
            <button type="button" className="btn btn-soft" onClick={nextMessage}>
              <RefreshCw size={14} /> {copy.buttons.nextMessage}
            </button>
            <span className="message-decoration" aria-hidden="true">✿</span>
          </section>

          <SecretLetter
            unlocked={letterUnlocked}
            isNew={!letterOpened}
            title={fill(secretLetter.title)}
            lockedTitle={fill(secretLetter.lockedTitle)}
            hint={fillNumbers(fill(secretLetter.lockedHint), { taps: tapsLeft, days: daysLeft })}
            tapsLabel={fillNumbers(fill(secretLetter.tapsProgress), { count: Math.min(tapCount, secretLetter.unlockTaps), goal: secretLetter.unlockTaps })}
            daysLabel={fillNumbers(fill(secretLetter.daysProgress), { count: Math.min(visit.days, secretLetter.unlockDays), goal: secretLetter.unlockDays })}
            tapsPercent={percent(tapCount, secretLetter.unlockTaps)}
            daysPercent={percent(visit.days, secretLetter.unlockDays)}
            newBadge={secretLetter.newBadge}
            openLabel={secretLetter.openButton}
            closeLabel={secretLetter.closeButton}
            greeting={fill(secretLetter.greeting)}
            paragraphs={secretLetter.paragraphs.map(fill)}
            signature={fill(secretLetter.signature)}
            onOpen={() => setLetterOpened(true)}
          />

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={saveImage} disabled={saving} aria-busy={saving}>
              <Camera size={15} /> {saving ? copy.buttons.savingImage : copy.buttons.saveImage}
            </button>
          </div>
          <div className="actions">
            <button type="button" className="btn btn-ghost" onClick={() => goTo(0)}>
              <Pencil size={14} /> {copy.buttons.editCharacter}
            </button>
            <button type="button" className="btn btn-ghost" onClick={restart}>
              <Shuffle size={14} /> {copy.buttons.restart}
            </button>
          </div>
        </>
      )}

      <footer className="footer">{fill(copy.footer)} <span>♡</span></footer>

      <button
        type="button"
        className={`music-toggle ${music.enabled ? "on" : ""}`}
        onClick={music.toggle}
        aria-pressed={music.enabled}
      >
        {music.enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        {music.enabled ? copy.buttons.musicOn : copy.buttons.musicOff}
      </button>
    </main>
  );
}
