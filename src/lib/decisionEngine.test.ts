import { describe, expect, it } from 'vitest';
import {
  engelKontrol,
  hesaplaArdiye,
  hesaplaMaliyet,
  kararVer,
  rejimBelirle,
} from './decisionEngine';
import {
  DEGMEZ_ORAN_ESIGI,
  MAKTU_KIYMET_LIMITI_EUR,
  MUSAVIRLIK_UCRETI,
} from './rates';
import type { PaketGirdisi } from './types';

// Testlerde deterministik kur: 1 € = 50 TL
const KUR = 50;

const temelGirdi: PaketGirdisi = {
  urunBedeli: 5000,
  kargoUcreti: 500,
  sigorta: 0,
  mensei: 'AB_DISI',
  kategori: 'genel',
  durum: 'yolda',
  gonderiTipi: 'bireysel',
  eurTry: KUR,
};

describe('rejimBelirle', () => {
  it('bireysel, sınır altı gönderi MAKTU rejimde', () => {
    const d = hesaplaMaliyet(temelGirdi);
    expect(d.rejim).toBe('MAKTU');
  });

  it('ticari gönderi her zaman STANDART rejimde', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, gonderiTipi: 'ticari' });
    expect(d.rejim).toBe('STANDART');
  });

  it('1500 € üzeri kıymet STANDART rejime geçer', () => {
    const d = hesaplaMaliyet({
      ...temelGirdi,
      urunBedeli: (MAKTU_KIYMET_LIMITI_EUR + 100) * KUR,
    });
    expect(d.rejim).toBe('STANDART');
  });

  it('30 kg üzeri ağırlık STANDART rejime geçer', () => {
    expect(rejimBelirle({ ...temelGirdi, agirlikKg: 31 }, 100)).toBe(
      'STANDART',
    );
    expect(rejimBelirle({ ...temelGirdi, agirlikKg: 30 }, 100)).toBe('MAKTU');
  });

  it('takvim ayındaki 5 gönderi sınırı aşılınca STANDART rejime geçer', () => {
    expect(rejimBelirle({ ...temelGirdi, buAyKacinciGonderi: 6 }, 100)).toBe(
      'STANDART',
    );
    expect(rejimBelirle({ ...temelGirdi, buAyKacinciGonderi: 5 }, 100)).toBe(
      'MAKTU',
    );
  });
});

describe('hesaplaMaliyet — MAKTU rejim', () => {
  it('AB dışı genel eşyada %60 tek ve maktu vergi, ayrıca KDV yok', () => {
    const d = hesaplaMaliyet(temelGirdi);
    expect(d.maktuVergi).toBeCloseTo(5500 * 0.6, 2);
    expect(d.kdv).toBe(0);
    expect(d.gumrukVergisi).toBe(0);
    expect(d.otv).toBe(0);
    expect(d.toplamKendinYap).toBeCloseTo(3300, 2);
  });

  it('AB menşeli eşyada %30 uygulanır', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, mensei: 'AB' });
    expect(d.maktuVergi).toBeCloseTo(5500 * 0.3, 2);
  });

  it('ÖTV IV listesi eşyasına (elektronik) ilave %20 eklenir', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, kategori: 'elektronik' });
    expect(d.otvIvEk).toBeCloseTo(5500 * 0.2, 2);
    expect(d.toplamKendinYap).toBeCloseTo(5500 * 0.6 + 5500 * 0.2, 2);
  });

  it('kişisel kitapta maktu vergi %0', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, kategori: 'kitap' });
    expect(d.maktuVergi).toBe(0);
    expect(d.otvIvEk).toBe(0);
    expect(d.toplamKendinYap).toBe(0);
  });

  it('CIF sigortayı da içerir ve Euro karşılığı kurla hesaplanır', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, sigorta: 250 });
    expect(d.cif).toBe(5750);
    expect(d.cifEur).toBeCloseTo(5750 / KUR, 2);
  });

  it('bireysel gönderide kargo girilmezse 3 € emsal navlun kıymete eklenir', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, kargoUcreti: 0 });
    expect(d.emsalNavlun).toBeCloseTo(3 * KUR, 2);
    expect(d.cif).toBeCloseTo(5000 + 3 * KUR, 2);
    expect(d.maktuVergi).toBeCloseTo((5000 + 3 * KUR) * 0.6, 2);
  });

  it('kargo girilmişse emsal navlun eklenmez', () => {
    const d = hesaplaMaliyet(temelGirdi);
    expect(d.emsalNavlun).toBe(0);
  });

  it('ticari gönderide kargo 0 olsa da emsal navlun eklenmez', () => {
    const d = hesaplaMaliyet({
      ...temelGirdi,
      gonderiTipi: 'ticari',
      kargoUcreti: 0,
    });
    expect(d.emsalNavlun).toBe(0);
    expect(d.cif).toBe(5000);
  });

  it('MAKTU rejimde kararOrani kendin-yap oranına eşittir', () => {
    const d = hesaplaMaliyet(temelGirdi);
    expect(d.kararOrani).toBeCloseTo(d.maliyetOrani, 2);
  });
});

