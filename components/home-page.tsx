"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Scissors,
  Sparkles,
  Star,
  X
} from "lucide-react";
import OwnerPanel from "./owner-panel";
import { defaultGallery, type GalleryItem } from "@/lib/gallery-store";

const hours = [
  ["Poniedziałek", "09:00–17:00"],
  ["Wtorek", "09:00–17:00"],
  ["Środa", "09:00–17:00"],
  ["Czwartek", "09:00–17:00"],
  ["Piątek", "10:00–17:00"],
  ["Sobota", "08:00–13:00"],
  ["Niedziela", "Zamknięte"]
];

const services = [
  { number: "01", title: "Strzyżenie", text: "Precyzyjne cięcie dopasowane do Twojego stylu, włosów i codziennego rytmu." },
  { number: "02", title: "Koloryzacja", text: "Świeży kolor, odświeżenie tonu lub subtelna zmiana. Zawsze z konsultacją." },
  { number: "03", title: "Stylizacja", text: "Wykończenie na co dzień i na ważne okazje. Efekt, który wygląda naturalnie." },
  { number: "04", title: "Pielęgnacja", text: "Dobór pielęgnacji i zabiegów, które pomagają utrzymać włosy w dobrej formie." }
];

const reviews = [
  ["Roksana", "Pani Sylwia potrafi doradzić i fachowo podejść do klienta. Zawsze wychodzę zadowolona z salonu. Salon czysty i ładnie urządzony."],
  ["Roman J", "Szczerze mogę polecić ten Salon, miła i fachowa obsługa, ceny przystępne. Korzystam już od wielu lat."],
  ["Janusz Wójcik", "Wszystko jest tak jak ma być. Jeśli uda się wam umówić na termin to polecam."]
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);
  const [active, setActive] = useState<number | null>(null);

  const refreshGallery = () => {
    try {
      const raw = localStorage.getItem("nowy-styl-gallery");
      setGallery(raw ? JSON.parse(raw) : defaultGallery);
    } catch {
      setGallery(defaultGallery);
    }
  };

  const openGallery = (index: number) => setActive(index);
  const next = () => active !== null && setActive((active + 1) % gallery.length);
  const prev = () => active !== null && setActive((active - 1 + gallery.length) % gallery.length);

  return (
    <main>
      <header className="site-header">
        <a href="#start" className="brand" aria-label="Nowy Styl, strona główna">
          <span className="brand-mark">NS</span>
          <span><strong>NOWY STYL</strong><small>SYLWIA WESOŁOWSKA</small></span>
        </a>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          {["O salonie", "Usługi", "Galeria", "Opinie", "Kontakt"].map((item) => (
            <a key={item} href={"#" + item.toLowerCase().replace(" ", "-")} onClick={() => setMenuOpen(false)}>{item}</a>
          ))}
          <a className="nav-phone" href="tel:+48506672949"><Phone size={16} /> 506 672 949</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Otwórz menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section id="start" className="hero">
        <div className="hero-orbit" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> SALON FRYZJERSKI · PIEKARY ŚLĄSKIE</p>
          <h1>Twój styl.<br /><em>Nowa energia.</em></h1>
          <p className="hero-lead">Kameralny salon, w którym dobry fryz nie jest przypadkiem. Doradzamy, słuchamy i tworzymy styl, w którym naprawdę dobrze się czujesz.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="tel:+48506672949">Umów wizytę <ArrowRight size={18} /></a>
            <a className="text-link" href="#galeria">Zobacz galerię <ArrowDownRight size={17} /></a>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-image">
            <img src={defaultGallery[0].src} alt="Salon Nowy Styl" />
          </div>
          <div className="hero-badge"><Sparkles size={18} /><span>4,9 / 5<br /><small>14 opinii</small></span></div>
        </div>
        <div className="hero-note">01 <span>STYL, KTÓRY PASUJE DO CIEBIE</span></div>
      </section>

      <section id="o-salonie" className="intro section">
        <div className="section-kicker">01 / O SALONIE</div>
        <div className="intro-grid">
          <div>
            <h2>Mały salon.<br /><em>Duża dbałość.</em></h2>
          </div>
          <div>
            <p className="big-copy">Nowy Styl to miejsce stworzone przez Sylwię Wesołowską. Bez pośpiechu, bez przypadkowych rozwiązań. Jest czas na konsultację, dobór koloru i dopracowanie każdego detalu.</p>
            <div className="stats"><div><strong>14</strong><span>opinii klientów</span></div><div><strong>4,9</strong><span>średnia ocen</span></div><div><strong>7</strong><span>dni w tygodniu</span></div></div>
          </div>
        </div>
      </section>

      <section id="usługi" className="services section">
        <div className="section-head"><div><div className="section-kicker">02 / USŁUGI</div><h2>Włosy, które <em>mają sens.</em></h2></div><p>Od pierwszej konsultacji po ostatnie spojrzenie w lustro. Zakres usług dopasowujemy do Ciebie.</p></div>
        <div className="service-grid">{services.map((s) => <article className="service-card" key={s.number}><span>{s.number}</span><Scissors size={23} /><h3>{s.title}</h3><p>{s.text}</p><ArrowUpRight /></article>)}</div>
      </section>

      <section id="galeria" className="gallery-section section">
        <div className="section-head"><div><div className="section-kicker">03 / GALERIA</div><h2>Zajrzyj <em>do środka.</em></h2></div><p>Zdjęcia salonu i efektów pracy. Kliknij, aby zobaczyć pełny kadr.</p></div>
        <div className="gallery-grid">{gallery.map((item, i) => <button className={"gallery-item gallery-" + i} key={item.id} onClick={() => openGallery(i)}><img src={item.src} alt={item.alt} /><span>0{i + 1}</span></button>)}</div>
      </section>

      <section id="opinie" className="reviews section">
        <div className="review-intro"><div className="section-kicker">04 / OPINIE</div><h2>Klientki i klienci<br /><em>mówią za nas.</em></h2><div className="rating"><strong>4,9</strong><span><b>★★★★★</b><small>14 opinii w Google</small></span></div></div>
        <div className="review-list">{reviews.map(([name, text], i) => <article className="review" key={name}><div className="quote">“</div><p>{text}</p><footer><strong>{name}</strong><span><Star size={12} fill="currentColor" /> Opinia Google</span></footer></article>)}</div>
      </section>

      <section id="kontakt" className="contact section">
        <div className="contact-panel">
          <div><div className="section-kicker">05 / KONTAKT</div><h2>Wpadnij do<br /><em>Nowego Stylu.</em></h2><p>I Armii Wojska Polskiego 1<br />41-949 Piekary Śląskie</p><a className="button button-light" href="https://www.google.com/maps/dir/?api=1&destination=I%20Armii%20Wojska%20Polskiego%201%2C%2041-949%20Piekary%20%C5%9Al%C4%85skie" target="_blank" rel="noreferrer">Wyznacz trasę <MapPin size={17} /></a></div>
          <div className="contact-details"><a href="tel:+48506672949"><Phone /> 506 672 949</a><div className="hours"><h3>Godziny otwarcia</h3>{hours.map(([day, time]) => <div key={day}><span>{day}</span><b>{time}</b></div>)}</div></div>
        </div>
        <div className="map-wrap"><iframe title="Mapa dojazdu do salonu Nowy Styl" src="https://www.google.com/maps?q=I%20Armii%20Wojska%20Polskiego%201%2C%2041-949%20Piekary%20%C5%9Al%C4%85skie&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
      </section>

      <footer className="footer">
        <div className="footer-brand"><span className="brand-mark">NS</span><div><strong>NOWY STYL</strong><small>SYLWIA WESOŁOWSKA</small></div></div>
        <div className="footer-links"><a href="tel:+48506672949"><Phone size={15} /> 506 672 949</a><a href="#start">Do góry ↑</a><button onClick={() => { refreshGallery(); setOwnerOpen(true); }}>Panel właściciela</button></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Nowy Styl. Wszelkie prawa zastrzeżone.</span><span>Piekary Śląskie · 41-949</span></div>
      </footer>

      {active !== null && gallery[active] && <div className="lightbox" role="dialog" aria-modal="true">
        <button className="lightbox-close" onClick={() => setActive(null)} aria-label="Zamknij"><X /></button>
        <button className="lightbox-prev" onClick={prev} aria-label="Poprzednie"><ChevronLeft /></button>
        <div className="lightbox-image"><img src={gallery[active].src} alt={gallery[active].alt} /></div>
        <button className="lightbox-next" onClick={next} aria-label="Następne"><ChevronRight /></button>
        <div className="lightbox-counter">{active + 1} / {gallery.length}</div>
      </div>}

      {ownerOpen && <OwnerPanel onClose={() => { setOwnerOpen(false); refreshGallery(); }} />}
    </main>
  );
}