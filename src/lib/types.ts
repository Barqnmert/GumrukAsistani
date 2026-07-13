export type Mensei = 'AB' | 'AB_DISI';

export type Kategori =
  | 'genel'
  | 'elektronik'
  | 'telefon'
  | 'tekstil'
  | 'kozmetik'
  | 'kitap';

export type Durum = 'yolda' | 'gumrukte_bekliyor' | 'bildirim_geldi';

export type GonderiTipi = 'bireysel' | 'ticari';

/**
 * MAKTU: posta/hızlı kargo bireysel gönderi rejimi (tek ve maktu vergi,
 * ayrıca KDV alınmaz). STANDART: normal ithalat rejimi (gümrük vergisi +
 * ÖTV + KDV, beyanname gerekir).
 */
export type Rejim = 'MAKTU' | 'STANDART';

export type Oneri = 'DEGMEZ' | 'KENDIN_YAP' | 'MUSAVIR_TUT' | 'GETIRILEMEZ';

export interface PaketGirdisi {
  /** Ürün bedeli (TL) */
  urunBedeli: number;
  /** Kargo ücreti (TL) */
  kargoUcreti: number;
  /** Sigorta bedeli (TL), yoksa 0 */
  sigorta?: number;
  mensei: Mensei;
  kategori: Kategori;
  durum: Durum;
  gonderiTipi: GonderiTipi;
  /** Brüt ağırlık (kg) — 30 kg maktu rejim sınırı kontrolü için */
  agirlikKg?: number;
  /**
   * Bu takvim ayında kaçıncı gönderi — 5'i aşarsa maktu rejim uygulanamaz.
   * Verilmezse limit aşımı yok varsayılır.
   */
  buAyKacinciGonderi?: number;
  /** Paket gümrükteyse kaç gündür beklediği (ardiye tahmini için) */
  gumrukteGecenGun?: number;
  /** EUR/TL kuru — verilmezse varsayılan referans kur kullanılır */
  eurTry?: number;
}

export interface MaliyetDokumu {
  rejim: Rejim;
  cif: number;
  /** CIF'in Euro karşılığı (1500 € sınırı kontrolü için) */
  cifEur: number;
  /** Hesapta kullanılan EUR/TL kuru */
  kur: number;
  /**
   * Kargo ücreti girilmediğinde kıymete eklenen emsal navlun (TL) —
   * mevzuat gereği navlun ayrı gösterilmezse 3 € emsal eklenir.
   */
  emsalNavlun: number;
  /** MAKTU rejim: tek ve maktu vergi (AB %30 / diğer %60) */
  maktuVergi: number;
  /** MAKTU rejim: ÖTV IV sayılı liste eşyasına ilave %20 */
  otvIvEk: number;
  /** STANDART rejim: tarifeye göre gümrük vergisi */
  gumrukVergisi: number;
  /** STANDART rejim: ÖTV */
  otv: number;
  /** STANDART rejim: KDV (maktu rejimde ayrıca alınmaz) */
  kdv: number;
  ardiye: number;
  musavirlikUcreti: { min: number; max: number; orta: number };
  /** Müşavirsiz (kendin yap) toplam ek maliyet */
  toplamKendinYap: number;
  /** Müşavirli toplam ek maliyet (müşavirlik ücreti orta değeriyle) */
  toplamMusavirli: number;
  /** toplamKendinYap / urunBedeli */
  maliyetOrani: number;
  /**
   * DEĞMEZ eşiğiyle kıyaslanan gerçekçi oran: MAKTU rejimde kendin-yap
   * toplamı, STANDART rejimde (müşavir önerildiği için) müşavirli toplam
   * üzerinden hesaplanır.
   */
  kararOrani: number;
}

export interface KararSonucu {
  oneri: Oneri;
  gerekce: string[];
  /** Getirilemeyen eşyada engelin açıklaması */
  engeller: string[];
  dokum: MaliyetDokumu;
}