describe('hesaplaMaliyet — STANDART rejim', () => {
  const ticariGirdi: PaketGirdisi = {
    ...temelGirdi,
    gonderiTipi: 'ticari',
    kategori: 'elektronik',
  };

  it('gümrük vergisi → ÖTV → KDV sırasıyla kademeli matrah kullanır', () => {
    const d = hesaplaMaliyet(ticariGirdi);
    const cif = 5500;
    const gv = cif * 0.05;
    const otv = (cif + gv) * 0.2;
    const kdv = (cif + gv + otv) * 0.2;
    expect(d.gumrukVergisi).toBeCloseTo(gv, 2);
    expect(d.otv).toBeCloseTo(otv, 2);
    expect(d.kdv).toBeCloseTo(kdv, 2);
    expect(d.maktuVergi).toBe(0);
  });

  it('AB menşeli eşyada gümrük vergisi 0 (ATR)', () => {
    const d = hesaplaMaliyet({ ...ticariGirdi, mensei: 'AB' });
    expect(d.gumrukVergisi).toBe(0);
    expect(d.kdv).toBeGreaterThan(0);
  });

  it('kitapta KDV de 0', () => {
    const d = hesaplaMaliyet({ ...ticariGirdi, kategori: 'kitap' });
    expect(d.kdv).toBe(0);
  });

  it('müşavirli toplam = kendin yap + müşavirlik orta ücreti', () => {
    const d = hesaplaMaliyet(ticariGirdi);
    const orta = (MUSAVIRLIK_UCRETI.min + MUSAVIRLIK_UCRETI.max) / 2;
    expect(d.toplamMusavirli).toBeCloseTo(d.toplamKendinYap + orta, 2);
  });

  it('STANDART rejimde kararOrani müşavirli toplam üzerinden hesaplanır', () => {
    const d = hesaplaMaliyet(ticariGirdi);
    expect(d.kararOrani).toBeCloseTo(d.toplamMusavirli / 5000, 2);
    expect(d.kararOrani).toBeGreaterThan(d.maliyetOrani);
  });
});

describe('hesaplaMaliyet — doğrulama', () => {
  it('geçersiz girdide hata fırlatır', () => {
    expect(() => hesaplaMaliyet({ ...temelGirdi, urunBedeli: 0 })).toThrow();
    expect(() => hesaplaMaliyet({ ...temelGirdi, kargoUcreti: -1 })).toThrow();
  });
});

describe('hesaplaArdiye', () => {
  it('ilk 3 gün ücretsiz', () => {
    expect(hesaplaArdiye(0)).toBe(0);
    expect(hesaplaArdiye(3)).toBe(0);
  });

  it('4. günden itibaren günlük ücret işler', () => {
    expect(hesaplaArdiye(5)).toBe(300); // 4. ve 5. gün × 150
  });

  it('11. günden itibaren yüksek dilim uygulanır', () => {
    // 4-10. gün: 7 × 150 = 1050, 11-12. gün: 2 × 300 = 600
    expect(hesaplaArdiye(12)).toBe(1650);
  });
});

