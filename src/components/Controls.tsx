"use client";

import { useState, type ReactNode } from "react";

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

type AccessoryItem = { id: string; category: string; name: string; emoji?: string; colors?: string[] };
// optional = false คือหมวดที่ต้องมีของเสมอ (ไม่มีปุ่ม "ไม่ใส่")
type AccessoryCategoryItem = { id: string; name: string; emoji?: string; optional?: boolean };

// ตัวเลือกแบบแท็บหมวดหมู่ ใช้ทั้งเครื่องประดับและเสื้อผ้า: เลือกได้หมวดละ 1 อย่าง ใส่ข้ามหมวดพร้อมกันได้
// แท็บของหมวดที่ใส่ของอยู่จะมีจุดสีบอกไว้
// ถ้าส่ง onPick มา จะให้ผู้เรียกจัดการกติกาเอง (เช่น ใส่เดรสแล้วถอดเสื้อกับกางเกง)
export function AccessoryPicker({
  categories,
  items,
  values,
  onChange,
  onPick,
  noneLabel,
}: {
  categories: AccessoryCategoryItem[];
  items: AccessoryItem[];
  values: string[];
  onChange?: (ids: string[]) => void;
  onPick?: (categoryId: string, id: string | null) => void;
  noneLabel: string;
}) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const selectedIn = (categoryId: string) => items.find((item) => item.category === categoryId && values.includes(item.id));
  const current = selectedIn(active);
  const optional = categories.find((category) => category.id === active)?.optional !== false;

  const choose = (id: string | null) => {
    if (onPick) {
      onPick(active, id);
      return;
    }
    const others = values.filter((value) => items.find((item) => item.id === value)?.category !== active);
    onChange?.(id ? [...others, id] : others);
  };

  return (
    <div className="accessory-picker">
      <div className="category-tabs" role="tablist">
        {categories.map((category) => {
          const worn = selectedIn(category.id);
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active === category.id}
              className={`category-tab ${active === category.id ? "active" : ""}`}
              onClick={() => setActive(category.id)}
            >
              {category.emoji && <span aria-hidden="true">{category.emoji}</span>}
              {category.name}
              {worn && <i className="tab-dot" aria-label={worn.name} />}
            </button>
          );
        })}
      </div>
      <div className="chips" role="radiogroup">
        {optional && (
          <button type="button" role="radio" className={`chip ${current ? "" : "active"}`} onClick={() => choose(null)} aria-checked={!current}>
            {noneLabel}
          </button>
        )}
        {items
          .filter((item) => item.category === active)
          .map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              className={`chip ${current?.id === item.id ? "active" : ""}`}
              onClick={() => choose(item.id)}
              aria-checked={current?.id === item.id}
            >
              <ChipContent item={item} />
            </button>
          ))}
      </div>
    </div>
  );
}
