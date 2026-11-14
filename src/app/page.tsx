"use client";

import { useState } from "react";
import { Heart, Sparkles, Shuffle, ArrowLeft, ArrowRight, RefreshCw, Flower2, Pencil, Volume2, VolumeX } from "lucide-react";
import PixelGirl from "@/components/PixelGirl";
import PixelPet from "@/components/PixelPet";
import Meadow from "@/components/Meadow";
import { OptionBlock, Swatches, Chips, ToggleChips } from "@/components/Controls";
import { skinTones, hairStyles, hairColors, outfits, girlAccessories } from "@/config/character";
import { petKinds, coats, petAccessories, type PetKind } from "@/config/pets";
import { encouragements, copy, recipientName, moods, petDefaultNames, petTapLines } from "@/config/messages";
import { withName } from "@/lib/text";
import { useChiptune } from "@/lib/chiptune";

type Step = 0 | 1 | 2;

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];
const toggleId = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
const randomSubset = <T extends { id: string }>(list: readonly T[], chance: number) =>
  list.filter(() => Math.random() < chance).map((item) => item.id);

const PET_NAME_MAX = 12;

const defaults = {
  skin: skinTones[0].id,
  hairStyle: hairStyles[0].id,
  hairColor: hairColors[1].id,
  outfit: outfits[0].id,
  petKind: "cat" as PetKind,
  coat: coats[0].id,
};

export default function Home() {
  const [step, setStep] = useState<Step>(0);
  const [skinId, setSkinId] = useState(defaults.skin);
  const [hairStyleId, setHairStyleId] = useState(defaults.hairStyle);
  const [hairColorId, setHairColorId] = useState(defaults.hairColor);
  const [outfitId, setOutfitId] = useState(defaults.outfit);
  const [girlAccessoryIds, setGirlAccessoryIds] = useState<string[]>([]);
  const [petKind, setPetKind] = useState<PetKind>(defaults.petKind);
  const [coatId, setCoatId] = useState(defaults.coat);
  const [petAccessoryIds, setPetAccessoryIds] = useState<string[]>([]);
  const [petNameInput, setPetNameInput] = useState("");
  const [moodId, setMoodId] = useState<string | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const music = useChiptune();

  const skin = skinTones.find((item) => item.id === skinId) ?? skinTones[0];
  const hairStyle = hairStyles.find((item) => item.id === hairStyleId) ?? hairStyles[0];
  const hairColor = hairColors.find((item) => item.id === hairColorId) ?? hairColors[0];
  const outfit = outfits.find((item) => item.id === outfitId) ?? outfits[0];
  const coat = coats.find((item) => item.id === coatId) ?? coats[0];
  const girlGear = girlAccessories.filter((item) => girlAccessoryIds.includes(item.id));
  const petGear = petAccessories.filter((item) => petAccessoryIds.includes(item.id));
  const petName = petNameInput.trim() || petDefaultNames[petKind];
  const fill = (text: string) => withName(text, petName);
  const tapLines = petTapLines[petKind].map(fill);

  const mood = moods.find((item) => item.id === moodId) ?? null;
  const messagePool = mood && mood.messages.length > 0 ? mood.messages : encouragements;
  const currentMessage = messagePool.length > 0 ? fill(messagePool[messageIndex % messagePool.length]) : "";

  const goTo = (next: Step) => {
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const randomizeCharacter = () => {
    setSkinId(pick(skinTones).id);
    setHairStyleId(pick(hairStyles).id);
    setHairColorId(pick(hairColors).id);
    setOutfitId(pick(outfits).id);
    setGirlAccessoryIds(randomSubset(girlAccessories, 0.35));
  };

  const randomizePet = () => {
    setPetKind(pick(petKinds).id);
    setCoatId(pick(coats).id);
    setPetAccessoryIds(randomSubset(petAccessories, 0.4));
  };

  const chooseMood = (id: string) => {
    setMoodId((current) => (current === id ? null : id));
    setMessageIndex(0);
  };

  const restart = () => {
    setSkinId(defaults.skin);
    setHairStyleId(defaults.hairStyle);
    setHairColorId(defaults.hairColor);
    setOutfitId(defaults.outfit);
    setGirlAccessoryIds([]);
    setPetKind(defaults.petKind);
    setCoatId(defaults.coat);
    setPetAccessoryIds([]);
    setPetNameInput("");
    setMoodId(null);
    setMessageIndex(0);
    goTo(0);
  };

  const nextMessage = () => setMessageIndex((current) => current + 1);

  const stepNames = [copy.steps.character, copy.steps.pet, fill(copy.steps.result)];

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

      {/* ---------- ขั้นที่ 1: แต่งตัวละคร ---------- */}
      {step === 0 && (
        <>
          <Meadow compact label="พรีวิวตัวละคร">
            <PixelGirl skin={skin.color} hairStyle={hairStyle} hairColor={hairColor.color} outfit={outfit} accessories={girlGear} />
          </Meadow>

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

            <OptionBlock title={copy.options.outfit} hint={outfit.name}>
              <Chips
                items={outfits.map((item) => ({ id: item.id, name: item.name, colors: [item.colors.a, item.colors.b] }))}
                value={outfitId}
                onChange={setOutfitId}
              />
            </OptionBlock>

            <OptionBlock title={copy.options.accessories} hint={copy.options.accessoriesHint}>
              <ToggleChips items={girlAccessories} values={girlAccessoryIds} onToggle={(id) => setGirlAccessoryIds((list) => toggleId(list, id))} />
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
          <Meadow compact label="พรีวิวสัตว์เลี้ยง">
            <PixelPet kind={petKind} coat={coat} accessories={petGear} name={petName} lines={tapLines} onTap={music.blip} />
          </Meadow>
          <p className="meadow-hint">{fill(copy.petTapHint)}</p>

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
              <ToggleChips items={petAccessories} values={petAccessoryIds} onToggle={(id) => setPetAccessoryIds((list) => toggleId(list, id))} />
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
          <Meadow label={fill(copy.steps.result)}>
            <span className="float-heart" style={{ left: "18%", animationDelay: "0s" }} aria-hidden="true">♡</span>
            <span className="float-heart" style={{ left: "72%", animationDelay: "1.6s" }} aria-hidden="true">♡</span>
            <span className="float-heart" style={{ left: "48%", animationDelay: "2.9s" }} aria-hidden="true">♡</span>
            <PixelGirl
              skin={skin.color}
              hairStyle={hairStyle}
              hairColor={hairColor.color}
              outfit={outfit}
              accessories={girlGear}
              name={recipientName.trim() || undefined}
            />
            <PixelPet kind={petKind} coat={coat} accessories={petGear} name={petName} lines={tapLines} onTap={music.blip} />
          </Meadow>
          <p className="meadow-hint">{fill(copy.petTapHint)}</p>

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

            <h2 aria-live="polite">{currentMessage}</h2>
            <button type="button" className="btn btn-soft" onClick={nextMessage}>
              <RefreshCw size={14} /> {copy.buttons.nextMessage}
            </button>
            <span className="message-decoration" aria-hidden="true">✿</span>
          </section>

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
