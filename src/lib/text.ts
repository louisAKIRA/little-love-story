import { recipientName } from "@/config/messages";

// แทน {name} ในข้อความด้วยชื่อผู้รับ ถ้าไม่ได้ตั้งชื่อไว้จะใช้คำว่า "เธอ"
export const displayName = recipientName.trim() || "เธอ";

export function withName(text: string): string {
  return text.replaceAll("{name}", displayName);
}
