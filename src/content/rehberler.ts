// Katman 2 — DIY Sihirbaz: en sık 4 senaryo için statik rehber içeriği.
// İçerik bilgilendirme amaçlıdır; mevzuat değiştikçe burada güncellenir.

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
    baslik: 'AliExpress paketi gümrükte — kendin çek',
    ozet:
      'Çin menşeli e-ticaret paketleri için ETGB süreci: çoğu durumda kargo firması üzerinden birkaç tıkla tamamlanır.',
    kimeUygun:
      'AliExpress, Temu, Shein gibi platformlardan gelen, kısıtlı kategoride olmayan paketler.',
    adimlar: [
      {
        baslik: 'Takip numaranı ve taşıyıcıyı belirle',
        detay:
          'Sipariş sayfasındaki takip numarasıyla paketin Türkiye\'de hangi taşıyıcıya (PTT, Yurtiçi, aracı hızlı kargo firması) devredildiğini bul. Paket gümrüğe geldiğinde taşıyıcı sana SMS/e-posta ile bildirim gönderir.',
      },
      {
        baslik: 'Bildirimdeki beyan onayını aç',
        detay:
          'Taşıyıcının gönderdiği linkte (veya PTT için e-Devlet "Gümrüğe Gelen Gönderi Sorgulama" hizmetinde) paketinin içeriği, değeri ve hesaplanan vergiler listelenir. Değer, sipariş tutarınla uyuşuyor mu kontrol et.',
      },
      {
        baslik: 'Fatura/sipariş kanıtını yükle',
        detay:
          'Sipariş özeti ekran görüntüsü veya PDF faturayı sisteme yükle. Gümrük, beyan edilen değerin doğruluğunu buradan kontrol eder — düşük beyan cezaya yol açar.',
      },
      {
        baslik: 'ETGB ile beyanı onayla ve vergiyi öde',
        detay:
          'Taşıyıcı senin adına Elektronik Ticaret Gümrük Beyannamesi (ETGB) düzenler. Sana düşen, ekranda çıkan vergi tutarını (gümrük vergisi + KDV) online ödemek. Ödeme sonrası beyan işleme alınır.',
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
      'Ödeme için banka/kredi kartı',
    ],
    ipuclari: [
      'Vergi tutarı hesapladığımızdan belirgin şekilde yüksekse, taşıyıcının değer tespitine itiraz edebilirsin — sipariş kanıtı bu yüzden önemli.',
      'Paketi 20 gün içinde çekmezsen tasfiye sürecine girer; bildirimleri bekletme.',
    ],
  },
  {
    slug: 'amazon-ebay',
    baslik: 'Amazon Global / eBay paketi — kendin çek',
    ozet:
      'ABD/İngiltere çıkışlı gönderiler genellikle hızlı kargo (UPS, FedEx, DHL, Aramex) ile gelir; süreç kargo firmasının müşteri paneli üzerinden yürür.',
    kimeUygun:
      'Amazon Global, eBay veya yurt dışı mağazalardan hızlı kargo ile gelen paketler.',
    adimlar: [
      {
        baslik: 'Kargo firmasının bilgilendirmesini bekle',
        detay:
          'Paket Türkiye\'ye inince kargo firması "gümrük işlemleri için belge/onay gerekiyor" içerikli e-posta/SMS gönderir. Bu mesajdaki link üzerinden ilerleyeceksin.',
      },
      {
        baslik: 'Vekalet veya bireysel beyan tercihini yap',
        detay:
          'Hızlı kargo firmaları düşük değerli gönderilerde ETGB ile senin adına beyan yapar (dolaylı temsil onayı istenir). Onay formunu doldur; yüksek değerli gönderide firma seni normal beyanname (TCGB) sürecine yönlendirir — o durumda müşavir önerimizi tekrar değerlendir.',
      },
      {
        baslik: 'Fatura ve ödeme kanıtını yükle',
        detay:
          'Amazon/eBay sipariş faturasını (PDF) ve gerekiyorsa kart ekstresini yükle. Ürün açıklamasının ve tutarın net görünmesine dikkat et.',
      },
      {
        baslik: 'Vergileri ve hizmet bedelini öde',
        detay:
          'Firma hesaplanan vergiler + kendi gümrükleme hizmet bedelini tek faturada iletir. Online ödedikten sonra beyan tamamlanır.',
      },
      {
        baslik: 'Teslimat ve belge saklama',
        detay:
          'Paket dağıtıma çıkar. ETGB çıktısını ve ödeme dekontunu en az 5 yıl sakla — özellikle iade/garanti süreçlerinde gerekebilir.',
      },
    ],
    gerekliBelgeler: [
      'Sipariş faturası (Amazon "Order Invoice" / eBay "Order details" PDF)',
      'T.C. kimlik numarası',
      'Dolaylı temsil onay formu (kargo firması iletir)',
    ],
    ipuclari: [
      'Kargo firmasının "gümrükleme hizmet bedeli" pazarlığa kapalı değildir sanılır ama itiraz edilebilir; faturada ayrı kalem olarak iste.',
      'ABD çıkışlı elektronikte IMEI kaydı gerekebilir (telefon/tablet) — bu durumda kayıt harcını da bütçele.',
    ],
  },
  {
    slug: 'hediye',
    baslik: 'Yurt dışından hediye geldi — ne yapmalı?',
    ozet:
      '6 Şubat 2026 sonrası hediye gönderiler de muafiyet dışı: değeri ne olursa olsun beyana tabi. Ama süreç genelde posta idaresi üzerinden basittir.',
    kimeUygun:
      'Yurt dışındaki yakınlarından posta yoluyla kişisel eşya/hediye gelenler.',
    adimlar: [
      {
        baslik: 'PTT/posta bildirimini bekle',
        detay:
          'Hediye gönderiler çoğunlukla ulusal posta ağıyla gelir ve PTT gümrük müdürlüğünde bekletilir. Adresine kağıt tebligat veya SMS gelir.',
      },
      {
        baslik: 'e-Devlet üzerinden gönderiyi sorgula',
        detay:
          '"PTT Gümrüğe Gelen Gönderi" hizmetine gir, barkod numarasıyla paketini bul. İçerik ve değer beyanını burada göreceksin.',
      },
      {
        baslik: 'Değer beyanını doldur',
        detay:
          'Gönderen değer beyanı yazmadıysa senden içerik ve tahmini değer beyanı istenir. Gerçekçi beyan et: hediye de olsa gümrük memuru emsal fiyat üzerinden değerlendirme yapabilir.',
      },
      {
        baslik: 'Vergiyi öde veya muafiyet itirazı yap',
        detay:
          'Hesaplanan vergiyi PTT vezne/online kanaldan öde. Kişisel kullanım miktarını aşmayan, ticari nitelik taşımayan gönderilerde durumu açıklayan dilekçe ile itiraz hakkın var.',
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
      'Varsa gönderenin değer beyanı',
    ],
    ipuclari: [
      'Kullanılmış kişisel eşyada (giysi, kitap vb.) vergi çıkmaması ya da düşük çıkması için "kullanılmış, ticari değeri yok" açıklaması ekletmek işe yarar.',
      'Gıda, takviye, kozmetik içeren hediyeler ek izne takılabilir — bu kategorilerde paket iade riskini göze al veya müşavir danış.',
    ],
  },
  {
    slug: 'is-numunesi',
    baslik: 'İş numunesi / küçük ticari gönderi — kendin çek',
    ozet:
      'Şirket adına gelen numune ve küçük partiler için süreç bireysel paketten farklıdır: vergi numarası, EORI benzeri kayıt ve çoğu zaman TCGB gerekir.',
    kimeUygun:
      'Düzenli numune/parça getiren şahıs şirketi ve KOBİ\'ler. İlk kez yapıyorsan bu rehber "harita" niteliğinde — ilk beyanı müşavirle yapıp sonrakini kendin üstlenmek yaygın stratejidir.',
    adimlar: [
      {
        baslik: 'Gönderinin beyan tipini belirle',
        detay:
          'Düşük değerli numuneler hızlı kargo ETGB kapsamına girebilir; bunun üzerindeki her şey standart beyanname (TCGB) ister. Kargo firmasına "ticari gönderi, şirket adına" olduğunu baştan bildir.',
      },
      {
        baslik: 'BİLGE sistemi / yükümlü kaydını aç',
        detay:
          'TCGB gerekiyorsa Ticaret Bakanlığı BİLGE sistemine yükümlü kaydı (firma vergi no ile) yaptırılmalı. Kayıt e-Devlet entegrasyonuyla başlar; ilk seferde gümrük müdürlüğü onayı gerekir.',
      },
      {
        baslik: 'GTİP tespiti yap',
        detay:
          'Ürünün GTİP (gümrük tarife istatistik pozisyonu) kodunu belirle — vergi oranı ve izin gereksinimleri buna bağlı. Ticaret Bakanlığı tarife arama motorunu kullan; emin değilsen bağlayıcı tarife bilgisi başvurusu yap.',
      },
      {
        baslik: 'Beyannameyi doldur ve belgeleri ekle',
        detay:
          'BİLGE üzerinden TCGB\'yi doldur: fatura, çeki listesi, taşıma senedi (AWB/konşimento), menşe ispatı (varsa ATR/EUR.1 — AB menşeinde vergiyi sıfırlar). Numunelerde "bedelsiz numune" açıklaması ve düşük kıymet gerekçesi ekle.',
      },
      {
        baslik: 'Muayene/kontrol ve vergi ödemesi',
        detay:
          'Beyan hat kontrolüne düşer (sarı/kırmızı hat olabilir). İstenirse ek belge sun, vergileri gümrük saymanlığına öde, eşyayı teslim al.',
      },
    ],
    gerekliBelgeler: [
      'Ticari fatura (proforma değil, mümkünse imzalı)',
      'Taşıma senedi (AWB / konşimento)',
      'Firma vergi levhası ve imza sirküleri',
      'Menşe belgesi (ATR/EUR.1 — AB menşeinde)',
      'Gerekiyorsa izin/uygunluk yazıları (TSE, TİTCK vb.)',
    ],
    ipuclari: [
      'AB\'den gelen eşyada ATR belgesi gümrük vergisini sıfırlar — tedarikçiden mutlaka iste, sonradan ibraz zahmetlidir.',
      'Aynı üründen düzenli ithalat yapacaksan ilk beyanı müşavirle yapıp beyan örneğini şablon olarak sakla.',
      'Numune diye beyan edilen ticari miktardaki eşya cezalı vergiye yol açar; miktarı gerçekçi tut.',
    ],
  },
];

export function rehberBul(slug: string): Rehber | undefined {
  return REHBERLER.find((r) => r.slug === slug);
}
