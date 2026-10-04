"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Loader2, Scissors } from "lucide-react";
import { bookingServices, getBookingSlots } from "@/lib/booking";

export default function BookingWidget() {
  const today = new Date();
  const todayString = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [serviceId, setServiceId] = useState(bookingServices[0].id);
  const [date, setDate] = useState(todayString);
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const service = bookingServices.find((item) => item.id === serviceId)!;
  const slots = useMemo(() => getBookingSlots(date, service.duration), [date, service.duration]);

  async function submit() {
    if (!time || !name.trim() || !phone.trim()) {
      setStatus("error");
      setMessage("Wybierz termin i uzupełnij imię oraz telefon.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, date, time, name, phone, email }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Nie udało się zapisać wizyty.");
      setStatus("success");
      setMessage(data.message);
      setTime("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Wystąpił błąd.");
    }
  }

  return (
    <section id="rezerwacja" className="booking section">
      <div className="section-head">
        <div>
          <div className="section-kicker">06 / REZERWACJA</div>
          <h2>Wybierz termin.<br /><em>My zajmiemy się resztą.</em></h2>
        </div>
        <p>Rezerwacja online jest dostępna 24/7. Wolne godziny są sprawdzane bezpośrednio w bazie salonu.</p>
      </div>

      <div className="booking-card">
        <div className="booking-form">
          <label>Usługa<select value={serviceId} onChange={(e) => { setServiceId(e.target.value as typeof serviceId); setTime(""); }}>{bookingServices.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.price}</option>)}</select></label>
          <label>Data<div className="input-icon"><CalendarDays size={17} /><input type="date" min={todayString} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} /></div></label>

          <div className="booking-label">Wolne godziny <span>{service.duration} min</span></div>
          <div className="slot-grid">
            {slots.map((slot) => <button type="button" className={time === slot ? "slot selected" : "slot"} key={slot} onClick={() => setTime(slot)}><Clock3 size={14} />{slot}</button>)}
          </div>

          <div className="booking-fields">
            <label>Imię i nazwisko<input value={name} onChange={(e) => setName(e.target.value)} placeholder="np. Anna Kowalska" /></label>
            <label>Telefon<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="506 672 949" /></label>
            <label>E-mail <span>(opcjonalnie)</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="anna@email.pl" /></label>
          </div>

          {status === "error" && <div className="booking-message error">{message}</div>}
          {status === "success" && <div className="booking-message success"><Check size={18} />{message}</div>}

          <button className="button button-dark booking-submit" onClick={submit} disabled={status === "loading"}>
            {status === "loading" ? <><Loader2 className="spin" size={17} /> Zapisywanie…</> : <>Potwierdź rezerwację <Scissors size={17} /></>}
          </button>
          <small className="booking-note">Podanie danych jest potrzebne wyłącznie do obsługi wizyty. Na tym etapie nie pobieramy płatności online.</small>
        </div>

        <aside className="booking-summary">
          <div className="booking-icon"><CalendarDays /></div>
          <div><span>Twoja wizyta</span><strong>{service.name}</strong></div>
          <div className="summary-line"><span>Termin</span><b>{date} · {time || "wybierz godzinę"}</b></div>
          <div className="summary-line"><span>Czas</span><b>{service.duration} min</b></div>
          <div className="summary-line"><span>Salon</span><b>Piekary Śląskie</b></div>
        </aside>
      </div>
    </section>
  );
}
