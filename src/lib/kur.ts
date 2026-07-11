// EUR/TL kuru: Frankfurter (ECB verisi, CORS açık, anahtarsız) üzerinden
// canlı çekilir; ulaşılamazsa rates.ts'teki referans kur kullanılır.

import { VARSAYILAN_EUR_TRY } from './rates';

export interface KurBilgisi {
  kur: number;
  kaynak: 'canli' | 'varsayilan';
}

export async function getEurTry(): Promise<KurBilgisi> {
  try {
    const ctrl = new AbortController();
    const zamanlayici = setTimeout(() => ctrl.abort(), 4000);
    const yanit = await fetch(
      'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=TRY',
      { signal: ctrl.signal },
    );
    clearTimeout(zamanlayici);
    if (yanit.ok) {
      const veri = (await yanit.json()) as { rates?: { TRY?: number } };
      const kur = veri.rates?.TRY;
      if (typeof kur === 'number' && kur > 0) {
        return { kur, kaynak: 'canli' };
      }
    }
  } catch {
    // sessizce varsayılana düş
  }
  return { kur: VARSAYILAN_EUR_TRY, kaynak: 'varsayilan' };
}
