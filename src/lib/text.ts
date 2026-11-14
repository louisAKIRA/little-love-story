import { recipientName } from "@/config/messages";

// แทน {name} ด้วยชื่อผู้รับ (ถ้าไม่ได้ตั้งชื่อไว้จะใช้คำว่า "เธอ")
// และแทน {pet} ด้วยชื่อน้องหมาแมว (ถ้าไม่ได้ส่งชื่อมาจะใช้คำว่า "น้อง")
export const displayName = recipientName.trim() || "เธอ";

export function withName(text: string, petName?: string): string {
  return text.replaceAll("{name}", displayName).replaceAll("{pet}", petName?.trim() || "น้อง");
}
