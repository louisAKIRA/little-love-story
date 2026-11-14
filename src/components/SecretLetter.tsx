"use client";

import { useRef } from "react";
import PixelSprite from "@/components/PixelSprite";

const ENVELOPE = [
  "oooooooooooo",
  "owwwwwwwwwwo",
  "oowwwwwwwwoo",
  "owowwwwwwowo",
  "owwowwwwowwo",
  "owwwohhowwwo",
  "owwwwhhwwwwo",
  "owwwwwwwwwwo",
  "oooooooooooo",
];
const ENVELOPE_PALETTE = { o: "#D979A6", w: "#FFF6EC", h: "#F26A9E" };

type Props = {
  unlocked: boolean;
  isNew: boolean;
  title: string;
  lockedTitle: string;
  hint: string;
  tapsLabel: string;
  daysLabel: string;
  tapsPercent: number;
  daysPercent: number;
  newBadge: string;
  openLabel: string;
  closeLabel: string;
  greeting: string;
  paragraphs: string[];
  signature: string;
  onOpen: () => void;
};

// การ์ดจดหมายลับ: ล็อกอยู่จะบอกว่าเหลืออีกเท่าไร ปลดล็อกแล้วกดเปิดอ่านเป็นหน้าต่างจดหมาย
export default function SecretLetter(props: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    props.onOpen();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <section className={`letter-card ${props.unlocked ? "unlocked" : "locked"} ${props.unlocked && props.isNew ? "is-new" : ""}`}>
        <div className="letter-envelope" aria-hidden="true">
          <PixelSprite layers={[{ rows: ENVELOPE, palette: ENVELOPE_PALETTE }]} width={12} height={9} scale={6} label="ซองจดหมาย" />
        </div>
        <div className="letter-body">
          <p className="letter-title">
            {props.unlocked ? "💌" : "🔒"} {props.unlocked ? props.title : props.lockedTitle}
            {props.unlocked && props.isNew && <span className="letter-badge">{props.newBadge}</span>}
          </p>
          {props.unlocked ? (
            <button type="button" className="btn btn-primary letter-open" onClick={open}>
              {props.openLabel}
            </button>
          ) : (
            <>
              <p className="letter-hint">{props.hint}</p>
              <div className="letter-progress">
                <span>{props.tapsLabel}</span>
                <div className="progress-track"><i style={{ width: `${props.tapsPercent}%` }} /></div>
              </div>
              <div className="letter-progress">
                <span>{props.daysLabel}</span>
                <div className="progress-track"><i style={{ width: `${props.daysPercent}%` }} /></div>
              </div>
            </>
          )}
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="letter-dialog"
        aria-label={props.title}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <article className="letter-paper">
          <p className="letter-greeting">{props.greeting}</p>
          {props.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <p className="letter-signature">{props.signature}</p>
          <button type="button" className="btn btn-soft" onClick={close}>
            {props.closeLabel}
          </button>
        </article>
      </dialog>
    </>
  );
}
