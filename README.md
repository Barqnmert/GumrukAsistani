# Gümrük Asistanı

Yurt dışından gelen paketi gümrükte takılanlar için üç katmanlı triyaj sistemi:

1. **Karar motoru** — paket bilgisinden vergi/masraf tahmini ve dürüst öneri: DEĞMEZ / KENDİN YAP / MÜŞAVİR TUT
2. **DIY rehberler** — 4 senaryo için adım adım gümrük süreci (AliExpress, Amazon/eBay, hediye, iş numunesi)
3. **Müşavir eşleştirme** — form ile talep toplama, manuel yönlendirme (MVP)

Detaylı ürün brief'i: [docs/brief.md](docs/brief.md)

## Teknoloji

- Vite + React 19 + TypeScript
- Supabase (başvuru kayıtları, RLS insert-only)
- Vercel (deploy) — canlı: https://gumruk-asistani.vercel.app

## Geliştirme

```bash
npm install
cp .env.example .env   # Supabase URL + publishable key gir
npm run dev            # geliştirme sunucusu
npm test               # karar motoru birim testleri
npm run build          # üretim derlemesi (tsc + vite)
```

## Kalibrasyon

Tüm vergi oranları, ardiye tablosu ve karar eşikleri tek dosyada:
[src/lib/rates.ts](src/lib/rates.ts). 2026 Ticaret Bakanlığı tebliği
netleştiğinde yalnızca bu dosya güncellenir; testler formül davranışını korur.

## Veritabanı

Şema: [supabase/migrations/](supabase/migrations/) — `gumruk_basvurulari`
tablosu, RLS açık (anon yalnızca insert; okuma sadece dashboard/service role).
