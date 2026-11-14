import type { ReactNode } from "react";
import { FLOWERS, STARS } from "@/lib/scene";

type Props = { children: ReactNode; compact?: boolean; night?: boolean; label?: string };

// ฉากทุ่งดอกไม้ ใช้ซ้ำทั้งหน้าพรีวิวและหน้าสุดท้าย กลางคืนจะเป็นฟ้ามืดมีดาวกับพระจันทร์
export default function Meadow({ children, compact = false, night = false, label = "ทุ่งดอกไม้" }: Props) {
  return (
    <section className={`meadow ${compact ? "meadow-compact" : ""} ${night ? "night" : ""}`} aria-label={label}>
      {night ? <div className="moon" aria-hidden="true" /> : <div className="sun" aria-hidden="true">✺</div>}
      {night && (
        <div className="stars" aria-hidden="true">
          {STARS.map(([left, top], index) => (
            <span key={index} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${(index % 5) * 0.45}s` }} />
          ))}
        </div>
      )}
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="hill hill-back" aria-hidden="true" />
      <div className="hill hill-front" aria-hidden="true" />
      <div className="flower-row flower-row-back" aria-hidden="true">
        {FLOWERS.map((flower, index) => (
          <span key={index} style={{ left: `${index * 11 + 2}%`, animationDelay: `${index * 0.15}s` }}>{flower}</span>
        ))}
      </div>
      <div className="stage">{children}</div>
      <div className="flower-row flower-row-front" aria-hidden="true">
        {FLOWERS.map((flower, index) => (
          <span key={index} style={{ left: `${index * 11 + 1}%`, animationDelay: `${index * 0.2}s` }}>{flower}</span>
        ))}
      </div>
    </section>
  );
}
