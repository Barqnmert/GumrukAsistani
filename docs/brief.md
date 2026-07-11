# Proje Brief: Gümrükte Paketim Takıldı (çalışma adı)

## 1. Ürün Özeti

**Problem:** 6 Şubat 2026'da yürürlüğe giren yeni gümrük düzenlemesiyle 30€ muafiyeti kalktı. Artık yurt dışından gelen her paket (değeri ne olursa olsun) gümrükte durabiliyor. İnsanlar ne yapacağını bilmiyor: müşavir mi tutsun, kendisi mi halletsin, pakete değer var mı yok mu.

**Çözüm:** Üç katmanlı bir triyaj sistemi:
1. Kullanıcı paket bilgisini girer (değer, menşe, kategori, durum)
2. Sistem dürüst bir öneri verir: DEĞMEZ / KENDİN YAP / MÜŞAVİR TUT
3. Öneriye göre ya adım adım DIY rehber gösterilir, ya da lisanslı müşavire yönlendirilir

**Hedef kitle:** Hem bireyler (AliExpress/eBay/Amazon Global'den alışveriş yapanlar) hem işletmeler (düzenli numune/parça getirenler) — genel, herkese açık.

**Gelir modeli (v2, MVP'de yok):** Müşavir yönlendirmelerinden komisyon. MVP'de ücretsiz, sadece talep ölçümü.

---

## 2. Mimari

### Katman 1 — Karar Motoru (deterministik, AI değil)
Girdi: paket değeri (TL), menşe ülke (AB / AB dışı), kategori (elektronik/tekstil/kozmetik/kitap/genel), durum (yolda/gümrükte bekliyor/bildirim geldi).

Hesaplama sırası:
```
CIF = ürün bedeli + kargo + sigorta
gümrük vergisi = CIF × oran (AB: %0, diğer: güncel maktu oran)
ÖTV = (varsa, kategoriye göre) (CIF + gümrük vergisi) × ÖTV oranı
KDV = (CIF + gümrük vergisi + ÖTV) × %20
ardiye tahmini = sabit referans tablo (gün bazlı)
müşavirlik ücreti tahmini = 2025/2026 Asgari Ücret Tarifesi referans aralığı
TOPLAM MALİYET = gümrük vergisi + ÖTV + KDV + ardiye + (müşavir varsa) müşavirlik ücreti
```

Karar eşiği:
- `TOPLAM_MALİYET / ürün_değeri > 0.7` → **DEĞMEZ** (iade/imha öner)
- `ürün_değeri < X TL` VE ürün kısıtlı/ÖTV'li değilse → **KENDİN YAP** (DIY rehbere yönlendir)
- `ürün_değeri >= X TL` VEYA kategori kısıtlı/karmaşık → **MÜŞAVİR TUT**

(X eşiği ilk sürümde tahmini konur, gerçek kullanıcı geri bildirimiyle kalibre edilir.)

### Katman 2 — DIY Sihirbaz
En sık 3-4 senaryo için (AliExpress ürünü, Amazon Global/eBay, hediye gönderisi, iş numunesi) BİLGE sistemi / TCGB formu için adım adım, ekran görüntülü rehber. Statik içerik, bir kere yazılır.

### Katman 3 — Müşavir Eşleştirme
MVP: otomatik değil. Basit form → Baran'a bildirim → manuel yönlendirme (3-5 lisanslı, TOBB Gümrük Müşavirleri Odası sicilinden doğrulanmış firma). Ücretsiz başlar, talep kanıtlanınca komisyon modeline geçilir.

### Katman 4 — Teknik Altyapı
- **Frontend:** Vite + React + TypeScript
- **Backend/DB:** Supabase (zaten bağlı hesap üzerinden — **yeni bir proje oluşturulacak**, bu proje "Grass" veya "Yesil Pasaportlular" projelerinden bağımsız olmalı çünkü ilgisiz işler)
- **Deploy:** Vercel (GitHub reposundan otomatik deploy)
- **Kur verisi:** TCMB açık API (döviz kuru için)

---

## 3. GitHub Repo Kurulumu (Baran'ın kendi makinesinde yapacağı adımlar)

```bash
# 1. Yeni repo oluştur (GitHub CLI ile, zaten kurulu olmalı)
gh repo create Barqnmert/gumruk-asistani --private --description "Gümrük süreç asistanı - triyaj + DIY rehber + müşavir eşleştirme"

# 2. Local proje klasörü oluştur ve repoyu bağla
mkdir gumruk-asistani && cd gumruk-asistani
git init
git remote add origin https://github.com/Barqnmert/gumruk-asistani.git

# 3. İlk commit için bu brief dosyasını da klasöre koy
# (bu dosyayı /docs/brief.md olarak ekle)

# 4. Claude Code'u bu klasörde başlat
claude
```

> **Not:** Repo adı/kullanıcı adı varsayım olarak `Barqnmert/gumruk-asistani` yazıldı — farklı bir isim istersen brief'i güncelle.

---

## 4. Claude Code Talimatları (bu brief'i okuyunca uygulanacak kurallar)

1. Bu projeyi aşağıdaki **aşamalara (milestone)** böl. Her aşama bittiğinde, kod çalışır ve test edilmiş durumdaysa:
   ```bash
   git add -A
   git commit -m "<aşama adı>: <kısa açıklama>"
   git push origin main
   ```
2. Commit mesajı formatı: `[Aşama N] Ne yapıldı` — örn. `[Aşama 2] Karar motoru hesaplama fonksiyonu eklendi`
3. Her push'tan sonra kullanıcıya (Baran'a) tek satırlık özet ver: ne tamamlandı, sırada ne var.
4. **Asla** `.env` dosyasını veya Supabase anahtarlarını commit etme — `.gitignore`'a en başta ekle.
5. Supabase bağlantısı için `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ortam değişkenlerini kullan, koda hardcode etme.

### Aşamalar (önerilen sıra):
- **Aşama 0:** Proje iskeleti (Vite+React+TS), `.gitignore`, temel klasör yapısı → ilk commit
- **Aşama 1:** Karar motoru modülü (`src/lib/decisionEngine.ts`) + birim testleri
- **Aşama 2:** Form sayfası (paket bilgisi girişi) + sonuç ekranı
- **Aşama 3:** Supabase entegrasyonu (form submission kaydı) + tablo şeması (bkz. Bölüm 5)
- **Aşama 4:** DIY rehber sayfaları (4 senaryo, statik içerik)
- **Aşama 5:** Müşavir yönlendirme formu (manuel bildirim akışı)
- **Aşama 6:** Vercel deploy + domain bağlama (Vercel dashboard üzerinden, GitHub reposu import edilerek)

---

## 5. Supabase Şeması (taslak)

```sql
create table public.gumruk_basvurulari (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  paket_degeri numeric not null,
  mensei_ulke text not null,
  kategori text not null,
  durum text not null,
  hesaplanan_toplam_maliyet numeric,
  oneri text, -- 'DEGMEZ' | 'KENDIN_YAP' | 'MUSAVIR_TUT'
  musavire_yonlendirildi boolean default false,
  iletisim_email text,
  iletisim_telefon text
);

alter table public.gumruk_basvurulari enable row level security;
-- MVP'de herkes kendi kaydını oluşturabilsin, okuma sadece admin (Baran)
create policy "insert_own" on public.gumruk_basvurulari
  for insert with check (true);
```

> Supabase projesi henüz oluşturulmadı — Claude Code, Aşama 3'e gelmeden önce Baran'a "yeni Supabase projesi mi, mevcut mu" diye sorsun.

---

## 6. Açık Sorular / Baran'ın Karar Vermesi Gerekenler
- [ ] GitHub repo adı/kullanıcı adı teyidi
- [ ] Yeni Supabase projesi mi, mevcut projelerden biri mi?
- [ ] Vergi oranı/eşik tablosu için güncel 2026 referans kaynağı (Ticaret Bakanlığı tebliği) elle girilecek
- [ ] Müşavir ortaklığı için ilk 3-5 firma kiminle konuşulacak (TOBB sicilinden)
