import type { CSSProperties, ReactNode } from "react";
import { BEACH_DECOR, CUP_COLORS, FLOWERS, LIGHT_COLORS, STARS } from "@/lib/scene";
import { scenes, type SceneId } from "@/config/scenes";
import type { Festival } from "@/config/festivals";

type Props = {
  children: ReactNode;
  scene?: SceneId;
  compact?: boolean;
  night?: boolean;
  festival?: Festival | null;
  label?: string;
};

// ท้องฟ้าของฉากกลางแจ้ง: พระอาทิตย์/พระจันทร์ ดาว และเมฆ
function Sky({ night }: { night: boolean }) {
  return (
    <>
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
    </>
  );
}

// ของที่ลอยในฉากตามเทศกาล (หิมะ หัวใจ โคมลอย) ตำแหน่งกำหนดตายตัวจากลำดับ ไม่ได้สุ่ม
function Particles({ festival }: { festival: Festival }) {
  const particles = festival.particles;
  if (!particles) return null;
  return (
    <div className={`particles particles-${particles.motion}`} aria-hidden="true">
      {Array.from({ length: 14 }, (_, index) => {
        const style: CSSProperties = {
          left: `${(index * 37 + 5) % 96}%`,
          fontSize: 11 + (index % 3) * 4,
          color: particles.color,
          animationDuration: `${5 + (index % 5) * 1.2}s`,
          animationDelay: `${-index * 0.75}s`,
        };
        if (particles.motion === "float") style.top = `${6 + ((index * 13) % 42)}%`;
        return (
          <span key={index} style={style}>
            {particles.glyphs[index % particles.glyphs.length]}
          </span>
        );
      })}
    </div>
  );
}

// ฉากหลังของตัวละคร ใช้ซ้ำทั้งหน้าพรีวิวและหน้าสุดท้าย
// กลางคืนฟ้าจะมืดมีดาว ส่วนฉากในร่มจะหรี่ไฟและเห็นฟ้ากลางคืนทางหน้าต่าง
export default function Scene({ children, scene = "meadow", compact = false, night = false, festival = null, label = "ฉากหลัง" }: Props) {
  const indoor = scenes.find((item) => item.id === scene)?.indoor ?? false;
  const snowy = Boolean(festival?.snowyGround) && scene === "meadow";
  const showParticles = festival?.particles && !(indoor && festival.particles.outdoorOnly);
  const classes = ["meadow", `scene-${scene}`, compact && "meadow-compact", night && "night", snowy && "snowy"].filter(Boolean).join(" ");

  return (
    <section className={classes} aria-label={label}>
      {scene === "meadow" && (
        <>
          <Sky night={night} />
          <div className="hill hill-back" aria-hidden="true" />
          <div className="hill hill-front" aria-hidden="true" />
          <div className="flower-row flower-row-back" aria-hidden="true">
            {FLOWERS.map((flower, index) => (
              <span key={index} style={{ left: `${index * 11 + 2}%`, animationDelay: `${index * 0.15}s` }}>{flower}</span>
            ))}
          </div>
        </>
      )}

      {scene === "beach" && (
        <>
          <Sky night={night} />
          <div className="sea" aria-hidden="true">
            <i style={{ left: "8%", top: "22%", width: "16%" }} />
            <i style={{ left: "46%", top: "40%", width: "22%", animationDelay: "-1.2s" }} />
            <i style={{ left: "70%", top: "16%", width: "14%", animationDelay: "-2s" }} />
            <i style={{ left: "24%", top: "62%", width: "18%", animationDelay: "-0.6s" }} />
          </div>
          <div className="sand" aria-hidden="true" />
        </>
      )}

      {scene === "cafe" && (
        <>
          <div className="window" aria-hidden="true" />
          <div className="shelf" aria-hidden="true">
            {CUP_COLORS.map((color, index) => (
              <i key={index} style={{ left: `${8 + index * 24}%`, background: color }} />
            ))}
          </div>
          <div className="lamp" aria-hidden="true" />
          <div className="wainscot" aria-hidden="true" />
          <div className="floor" aria-hidden="true" />
          <div className="dim" aria-hidden="true" />
        </>
      )}

      {scene === "bedroom" && (
        <>
          <div className="fairy-lights" aria-hidden="true">
            {Array.from({ length: 11 }, (_, index) => (
              <i
                key={index}
                style={{
                  left: `${4 + index * 9.2}%`,
                  top: `${Math.round(Math.sin((index / 10) * Math.PI) * 10)}px`,
                  background: LIGHT_COLORS[index % LIGHT_COLORS.length],
                  animationDelay: `${(index % 4) * 0.4}s`,
                }}
              />
            ))}
          </div>
          <div className="window" aria-hidden="true" />
          <div className="bed" aria-hidden="true">
            <div className="headboard" />
            <div className="mattress" />
            <div className="pillow" />
            <div className="blanket" />
          </div>
          <div className="floor" aria-hidden="true" />
          <div className="rug" aria-hidden="true" />
          <div className="dim" aria-hidden="true" />
        </>
      )}

      {showParticles && festival && <Particles festival={festival} />}

      <div className="stage">{children}</div>

      {scene === "meadow" && (
        <div className="flower-row flower-row-front" aria-hidden="true">
          {FLOWERS.map((flower, index) => (
            <span key={index} style={{ left: `${index * 11 + 1}%`, animationDelay: `${index * 0.2}s` }}>{flower}</span>
          ))}
        </div>
      )}

      {scene === "beach" && (
        <div className="beach-decor" aria-hidden="true">
          {BEACH_DECOR.map((glyph, index) => (
            <span key={index} className={`decor-${index % 3}`} style={{ left: `${index * 12.5 + 3}%`, bottom: `${6 + ((index * 7) % 14)}px` }}>
              {glyph}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
