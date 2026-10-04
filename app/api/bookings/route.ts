import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { bookingServices, salonHours } from "@/lib/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function warsawDate(date: string, time: string) {
  const probe = new Date(`${date}T${time}:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(probe);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const utcGuess = Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day")), Number(get("hour")), Number(get("minute")));
  const offset = utcGuess - probe.getTime();
  return new Date(probe.getTime() - offset);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, date, time, name, phone, email } = body;

    const service = bookingServices.find((item) => item.id === serviceId);
    if (!service || typeof date !== "string" || typeof time !== "string" || typeof name !== "string" || typeof phone !== "string") {
      return NextResponse.json({ error: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
    }

    const selected = new Date(date + "T12:00:00");
    if (Number.isNaN(selected.getTime())) return NextResponse.json({ error: "Nieprawidłowa data." }, { status: 400 });

    const hours = salonHours[selected.getDay() as keyof typeof salonHours];
    if (!hours) return NextResponse.json({ error: "Salon jest tego dnia zamknięty." }, { status: 400 });

    const start = warsawDate(date, time);
    const open = warsawDate(date, hours.open);
    const close = warsawDate(date, hours.close);
    if (Number.isNaN(start.getTime())) return NextResponse.json({ error: "Nieprawidłowa godzina." }, { status: 400 });

    const end = new Date(start.getTime() + service.duration * 60_000);
    if (start < open || end > close) return NextResponse.json({ error: "Wybrana godzina jest poza godzinami pracy." }, { status: 400 });

    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: "System rezerwacji nie jest jeszcze podłączony do bazy. Dodaj dane Supabase w Vercel." }, { status: 503 });

    const { error } = await supabase.from("appointments").insert({
      service_id: service.id,
      service_name: service.name,
      customer_name: name.trim().slice(0, 100),
      customer_phone: phone.trim().slice(0, 30),
      customer_email: typeof email === "string" ? email.trim().slice(0, 160) || null : null,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      status: "pending",
    });

    if (error) {
      if (error.code === "23P01") return NextResponse.json({ error: "Ten termin właśnie został zajęty. Wybierz inną godzinę." }, { status: 409 });
      return NextResponse.json({ error: "Nie udało się zapisać wizyty. Spróbuj ponownie." }, { status: 500 });
    }

    return NextResponse.json({ message: "Rezerwacja została wysłana. Salon potwierdzi ją telefonicznie." });
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }
}
