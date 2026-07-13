// EUR/TL ve USD/TL kurları: Frankfurter (ECB verisi, CORS açık, anahtarsız)
// üzerinden tek istekte canlı çekilir; ulaşılamazsa rates.ts'teki referans
// kurlar kullanılır.

import { VARSAYILAN_EUR_TRY, VARSAYILAN_USD_TRY } from './rates';

export interface KurBilgisi {
  /** 1 € kaç TL */
  eurTry: number;
  /** 1 $ kaç TL */
  usdTry: number;
  kaynak: 'canli' | 'varsayilan';
}

const VARSAYILAN: KurBilgisi = {
  eurTry: VARSAYILAN_EUR_TRY,
  usdTry: VARSAYILAN_USD_TRY,
  kaynak: 'varsayilan',
};

export async function getKurlar(): Promise<KurBilgisi> {
  try {
    const ctrl = new AbortController();
    const zamanlayici = setTimeout(() => ctrl.abort(), 4000);
    const yanit = await fetch(
      'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=TRY,USD',
      { signal: ctrl.signal },
    );
    clearTimeout(zamanlayici);
    if (yanit.ok) {
      const veri = (await yanit.json()) as {
        rates?: { TRY?: number; USD?: number };
      };
      const eurTry = veri.rates?.TRY;
      const eurUsd = veri.rates?.USD;
      if (typeof eurTry === 'number' && eurTry > 0) {
        // USD/TRY, EUR bazlı iki kurdan türetilir; USD gelmezse varsayılan.
        const usdTry =
          typeof eurUsd === 'number' && eurUsd > 0
            ? eurTry / eurUsd
            : VARSAYILAN_USD_TRY;
        return { eurTry, usdTry, kaynak: 'canli' };
      }
    }
  } catch {
    // sessizce varsayılana düş
  }
  return VARSAYILAN;
}
