-- Supabase projesine (GumrukAsistani) 2026-07-11'de uygulandı.
-- Referans kopya — şema değişikliği gerekirse yeni migration dosyası ekle.

create table public.gumruk_basvurulari (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  paket_degeri numeric not null,
  kargo_ucreti numeric default 0,
  sigorta numeric default 0,
  mensei_ulke text not null,
  kategori text not null,
  durum text not null,
  gumrukte_gecen_gun integer,
  hesaplanan_toplam_maliyet numeric,
  oneri text, -- 'DEGMEZ' | 'KENDIN_YAP' | 'MUSAVIR_TUT'
  musavire_yonlendirildi boolean default false,
  iletisim_email text,
  iletisim_telefon text,
  iletisim_not text
);

alter table public.gumruk_basvurulari enable row level security;

-- MVP: herkes kayıt oluşturabilir (anon insert), okuma sadece admin (service role / dashboard)
create policy "insert_own" on public.gumruk_basvurulari
  for insert with check (true);
