// Katman 2 — DIY Sihirbaz: en sık 4 senaryo için statik rehber içeriği.
// İçerik Temmuz 2026'da güncel mevzuata göre doğrulandı (Karar 10813,
// Ticaret Bakanlığı posta/hızlı kargo SSS). Bilgilendirme amaçlıdır.

export interface Rehber {
  slug: string;
  baslik: string;
  ozet: string;
  kimeUygun: string;
  adimlar: { baslik: string; detay: string }[];
  gerekliBelgeler: string[];
  ipuclari: string[];
}

export const REHBERLER: Rehber[] = [
  {
    slug: 'aliexpress',
    baslik: 'AliExpress / Temu paketi gümrükte — kendin çek',
    ozet:
      'Çin çıkışlı e-ticaret paketlerinde beyanı taşıyıcı düzenler; sana kalan vergiyi online ödemek. Her kıymetteki paket vergiye tabi: AB dışından %60 (+ elektronikte %20).',
    kimeUygun:
      'AliExpress, Temu, Shein gibi platformlardan gelen, kıymeti 1500 €\'yu ve 30 kg\'ı aşmayan bireysel paketler. Cep telefonu ve kozmetik bu yolla GELEMEZ.',
    adimlar: [
      {
        baslik: 'Takip numaranı ve taşıyıcıyı belirle',
        detay:
          'Sipariş sayfasındaki takip numarasıyla paketin Türkiye\'de hangi taşıyıcıya (PTT veya yetkili hızlı kargo operatörü) devredildiğini bul. Paket gümrüğe geldiğinde taşıyıcı SMS/e-posta ile bildirim gönderir.',
      },
      {
        baslik: 'Bildirimdeki beyan onayını aç',
        detay:
          'Taşıyıcının linkinde (veya PTT için e-Devlet "Gümrüğe Gelen Gönderi Sorgulama" hizmetinde) paketin içeriği, kıymeti ve hesaplanan vergi listelenir. Kıymetin sipariş tutarınla uyuştuğunu kontrol et — vergi bu tutar üzerinden alınır.',
      },
      {
        baslik: 'Sipariş kanıtını hazırla/yükle',
        detay:
          'Sipariş özeti ekran görüntüsü veya PDF fatura iste(nirse) yükle. Gümrük, beyan edilen kıymeti emsallerle karşılaştırabilir; düşük beyan cezalı vergiye yol açar.',
      },
      {
        baslik: 'Vergiyi öde',
        detay:
          'Taşıyıcı, Elektronik Ticaret Gümrük Beyannamesini (ETGB) senin adına düzenler. Ekranda çıkan tek ve maktu vergiyi (AB dışı %60; elektronikte +%20; ayrıca KDV YOK) online öde. Ödeme sonrası beyan işleme alınır.',
      },
      {
        baslik: 'Teslimatı bekle',
        detay:
          'Beyan kapandıktan sonra paket 1-3 iş günü içinde dağıtıma çıkar. Takip numarasından izlemeye devam et.',
      },
    ],
    gerekliBelgeler: [
      'Sipariş özeti / fatura (ekran görüntüsü yeterli)',
      'T.C. kimlik numarası',
      'Online ödeme için banka/kredi kartı',
    ],
    ipuclari: [
      'Ayda en fazla 5 gönderin bu kapsamda işlem görür — sık sipariş veriyorsan takvimini planla.',
      'Vergi, hesapladığımızdan belirgin yüksekse taşıyıcının kıymet tespitine sipariş kanıtıyla itiraz edebilirsin.',
      'Paketi bekletme: bekleme süresi dolarsa iade/tasfiyeye gider, ardiye de birikir.',
    ],
  },
  {
    slug: 'amazon-ebay',
    baslik: 'Amazon Global / eBay paketi — kendin çek',
    ozet:
      'ABD/İngiltere çıkışlı gönderiler hızlı kargo (UPS, FedEx, DHL, Aramex) ile gelir; süreç operatörün paneli üzerinden yürür. AB dışı çıkışta maktu vergi %60\'tır.',
    kimeUygun:
      'Amazon Global, eBay veya yurt dışı mağazalardan hızlı kargo ile gelen, 1500 € / 30 kg sınırını aşmayan bireysel paketler.',
    adimlar: [
      {
        baslik: 'Kargo firmasının bilgilendirmesini bekle',
        detay:
          'Paket Türkiye\'ye inince operatör "gümrük işlemleri için onay/belge gerekiyor" içerikli e-posta/SMS gönderir. Bu mesajdaki link üzerinden ilerleyeceksin.',
      },
      {
        baslik: 'Dolaylı temsil onayını ver',
        detay:
          'Operatör, ETGB\'yi senin adına düzenlemek için dolaylı temsil onayı ister; formu online doldur. Kıymet 1500 €\'yu aşıyorsa operatör seni standart beyanname (TCGB) sürecine yönlendirir — o noktada müşavir önerimizi tekrar değerlendir.',
      },
      {
        baslik: 'Fatura ve ödeme kanıtını yükle',
        detay:
          'Amazon "Order Invoice" / eBay "Order details" PDF\'ini yükle. Ürün açıklaması ve tutar net görünmeli; kıymet tespiti buna göre yapılır.',
      },
      {
        baslik: 'Vergi ve hizmet bedelini öde',
        detay:
          'Operatör, tek ve maktu vergi (%60; ÖTV IV listesi eşyasında +%20) ile kendi gümrükleme hizmet bedelini iletir. Online ödedikten sonra beyan tamamlanır.',
      },
      {
        baslik: 'Teslimat ve belge saklama',
        detay:
          'Paket dağıtıma çıkar. ETGB çıktısını ve ödeme dekontunu sakla — iade/garanti süreçlerinde gerekebilir.',
      },
    ],
    gerekliBelgeler: [
      'Sipariş faturası (Amazon "Order Invoice" / eBay "Order details" PDF)',
      'T.C. kimlik numarası',
      'Dolaylı temsil onay formu (operatör iletir)',
    ],
    ipuclari: [
      'Operatörün "gümrükleme hizmet bedeli" ayrı bir kalemdir; faturada net görünmesini iste.',
      'Cep telefonu bu yolla GELEMEZ — sipariş vermeden önce kategori kısıtlarını kontrol et.',
      'ABD çıkışlı laptop/tablet gibi elektroniklerde ÖTV IV ilavesi (+%20) vergiyi ciddi büyütür; sipariş öncesi hesapla.',
    ],
  },
  {
    slug: 'hediye',
    baslik: 'Yurt dışından hediye geldi — ne yapmalı?',
    ozet:
      'Hediye gönderiler de istisnasız vergiye tabi: kıymeti ne olursa olsun beyan ve vergi var. Süreç genelde PTT üzerinden yürür.',
    kimeUygun:
      'Yurt dışındaki yakınlarından posta yoluyla kişisel eşya/hediye gelenler.',
    adimlar: [
      {
        baslik: 'PTT/posta bildirimini bekle',
        detay:
          'Hediye gönderiler çoğunlukla ulusal posta ağıyla gelir ve PTT\'nin gümrüklü biriminde bekletilir. Adresine SMS veya kağıt tebligat gelir.',
      },
      {
        baslik: 'e-Devlet üzerinden gönderiyi sorgula',
        detay:
          '"PTT Gümrüğe Gelen Gönderi" hizmetine gir, barkod numarasıyla paketini bul. İçerik ve kıymet beyanını burada göreceksin.',
      },
      {
        baslik: 'Kıymet beyanını doldur',
        detay:
          'Gönderen kıymet yazmadıysa senden içerik ve tahmini değer beyanı istenir. Gerçekçi beyan et: hediye de olsa memur emsal fiyat üzerinden değerlendirme yapabilir; düşük beyan cezalıdır.',
      },
      {
        baslik: 'Vergiyi öde',
        detay:
          'Tek ve maktu vergi uygulanır: AB\'den %30, diğer ülkelerden %60 (kişisel kitapta %0). PTT vezne veya online kanaldan öde. Kullanılmış kişisel eşyada vergisiz işlem mümkün — durumu dilekçeyle açıkla.',
      },
      {
        baslik: 'Paketi teslim al',
        detay:
          'Ödeme sonrası paket dağıtıma verilir ya da gümrüklü posta şubesinden kimlikle teslim alırsın.',
      },
    ],
    gerekliBelgeler: [
      'Tebligat / barkod numarası',
      'T.C. kimlik (şubeden teslimde)',
      'Varsa gönderenin kıymet beyanı',
    ],
    ipuclari: [
      'Kullanılmış kişisel eşyada (giysi, kitap vb.) "kullanılmış, ticari değeri yok" açıklaması vergiyi düşürebilir/sıfırlayabilir.',
      'Gıda takviyesi ve ilaç içeren hediyeler reçete/doktor raporu ister; kozmetik bireysel gönderiyle hiç gelemez — göndericini önceden uyar.',
      'Teslim almayacaksan hızlıca iade talebi oluştur; bekleme süresi dolunca tasfiyeye gider.',
    ],
  },
  {
    slug: 'is-numunesi',
    baslik: 'İş numunesi / ticari gönderi — süreci öğren',
    ozet:
      'Şirket adına gelen numune ve partiler maktu vergi kapsamına girmez: standart ithalat beyannamesi (TCGB), GTİP tespiti ve olası izinler gerekir.',
    kimeUygun:
      'Düzenli numune/parça getiren şahıs şirketi ve KOBİ\'ler. İlk beyanı müşavirle yapıp sonrakileri kendin üstlenmek yaygın ve mantıklı stratejidir.',
    adimlar: [
      {
        baslik: 'Gönderinin beyan tipini belirle',
        detay:
          'Ticari nitelikli her gönderi standart beyanname ister — kıymeti düşük olsa bile. Kargo firmasına "ticari gönderi, şirket adına" olduğunu baştan bildir; yanlış bireysel işlem sonradan ceza doğurabilir.',
      },
      {
        baslik: 'BİLGE sistemi / yükümlü kaydını aç',
        detay:
          'TCGB için Ticaret Bakanlığı BİLGE sistemine yükümlü kaydı (firma vergi numarasıyla) gerekir. Kayıt e-Devlet entegrasyonuyla başlar; ilk seferde gümrük müdürlüğü onayı alınır.',
      },
      {
        baslik: 'GTİP tespiti yap',
        detay:
          'Ürünün GTİP kodunu belirle — gümrük vergisi oranı, İGV/EMY ek yükleri ve izin gereksinimleri buna bağlıdır. Emin değilsen Bağlayıcı Tarife Bilgisi başvurusu yap (2026 tarifesinde işlem ücreti ~1.590 TL).',
      },
      {
        baslik: 'Beyannameyi doldur ve belgeleri ekle',
        detay:
          'BİLGE üzerinden TCGB\'yi doldur: ticari fatura, çeki listesi, taşıma senedi (AWB/konşimento), menşe ispatı (AB\'den geliyorsa ATR — gümrük vergisini sıfırlar). Numunede "bedelsiz numune" açıklaması ekle; bedelsiz girişin de asgari müşavirlik tarifesi 3.410 TL\'dir, kendi yapıyorsan bu masraf olmaz.',
      },
      {
        baslik: 'Muayene/kontrol ve vergi ödemesi',
        detay:
          'Beyan hat kontrolüne düşebilir (sarı/kırmızı hat). İstenirse ek belge sun; gümrük vergisi + ÖTV + KDV\'yi (standart rejim) gümrük saymanlığına öde ve eşyayı teslim al.',
      },
    ],
    gerekliBelgeler: [
      'Ticari fatura (proforma değil, mümkünse imzalı)',
      'Taşıma senedi (AWB / konşimento)',
      'Firma vergi levhası ve imza sirküleri',
      'Menşe belgesi (ATR / EUR.1 — AB menşeinde)',
      'Gerekiyorsa izin/uygunluk yazıları (TSE, TİTCK, Tarım vb.)',
    ],
    ipuclari: [
      'AB\'den gelen eşyada ATR belgesi gümrük vergisini sıfırlar — tedarikçiden mutlaka iste; belge tanzimi 2026 tarifesinde 350 TL\'dir.',
      'Müşavirle çalışırsan 2026 asgari tarifesi beyanname başına ~3.320-3.390 TL\'den başlar (KDV hariç); pazarlık ederken referans al.',
      '"Numune" diye beyan edilen ticari miktardaki eşya cezalı vergiye yol açar; miktarı gerçekçi tut.',
    ],
  },
];

export function rehberBul(slug: string): Rehber | undefined {
  return REHBERLER.find((r) => r.slug === slug);
}