describe('engelKontrol', () => {
  it('bireysel cep telefonu gönderisi engellidir', () => {
    expect(
      engelKontrol({ ...temelGirdi, kategori: 'telefon' }).length,
    ).toBeGreaterThan(0);
  });

  it('bireysel kozmetik gönderisi engellidir', () => {
    expect(
      engelKontrol({ ...temelGirdi, kategori: 'kozmetik' }).length,
    ).toBeGreaterThan(0);
  });

  it('ticari gönderide bireysel yasakları uygulanmaz', () => {
    expect(
      engelKontrol({
        ...temelGirdi,
        gonderiTipi: 'ticari',
        kategori: 'kozmetik',
      }),
    ).toHaveLength(0);
  });
});

describe('kararVer', () => {
  it('bireysel telefon için GETIRILEMEZ döner', () => {
    const sonuc = kararVer({ ...temelGirdi, kategori: 'telefon' });
    expect(sonuc.oneri).toBe('GETIRILEMEZ');
    expect(sonuc.engeller.length).toBeGreaterThan(0);
  });

  it('bireysel kozmetik için GETIRILEMEZ döner', () => {
    const sonuc = kararVer({ ...temelGirdi, kategori: 'kozmetik' });
    expect(sonuc.oneri).toBe('GETIRILEMEZ');
  });

  it('maliyet oranı eşiği aşınca DEGMEZ döner', () => {
    // AB dışı %60 maktu: 300 TL ürün + 900 TL kargo → vergi ürünün 2.4 katı
    const sonuc = kararVer({
      ...temelGirdi,
      urunBedeli: 300,
      kargoUcreti: 900,
    });
    expect(sonuc.dokum.maliyetOrani).toBeGreaterThan(DEGMEZ_ORAN_ESIGI);
    expect(sonuc.oneri).toBe('DEGMEZ');
  });

  it('standart rejimde eşik müşavirli toplamla kıyaslanır (küçük ticari gönderi DEGMEZ)', () => {
    // 10.000 TL ticari elektronik: vergiler ~%54, müşavirle ~%111 → DEĞMEZ
    const sonuc = kararVer({
      ...temelGirdi,
      gonderiTipi: 'ticari',
      kategori: 'elektronik',
      urunBedeli: 10000,
      kargoUcreti: 500,
    });
    expect(sonuc.dokum.kararOrani).toBeGreaterThan(DEGMEZ_ORAN_ESIGI);
    expect(sonuc.oneri).toBe('DEGMEZ');
    expect(sonuc.gerekce.join(' ')).toContain('müşavirlik');
  });

  it('aylık gönderi sınırı aşılınca bireysel gönderi standart rejime düşer', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      urunBedeli: 50000,
      buAyKacinciGonderi: 6,
    });
    expect(sonuc.dokum.rejim).toBe('STANDART');
    expect(sonuc.oneri).toBe('MUSAVIR_TUT');
    expect(sonuc.gerekce.join(' ')).toContain('5 gönderi sınırı');
  });

  it('maktu rejimdeki normal gönderi için KENDIN_YAP döner', () => {
    const sonuc = kararVer({ ...temelGirdi, mensei: 'AB', kategori: 'kitap' });
    expect(sonuc.oneri).toBe('KENDIN_YAP');
    expect(sonuc.dokum.rejim).toBe('MAKTU');
  });

  it('ticari gönderi için MUSAVIR_TUT döner', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      gonderiTipi: 'ticari',
      urunBedeli: 20000,
      kargoUcreti: 1000,
    });
    expect(sonuc.oneri).toBe('MUSAVIR_TUT');
    expect(sonuc.dokum.rejim).toBe('STANDART');
  });

  it('1500 € üzeri bireysel gönderi standart rejime düşer ve müşavir önerilir', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      mensei: 'AB',
      urunBedeli: 1600 * KUR,
      kargoUcreti: 0,
    });
    expect(sonuc.dokum.rejim).toBe('STANDART');
    expect(sonuc.oneri).toBe('MUSAVIR_TUT');
  });

  it('gümrükte bekleyen pakette ardiye maliyete dahil edilir', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      durum: 'gumrukte_bekliyor',
      gumrukteGecenGun: 10,
    });
    expect(sonuc.dokum.ardiye).toBeGreaterThan(0);
  });

  it('her sonuçta gerekçe listesi dolu döner', () => {
    const sonuc = kararVer(temelGirdi);
    expect(sonuc.gerekce.length).toBeGreaterThan(0);
  });
});
