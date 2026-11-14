import type { ReactNode } from "react";

// กล่องหัวข้อของกลุ่มตัวเลือก
export function OptionBlock({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="option-block">
      <div className="option-title">
        <span>{title}</span>
        {hint && <small>{hint}</small>}
      </div>
      {children}
    </div>
  );
}

type SwatchItem = { id: string; name: string; color: string };

// วงกลมสี (สีผิว สีผม สีขน)
export function Swatches({ items, value, onChange, prefix }: { items: SwatchItem[]; value: string; onChange: (id: string) => void; prefix: string }) {
  return (
    <div className="swatches" role="radiogroup">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="radio"
          className={`swatch ${value === item.id ? "active" : ""}`}
          style={{ background: item.color }}
          onClick={() => onChange(item.id)}
          aria-label={`${prefix}${item.name}`}
          aria-checked={value === item.id}
        >
          {value === item.id && <span>✓</span>}
        </button>
      ))}
    </div>
  );
}

type ChipItem = { id: string; name: string; emoji?: string; colors?: string[] };

function ChipContent({ item }: { item: ChipItem }) {
  return (
    <>
      {item.emoji && <span className="chip-emoji">{item.emoji}</span>}
      {item.colors && (
        <span className="chip-dots" aria-hidden="true">
          {item.colors.map((color, index) => <i key={index} style={{ background: color }} />)}
        </span>
      )}
      {item.name}
    </>
  );
}

// ปุ่มเม็ดยาแบบเลือกได้อันเดียว (ทรงผม เสื้อผ้า หมา/แมว)
export function Chips({ items, value, onChange }: { items: ChipItem[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="chips" role="radiogroup">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="radio"
          className={`chip ${value === item.id ? "active" : ""}`}
          onClick={() => onChange(item.id)}
          aria-checked={value === item.id}
        >
          <ChipContent item={item} />
        </button>
      ))}
    </div>
  );
}

// ปุ่มเม็ดยาแบบเปิด/ปิดได้หลายอัน (เครื่องประดับ)
export function ToggleChips({ items, values, onToggle }: { items: ChipItem[]; values: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="chips" role="group">
      {items.map((item) => {
        const on = values.includes(item.id);
        return (
          <button key={item.id} type="button" className={`chip ${on ? "active" : ""}`} onClick={() => onToggle(item.id)} aria-pressed={on}>
            <ChipContent item={item} />
          </button>
        );
      })}
    </div>
  );
}
