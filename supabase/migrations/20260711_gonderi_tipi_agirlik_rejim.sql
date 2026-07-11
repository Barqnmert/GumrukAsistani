-- Supabase projesine 2026-07-11'de uygulandı (karar motoru v2 alanları).

alter table public.gumruk_basvurulari
  add column if not exists gonderi_tipi text,
  add column if not exists agirlik_kg numeric,
  add column if not exists rejim text;
