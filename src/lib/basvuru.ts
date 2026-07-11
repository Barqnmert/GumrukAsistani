// Katman 3 hazırlığı + talep ölçümü: her hesaplama ve müşavir talebi
// gumruk_basvurulari tablosuna yazılır. Supabase yoksa sessizce atlanır —
// kayıt hiçbir zaman kullanıcı akışını bloklamaz.

import { supabase } from './supabase';
import type { KararSonucu, PaketGirdisi } from './types';

export interface IletisimBilgisi {
  email?: string;
  telefon?: string;
  not?: string;
}

export async function kaydetBasvuru(
  girdi: PaketGirdisi,
  sonuc: KararSonucu,
  secenekler?: { musavireYonlendirildi?: boolean; iletisim?: IletisimBilgisi },
): Promise<void> {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('gumruk_basvurulari').insert({
      paket_degeri: girdi.urunBedeli,
      kargo_ucreti: girdi.kargoUcreti,
      sigorta: girdi.sigorta ?? 0,
      mensei_ulke: girdi.mensei,
      kategori: girdi.kategori,
      durum: girdi.durum,
      gumrukte_gecen_gun: girdi.gumrukteGecenGun ?? null,
      hesaplanan_toplam_maliyet: sonuc.dokum.toplamKendinYap,
      oneri: sonuc.oneri,
      musavire_yonlendirildi: secenekler?.musavireYonlendirildi ?? false,
      iletisim_email: secenekler?.iletisim?.email || null,
      iletisim_telefon: secenekler?.iletisim?.telefon || null,
      iletisim_not: secenekler?.iletisim?.not || null,
    });
    if (error) {
      console.warn('Başvuru kaydedilemedi:', error.message);
    }
  } catch (err) {
    console.warn('Başvuru kaydedilemedi:', err);
  }
}
