// 2026 oranları ve eşikleri — TEK KALİBRASYON NOKTASI.
//
// Doğrulanmış kaynaklar (Temmuz 2026):
// - Karar 10813 (RG 07.01.2026, sayı 33130; yürürlük 06.02.2026): 30 €
//   muafiyeti kaldırıldı — her kıymetteki gönderi vergiye tabi.
// - Ticaret Bakanlığı SSS (posta ve hızlı kargo muafiyeti): tek ve maktu
//   vergi AB %30 / diğer ülkeler %60; ÖTV (IV) sayılı liste eşyasına ilave
//   %20; kişisel kitap/basılı yayın %0; sınırlar: 1500 €, brüt 30 kg,
//   takvim ayında 5 gönderi. Bu rejimde ayrıca KDV alınmaz.
// - Cep telefonu ve kozmetik, bireysel posta/hızlı kargo ile GETİRİLEMEZ.
// - 2026 Gümrük Müşavirliği Asgari Ücret Tarifesi (RG 30.12.2025, sayı
//   33123): İTH-1 ithalat beyannamesi kara 3.390 / hava 3.320 TL,
//   İTH-12 bedelsiz giriş 3.410 TL, DAN-1 sözlü danışma 2.670 TL/saat.

import type { Kategori, Mensei } from './types';

/* ── MAKTU REJİM (posta/hızlı kargo, bireysel, ticari nitelik taşımayan) ── */

/** Tek ve maktu vergi oranı (kıymet üzerinden), menşeye göre */
export const MAKTU_VERGI_ORANI: Record<Mensei, number> = {
  AB: 0.3,
  AB_DISI: 0.6,
};

/** ÖTV (IV) sayılı liste eşyasına maktu vergiye İLAVE oran */
export const OTV_IV_EK_ORANI = 0.2;

/** ÖTV (IV) sayılı listeye giren kategorilerimiz */
export const OTV_IV_KATEGORILER: ReadonlySet<Kategori> = new Set([
  'elektronik',
  'telefon',
  'kozmetik',
]);

/** Kişisel kitap/basılı yayında maktu vergi %0 */
export const MAKTU_VERGISIZ_KATEGORILER: ReadonlySet<Kategori> = new Set([
  'kitap',
]);

/** Maktu rejim sınırları */
export const MAKTU_KIYMET_LIMITI_EUR = 1500;
export const MAKTU_AGIRLIK_LIMITI_KG = 30;
export const AYLIK_GONDERI_LIMITI = 5;

/**
 * Navlun (kargo) faturada ayrı gösterilmiyorsa kıymete eklenen emsal
 * navlun (€) — Ticaret Bakanlığı posta/hızlı kargo SSS.
 */
export const EMSAL_NAVLUN_EUR = 3;

/**
 * Bireysel posta/hızlı kargo ile getirilmesi YASAK kategoriler ve gerekçeleri.
 * (Vergisi ödenmek istense dahi gümrükten çekilemez; iade/ticari ithalat gerekir.)
 */
export const BIREYSEL_YASAKLI: ReadonlyMap<Kategori, string> = new Map([
  [
    'telefon',
    'Cep telefonu posta veya hızlı kargo yoluyla getirilemez (vergisi ödenmek istense dahi). Yolcu beraberinde getirip IMEI kaydı yaptırmak tek bireysel yoldur.',
  ],
  [
    'kozmetik',
    'Kozmetik ürünlerin bireysel posta/hızlı kargo ile getirilmesi mümkün değildir (TİTCK iznine tabi). Ancak firma adına ticari ithalatla getirilebilir.',
  ],
]);

/* ── STANDART REJİM (ticari gönderi veya maktu sınırlarını aşan eşya) ── */

/**
 * Referans gümrük vergisi oranları (CIF üzerinden). Gerçek oran GTİP'e göre
 * belirlenir (İGV/EMY dahil ciddi sapabilir) — bunlar kaba tahmindir.
 * AB menşeli eşya ATR belgesiyle %0.
 */
export const STANDART_GUMRUK_VERGISI: Record<
  Kategori,
  Record<Mensei, number>
> = {
  genel: { AB: 0, AB_DISI: 0.1 },
  elektronik: { AB: 0, AB_DISI: 0.05 },
  telefon: { AB: 0, AB_DISI: 0.05 },
  tekstil: { AB: 0, AB_DISI: 0.2 }, // İGV/EMY nedeniyle yüksek
  kozmetik: { AB: 0, AB_DISI: 0.1 },
  kitap: { AB: 0, AB_DISI: 0 },
};

/** Standart rejimde ÖTV oranı ((CIF + gümrük vergisi) üzerinden) */
export const STANDART_OTV_ORANI: Record<Kategori, number> = {
  genel: 0,
  elektronik: 0.2,
  telefon: 0.25,
  tekstil: 0,
  kozmetik: 0.2,
  kitap: 0,
};

/** KDV oranı ((CIF + gümrük vergisi + ÖTV) üzerinden); basılı kitap istisnalı */
export const KDV_ORANI: Record<Kategori, number> = {
  genel: 0.2,
  elektronik: 0.2,
  telefon: 0.2,
  tekstil: 0.2,
  kozmetik: 0.2,
  kitap: 0,
};

/* ── ORTAK ── */

/**
 * Varsayılan EUR/TL ve USD/TL referans kurları — canlı kur alınamadığında
 * kullanılır. src/lib/kur.ts canlı kurları Frankfurter (ECB) API'sinden çeker.
 */
export const VARSAYILAN_EUR_TRY = 54;
export const VARSAYILAN_USD_TRY = 46;

/** Ardiye referans tablosu: gün aralığına göre günlük ücret (TL).
 * Operatöre göre değişir (PTT/hızlı kargo) — kaba referanstır. */
export const ARDIYE_TABLOSU: ReadonlyArray<{
  gunBasi: number; // bu günden itibaren (dahil)
  gunlukUcret: number;
}> = [
  { gunBasi: 1, gunlukUcret: 0 }, // ilk günler genellikle ücretsiz
  { gunBasi: 4, gunlukUcret: 150 },
  { gunBasi: 11, gunlukUcret: 300 },
];

/** Paket gümrükte bekliyorsa ve gün bilinmiyorsa varsayılan bekleme günü */
export const VARSAYILAN_BEKLEME_GUNU = 5;

/**
 * Gümrük müşavirliği ücret aralığı (TL, KDV hariç) — 2026 Asgari Ücret
 * Tarifesi referansı: beyanname (İTH-1/İTH-12) ~3.300-3.400 TL taban;
 * ek belge, izin ve danışmayla tipik toplam üst bant ~8.000 TL.
 */
export const MUSAVIRLIK_UCRETI = {
  min: 3400,
  max: 8100,
};

/** DEĞMEZ eşiği: toplam ek maliyet / ürün bedeli bu oranı aşarsa iade öner */
export const DEGMEZ_ORAN_ESIGI = 0.7;
