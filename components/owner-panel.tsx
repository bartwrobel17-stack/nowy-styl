"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { ImagePlus, LogIn, Trash2, X } from "lucide-react";
import { defaultGallery, type GalleryItem } from "@/lib/gallery-store";

const DEMO_USER = "demo";
const DEMO_PASSWORD = "demo";

export default function OwnerPanel({ onClose }: { onClose: () => void }) {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultGallery);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nowy-styl-gallery");
      if (stored) setGallery(JSON.parse(stored));
    } catch {
      setGallery(defaultGallery);
    }
  }, []);

  const persist = (items: GalleryItem[]) => {
    setGallery(items);
    localStorage.setItem("nowy-styl-gallery", JSON.stringify(items));
  };

  const login = () => {
    if (user === DEMO_USER && password === DEMO_PASSWORD) { setLogged(true); setError(""); }
    else setError("Nieprawidłowy login lub hasło.");
  };

  const addImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const item: GalleryItem = { id: crypto.randomUUID(), src: String(reader.result), alt: "Zdjęcie salonu Nowy Styl" };
        persist([...gallery, item]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  };

  return <div className="owner-overlay">
    <div className="owner-modal">
      <button className="modal-close" onClick={onClose} aria-label="Zamknij"><X /></button>
      {!logged ? <div className="login-view"><div className="owner-logo">NS</div><div className="section-kicker">STREFA WŁAŚCICIELA</div><h2>Zarządzaj <em>galerią.</em></h2><p>Dodawaj i usuwaj zdjęcia bez edytowania kodu strony.</p><div className="demo-credentials"><strong>Wersja demonstracyjna</strong><span>Login: <b>demo</b></span><span>Hasło: <b>demo</b></span></div><label>Login<input value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" /></label><label>Hasło<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && login()} /></label>{error && <div className="login-error">{error}</div>}<button className="button button-dark full" onClick={login}><LogIn size={17} /> Zaloguj się</button><small className="demo-note">To jest wersja demonstracyjna. Dane galerii są zapisywane lokalnie w tej przeglądarce. W wersji produkcyjnej można podłączyć Supabase lub własne API.</small></div>
      : <div className="dashboard"><div className="dashboard-top"><div><div className="section-kicker">PANEL WŁAŚCICIELA</div><h2>Galeria <em>salonu.</em></h2></div><label className="upload button button-dark"><ImagePlus size={17} /> Dodaj zdjęcia<input type="file" accept="image/*" multiple onChange={addImage} /></label></div><p className="dashboard-copy">Zdjęcia poniżej są aktualnie widoczne w galerii publicznej na tym urządzeniu.</p><div className="admin-grid">{gallery.map((item) => <div className="admin-image" key={item.id}><img src={item.src} alt={item.alt} /><button onClick={() => persist(gallery.filter((x) => x.id !== item.id))} aria-label="Usuń zdjęcie"><Trash2 size={16} /></button></div>)}</div>{gallery.length === 0 && <div className="empty-state">Galeria jest pusta. Dodaj pierwsze zdjęcie.</div>}<div className="storage-note">Architektura galerii jest przygotowana pod trwały storage. Zamiana warstwy localStorage na Supabase Storage + bazę danych nie wymaga przebudowy sekcji publicznej.</div></div>}
    </div>
  </div>;
}