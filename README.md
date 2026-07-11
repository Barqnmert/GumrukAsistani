# Gümrükte Kalmasın (gümrüktekalmasın.com)

Yurt dışından gelen paketi gümrükte takılanlar için üç katmanlı triyaj sistemi:

1. **Karar motoru** — iki rejimli deterministik hesap: bireysel gönderilerde tek ve maktu vergi (AB %30 / diğer %60, ÖTV IV +%20, kitap %0, KDV'siz); ticari veya 1500 € / 30 kg üstünde standart rejim (GV+ÖTV+KDV). Öneri: DEĞMEZ / KENDİN YAP / MÜŞAVİR TUT / GETİRİLEMEZ (telefon-kozmetik bireysel yasağı)
2. **DIY rehberler** — 4 senaryo için adım adım gümrük süreci (AliExpress, Amazon/eBay, hediye, iş numunesi)
3. **Müşavir eşleştirme** — form ile talep toplama + e-posta bildirimi (edge function), manuel yönlendirme (MVP)

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

Tüm vergi oranları, limitler ve karar eşikleri tek dosyada:
[src/lib/rates.ts](src/lib/rates.ts) — dosya başındaki yorumda doğrulanmış
kaynaklar (Karar 10813, Ticaret Bakanlığı SSS, 2026 Müşavirlik Asgari Ücret
Tarifesi) listelidir. Mevzuat değişirse yalnızca bu dosya güncellenir;
28 birim testi formül davranışını korur. EUR/TL kuru çalışma anında
Frankfurter (ECB) API'sinden çekilir, ulaşılamazsa referans kur kullanılır.

## Veritabanı

Şema: [supabase/migrations/](supabase/migrations/) — `gumruk_basvurulari`
tablosu, RLS açık (anon yalnızca insert; okuma sadece dashboard/service role).
