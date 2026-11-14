"use client";

import Game from "@/components/Game";
import { loadSaved, useIsClient } from "@/lib/storage";

// ตอน build ยังไม่รู้ว่าเครื่องคนเปิดจำอะไรไว้ จึงแสดงค่าเริ่มต้นก่อน
// พอเปิดในเบราว์เซอร์แล้ว จะโหลดเกมใหม่อีกรอบพร้อมค่าที่จำไว้
export default function Home() {
  const isClient = useIsClient();
  return <Game key={isClient ? "client" : "server"} saved={isClient ? loadSaved() : null} persist={isClient} />;
}
