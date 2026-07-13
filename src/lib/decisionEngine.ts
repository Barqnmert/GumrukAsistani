// Katman 1 — Karar Motoru (deterministik, AI değil)
//
// İki rejim vardır (rates.ts başındaki kaynak notlarına bakın):
//
// MAKTU (bireysel posta/hızlı kargo; kıymet ≤ 1500 €, brüt ≤ 30 kg):
//   vergi = CIF × (AB %30 | diğer %60), kitapta %0
//   + ÖTV (IV) listesi eşyasına ilave CIF × %20
//   Bu rejimde ayrıca KDV alınmaz.
//
// STANDART (ticari gönderi veya maktu sınırlarını aşan eşya):
//   gümrük vergisi = CIF × tarife oranı (AB menşeli ATR ile %0)
//   ÖTV = (CIF + gümrük vergisi) × oran
//   KDV = (CIF + gümrük vergisi + ÖTV) × oran
//
// Her iki rejimde de ardiye tahmini eklenir.

import {
  ARDIYE_TABLOSU,
  AYLIK_GONDERI_LIMITI,
  BIREYSEL_YASAKLI,
  DEGMEZ_ORAN_ESIGI,
  EMSAL_NAVLUN_EUR,
  KDV_ORANI,
  MAKTU_AGIRLIK_LIMITI_KG,
  MAKTU_KIYMET_LIMITI_EUR,
  MAKTU_VERGISIZ_KATEGORILER,
  MAKTU_VERGI_ORANI,
  MUSAVIRLIK_UCRETI,
  OTV_IV_EK_ORANI,
  OTV_IV_KATEGORILER,
  STANDART_GUMRUK_VERGISI,
  STANDART_OTV_ORANI,
  VARSAYILAN_BEKLEME_GUNU,
  VARSAYILAN_EUR_TRY,
} from './rates';
import type {
  KararSonucu,
  MaliyetDokumu,
  PaketGirdisi,
  Rejim,
} from './types';

function yuvarla(tutar: number): number {
  return Math.round(tutar * 100) / 100;
}

/** Gün sayısına göre ardiye tahmini (TL) */
export function hesaplaArdiye(gun: number): number {
  if (gun <= 0) return 0;
  let toplam = 0;
  for (let g = 1; g <= gun; g++) {
    let gunluk = 0;
    for (const dilim of ARDIYE_TABLOSU) {
      if (g >= dilim.gunBasi) gunluk = dilim.gunlukUcret;
    }
    toplam += gunluk;
  }
  return toplam;
}

function beklemeGunu(girdi: PaketGirdisi): number {
  if (girdi.durum === 'yolda') return 0;
  return girdi.gumrukteGecenGun ?? VARSAYILAN_BEKLEME_GUNU;
}

/** Gönderinin tabi olduğu rejimi belirler */
export function rejimBelirle(girdi: PaketGirdisi, cifEur: number): Rejim {
  if (girdi.gonderiTipi === 'ticari') return 'STANDART';
  if ((girdi.buAyKacinciGonderi ?? 0) > AYLIK_GONDERI_LIMITI) return 'STANDART';
  if (cifEur > MAKTU_KIYMET_LIMITI_EUR) return 'STANDART';
  if ((girdi.agirlikKg ?? 0) > MAKTU_AGIRLIK_LIMITI_KG) return 'STANDART';
  return 'MAKTU';
}

/** Bireysel gönderide getirilmesi yasak eşya kontrolü */
export function engelKontrol(girdi: PaketGirdisi): string[] {
  if (girdi.gonderiTipi !== 'bireysel') return [];
  const engel = BIREYSEL_YASAKLI.get(girdi.kategori);
  return engel ? [engel] : [];
}

export function hesaplaMaliyet(girdi: PaketGirdisi): MaliyetDokumu {
  if (!(girdi.urunBedeli > 0)) {
    throw new Error("Ürün bedeli 0'dan büyük olmalı");
  }
  if (girdi.kargoUcreti < 0 || (girdi.sigorta ?? 0) < 0) {
    throw new Error('Kargo ve sigorta negatif olamaz');
  }

  const kur = girdi.eurTry && girdi.eurTry > 0 ? girdi.eurTry : VARSAYILAN_EUR_TRY;
  // Navlun faturada ayrı gösterilmiyorsa (kargo girilmemişse) kıymete
  // 3 € emsal navlun eklenir — yalnızca bireysel gönderide.
  const emsalNavlun =
    girdi.gonderiTipi === 'bireysel' && girdi.kargoUcreti === 0
      ? EMSAL_NAVLUN_EUR * kur
      : 0;
  const cif =
    girdi.urunBedeli + girdi.kargoUcreti + (girdi.sigorta ?? 0) + emsalNavlun;
  const cifEur = cif / kur;
  const rejim = rejimBelirle(girdi, cifEur);

  let maktuVergi = 0;
  let otvIvEk = 0;
  let gumrukVergisi = 0;
  let otv = 0;
  let kdv = 0;

  if (rejim === 'MAKTU') {
    const oran = MAKTU_VERGISIZ_KATEGORILER.has(girdi.kategori)
      ? 0
      : MAKTU_VERGI_ORANI[girdi.mensei];
    maktuVergi = cif * oran;
    if (OTV_IV_KATEGORILER.has(girdi.kategori)) {
      otvIvEk = cif * OTV_IV_EK_ORANI;
    }
  } else {
    gumrukVergisi = cif * STANDART_GUMRUK_VERGISI[girdi.kategori][girdi.mensei];
    otv = (cif + gumrukVergisi) * STANDART_OTV_ORANI[girdi.kategori];
    kdv = (cif + gumrukVergisi + otv) * KDV_ORANI[girdi.kategori];
  }

  const ardiye = hesaplaArdiye(beklemeGunu(girdi));
  const musavirlikOrta = (MUSAVIRLIK_UCRETI.min + MUSAVIRLIK_UCRETI.max) / 2;
  const toplamKendinYap =
    maktuVergi + otvIvEk + gumrukVergisi + otv + kdv + ardiye;
  const toplamMusavirli = toplamKendinYap + musavirlikOrta;
  // DEĞMEZ eşiğiyle kıyaslanan gerçekçi oran: standart rejimde öneri
  // müşavir olduğu için müşavirli toplam esas alınır.
  const kararToplami = rejim === 'MAKTU' ? toplamKendinYap : toplamMusavirli;

  return {
    rejim,
    cif: yuvarla(cif),
    cifEur: yuvarla(cifEur),
    kur: yuvarla(kur),
    emsalNavlun: yuvarla(emsalNavlun),
    maktuVergi: yuvarla(maktuVergi),
    otvIvEk: yuvarla(otvIvEk),
    gumrukVergisi: yuvarla(gumrukVergisi),
    otv: yuvarla(otv),
    kdv: yuvarla(kdv),
    ardiye: yuvarla(ardiye),
    musavirlikUcreti: {
      min: MUSAVIRLIK_UCRETI.min,
      max: MUSAVIRLIK_UCRETI.max,
      orta: musavirlikOrta,
    },
    toplamKendinYap: yuvarla(toplamKendinYap),
    toplamMusavirli: yuvarla(toplamMusavirli),
    maliyetOrani: yuvarla(toplamKendinYap / girdi.urunBedeli),
    kararOrani: yuvarla(kararToplami / girdi.urunBedeli),
  };
}

