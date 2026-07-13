// Müşavir talebi e-posta bildirimi.
// İstemciden gelen talebi FormSubmit (anahtarsız e-posta servisi) üzerinden
// Baran'a iletir. Alıcı adres istemci koduna sızmaz.
// verify_jwt kapalı: istemci publishable key kullanıyor (JWT değil);
// uç nokta herkese açık bir iletişim formu niteliğindedir.
// NOT: FormSubmit, Origin/Referer başlığı olmayan istekleri sessizce
// reddediyor (HTTP 200 + success:"false") — başlıklar ve gövde kontrolü şart.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALICI = "baranmertozturk@gmail.com";
const SITE = "https://www.xn--gmrktekalmasn-wobc17f.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function kirp(deger: unknown, maks: number): string {
  return String(deger ?? "-").slice(0, maks);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, hata: "yalnızca POST" }), {
      status: 405,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  try {
    const veri = await req.json();
    const govde = {
      _subject: "gümrüktekalmasın.com — Yeni müşavir talebi",
      _template: "table",
      Eposta: kirp(veri.email, 200),
      Telefon: kirp(veri.telefon, 40),
      Not: kirp(veri.not, 1000),
      "Paket degeri (TL)": kirp(veri.paketDegeri, 20),
      Kategori: kirp(veri.kategori, 30),
      "Gonderi tipi": kirp(veri.gonderiTipi, 20),
      Oneri: kirp(veri.oneri, 20),
      Rejim: kirp(veri.rejim, 20),
      "Tahmini maliyet (TL)": kirp(veri.tahminiMaliyet, 20),
      Zaman: new Date().toISOString(),
    };

    const yanit = await fetch(`https://formsubmit.co/ajax/${ALICI}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: SITE,
        Referer: `${SITE}/musavir`,
      },
      body: JSON.stringify(govde),
    });

    const sonuc = (await yanit.json().catch(() => null)) as {
      success?: string | boolean;
      message?: string;
    } | null;
    const ok =
      yanit.ok && (sonuc?.success === "true" || sonuc?.success === true);

    if (!ok) {
      console.error("FormSubmit hatası:", yanit.status, sonuc?.message);
    }
    return new Response(
      JSON.stringify({ ok, mesaj: sonuc?.message ?? null }),
      {
        status: ok ? 200 : 502,
        headers: { ...CORS, "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ ok: false, hata: "geçersiz istek" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
