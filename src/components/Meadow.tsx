import type { ReactNode } from "react";

const flowers = ["✿", "❀", "✾", "✽", "❁", "✿", "❀", "✾", "✽"];

type Props = { children: ReactNode; compact?: boolean; label?: string };

// ฉากทุ่งดอกไม้ ใช้ซ้ำทั้งหน้าพรีวิวและหน้าสุดท้าย
export default function Meadow({ children, compact = false, label = "ทุ่งดอกไม้" }: Props) {
  return (
    <section className={`meadow ${compact ? "meadow-compact" : ""}`} aria-label={label}>
      <div className="sun" aria-hidden="true">✺</div>
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="hill hill-back" aria-hidden="true" />
      <div className="hill hill-front" aria-hidden="true" />
      <div className="flower-row flower-row-back" aria-hidden="true">
        {flowers.map((flower, index) => (
          <span key={index} style={{ left: `${index * 11 + 2}%`, animationDelay: `${index * 0.15}s` }}>{flower}</span>
        ))}
      </div>
      <div className="stage">{children}</div>
      <div className="flower-row flower-row-front" aria-hidden="true">
        {flowers.map((flower, index) => (
          <span key={index} style={{ left: `${index * 11 + 1}%`, animationDelay: `${index * 0.2}s` }}>{flower}</span>
        ))}
      </div>
    </section>
  );
}
