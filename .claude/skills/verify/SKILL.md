---
name: verify
description: gümrüktekalmasın.com değişikliklerini gerçek tarayıcıda uçtan uca doğrulama tarifi
---

# Doğrulama tarifi

Vite + React SPA; birim testleri sadece karar motorunu kapsar. Arayüz akışları
gerçek tarayıcıda sürülerek doğrulanır.

## Kurulum ve çalıştırma

1. `npm run build` sonra `npm run preview` (arka planda, http://localhost:4173,
   SPA fallback var — derin linkler çalışır).
2. Tarayıcı: sistemde Playwright/Chromium yok; scratchpad'e `npm i puppeteer-core`
   kurup sistem Edge'i ile sür:
   `executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'`,
   `headless: 'new'`.

## Kritik noktalar

- **Supabase isteklerini kes**: form gönderimi `gumruk_basvurulari` prod tablosuna
  yazar. `page.setRequestInterception(true)` + URL'si `supabase` içeren istekleri
  `abort()` et; test hesaplamaları prod istatistiği kirletmesin.
- Kur canlı Frankfurter'den gelir (EUR bazlı); sonuç tutarları kura bağlı olduğundan
  asserler TL yerine €/oran/metin üzerinden yazılmalı.
- Sonuç sayfası hem `location.state` hem URL query'den kurulur; yenileme senaryosunu
  `page.reload()` ile test et.

## Sürülmeye değer akışlar

- /hesapla: ticari elektronik → DEĞMEZ (müşavirli oran), bireysel 6. gönderi →
  STANDART, kargo boş → emsal navlun satırı, EUR/USD seçimi → TL önizleme,
  telefon/kozmetik → erken uyarı.
- /sonuc: geçersiz/negatif query paramları → /hesapla yönlendirmesi.
- /musavir: bayrak kapalıyken "çok yakında" ekranı (src/lib/flags.ts).
- /gizlilik + footer linki; `/og.png` 200 ve `og:image` meta.
