// Katman 3 hazırlığı + talep ölçümü: her hesaplama ve müşavir talebi
// gumruk_basvurulari tablosuna yazılır. Müşavir taleplerinde ayrıca
// edge function üzerinden e-posta bildirimi tetiklenir. Supabase yoksa
// sessizce atlanır — kayıt hiçbir zaman kullanıcı akışını bloklamaz.

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
      gonderi_tipi: girdi.gonderiTipi,
      agirlik_kg: girdi.agirlikKg ?? null,
      gumrukte_gecen_gun: girdi.gumrukteGecenGun ?? null,
      rejim: sonuc.dokum.rejim,
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

    // Müşavir talebi: Baran'a e-posta bildirimi (edge function üzerinden;
    // alıcı adres istemciye sızmaz)
    if (secenekler?.musavireYonlendirildi) {
      const { error: fnHata } = await supabase.functions.invoke(
        'musavir-bildirim',
        {
          body: {
            email: secenekler.iletisim?.email || '-',
            telefon: secenekler.iletisim?.telefon || '-',
            not: secenekler.iletisim?.not || '-',
            paketDegeri: girdi.urunBedeli,
            kategori: girdi.kategori,
            gonderiTipi: girdi.gonderiTipi,
            oneri: sonuc.oneri,
            rejim: sonuc.dokum.rejim,
            tahminiMaliyet: sonuc.dokum.toplamKendinYap,
          },
        },
      );
      if (fnHata) {
        console.warn('Bildirim gönderilemedi:', fnHata.message);
      }
    }
  } catch (err) {
    console.warn('Başvuru kaydedilemedi:', err);
  }
}
