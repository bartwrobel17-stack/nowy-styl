export const salonHours = {
  1: { open: "09:00", close: "17:00" },
  2: { open: "09:00", close: "17:00" },
  3: { open: "09:00", close: "17:00" },
  4: { open: "09:00", close: "17:00" },
  5: { open: "10:00", close: "17:00" },
  6: { open: "08:00", close: "13:00" },
  0: null,
} as const;

export const bookingServices = [
  { id: "strzyzenie", name: "Strzyżenie", duration: 60, price: "od 70 zł" },
  { id: "koloryzacja", name: "Koloryzacja", duration: 120, price: "od 180 zł" },
  { id: "stylizacja", name: "Stylizacja", duration: 60, price: "od 80 zł" },
  { id: "pielegnacja", name: "Pielęgnacja", duration: 45, price: "od 60 zł" },
] as const;

export function getBookingSlots(date: string, duration: number) {
  const selected = new Date(date + "T12:00:00");
  const hours = salonHours[selected.getDay() as keyof typeof salonHours];
  if (!hours) return [];

  const slots: string[] = [];
  let minutes = Number(hours.open.slice(0, 2)) * 60 + Number(hours.open.slice(3));
  const closing = Number(hours.close.slice(0, 2)) * 60 + Number(hours.close.slice(3));

  while (minutes + duration <= closing) {
    slots.push(
      `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
    );
    minutes += 30;
  }
  return slots;
}