export function kararVer(girdi: PaketGirdisi): KararSonucu {
  const dokum = hesaplaMaliyet(girdi);
  const engeller = engelKontrol(girdi);
  const gerekce: string[] = [];

  // 0) Bireysel gönderiyle getirilmesi yasak eşya: vergi hesabı anlamsız
  if (engeller.length > 0) {
    gerekce.push(
      'Bu eşya bireysel posta/hızlı kargo gönderisiyle Türkiye\'ye getirilemiyor.',
      'Göndericiden iade talep etmek en az kayıplı seçenek.',
      'İşletme adına ticari ithalat mümkün olabilir — bunun için müşavir desteği gerekir.',
    );
    return { oneri: 'GETIRILEMEZ', gerekce, engeller, dokum };
  }

  // 1) Gerçekçi toplam (standart rejimde müşavir dahil) eşiği aşıyorsa: DEĞMEZ
  if (dokum.kararOrani > DEGMEZ_ORAN_ESIGI) {
    gerekce.push(
      dokum.rejim === 'MAKTU'
        ? `Vergiler ve masraflar ürün bedelinin %${Math.round(dokum.kararOrani * 100)}'i kadar — eşik %${Math.round(DEGMEZ_ORAN_ESIGI * 100)}.`
        : `Vergiler, masraflar ve müşavirlik ücreti (bu gönderi standart beyanname istediği için) ürün bedelinin %${Math.round(dokum.kararOrani * 100)}'i kadar — eşik %${Math.round(DEGMEZ_ORAN_ESIGI * 100)}.`,
      'Kabul etmeyip göndericiye iade veya gümrükte terk seçeneğini değerlendirin.',
    );
    return { oneri: 'DEGMEZ', gerekce, engeller, dokum };
  }

  // 2) Maktu rejim: operatör (PTT/hızlı kargo) beyanı zaten senin adına yapar
  if (dokum.rejim === 'MAKTU') {
    gerekce.push(
      `Gönderi tek ve maktu vergi kapsamında (kıymet ${MAKTU_KIYMET_LIMITI_EUR} € ve ${MAKTU_AGIRLIK_LIMITI_KG} kg sınırının altında).`,
      'Beyanı taşıyıcı firma (PTT/hızlı kargo operatörü) senin adına düzenler; sana düşen vergiyi online ödemek.',
      'Bu süreç için müşavire genellikle gerek yoktur.',
    );
    return { oneri: 'KENDIN_YAP', gerekce, engeller, dokum };
  }

  // 3) Standart rejim: beyanname, GTİP tespiti, izinler — müşavir önerilir
  if (girdi.gonderiTipi === 'ticari') {
    gerekce.push('Ticari nitelikli gönderiler maktu vergi kapsamına girmez; standart ithalat beyannamesi (TCGB) gerekir.');
  } else if ((girdi.buAyKacinciGonderi ?? 0) > AYLIK_GONDERI_LIMITI) {
    gerekce.push(
      `Takvim ayındaki ${AYLIK_GONDERI_LIMITI} gönderi sınırı aşıldığı için maktu vergi uygulanamaz — standart ithalat beyannamesi gerekir.`,
    );
  } else {
    gerekce.push(
      `Kıymet/ağırlık maktu rejim sınırını aşıyor (${MAKTU_KIYMET_LIMITI_EUR} € / ${MAKTU_AGIRLIK_LIMITI_KG} kg) — standart ithalat beyannamesi gerekir.`,
    );
  }
  gerekce.push(
    'GTİP tespiti, vergi hesabı ve olası izinler (TSE, TİTCK vb.) hata kaldırmaz; lisanslı bir gümrük müşaviriyle ilerlemeni öneriyoruz.',
    'Düzenli ithalat yapacaksan ilk beyanı müşavirle yapıp süreci öğrenmek yaygın stratejidir (iş numunesi rehberimize bak).',
  );
  return { oneri: 'MUSAVIR_TUT', gerekce, engeller, dokum };
}
