// ผสมสี 2 สีแบบง่าย ๆ (ใช้ทำสีแก้มให้เข้ากับสีผิว)
export function mix(hexA: string, hexB: string, amount: number): string {
  const a = hexA.replace("#", "");
  const b = hexB.replace("#", "");
  const channel = (i: number) => {
    const ca = parseInt(a.slice(i, i + 2), 16);
    const cb = parseInt(b.slice(i, i + 2), 16);
    return Math.round(ca + (cb - ca) * amount).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(2)}${channel(4)}`;
}
