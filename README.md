# Nowy Styl

Strona premium dla Salonu Fryzjerskiego „Nowy Styl” Sylwia Wesołowska.

## Stack
Next.js 15 + React 19 + TypeScript + CSS. Projekt jest przygotowany pod Vercel.

## Panel właściciela
Wersja startowa działa demonstracyjnie bez backendu. Logowanie:
- login: `admin`
- hasło: `NowyStyl2026!`

Galeria zapisuje się w `localStorage` przeglądarki. Warstwa danych jest wydzielona w `lib/gallery-store.ts`, dzięki czemu można później podmienić storage na Supabase/API bez przebudowy UI.

**Ważne:** demo-login nie jest mechanizmem bezpieczeństwa produkcyjnego. Przed użyciem komercyjnym należy zastąpić go prawdziwym uwierzytelnianiem i trwałym storage.

## Uruchomienie
```bash
npm install
npm run dev
npm run build
```

## SEO
Są przygotowane metadata, `sitemap.xml` i `robots.txt`.
