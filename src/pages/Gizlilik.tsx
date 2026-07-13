import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

function Gizlilik() {
  useSeo({
    baslik: 'Gizlilik ve KVKK Aydınlatma Metni',
    aciklama:
      'gümrüktekalmasın.com hangi verileri, hangi amaçla işler? KVKK kapsamındaki haklarınız ve iletişim bilgileri.',
    yol: '/gizlilik',
  });

  return (
    <main>
      <header className="sayfa-baslik">
        <h1>Gizlilik ve KVKK Aydınlatma Metni</h1>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında,
          gümrüktekalmasın.com olarak hangi verileri neden işlediğimizi burada
          açıklıyoruz.
        </p>
      </header>

      <div className="kart">
        <h2>Hangi verileri topluyoruz?</h2>
        <ul>
          <li>
            <strong>Hesaplama girdileri:</strong> paket değeri, kargo/sigorta
            tutarı, menşe, kategori, ağırlık ve paket durumu. Bu veriler{' '}
            <strong>kimlik bilgisi içermez</strong>; hizmeti iyileştirmek ve
            talep yoğunluğunu ölçmek için anonim olarak kaydedilir.
          </li>
          <li>
            <strong>Müşavir talebi bilgileri:</strong> müşavir eşleştirme
            formunu doldurursanız verdiğiniz e-posta adresi, telefon numarası
            ve not.
          </li>
        </ul>
        <p>
          Sitede üyelik yoktur; çerez tabanlı takip veya reklam çerezi
          kullanılmaz.
        </p>

        <h2>Verileri hangi amaçla işliyoruz?</h2>
        <ul>
          <li>
            Hesaplama girdileri: vergi tahmini üretmek ve hizmet talebini
            anonim olarak ölçmek.
          </li>
          <li>
            İletişim bilgileri: sizi talebinize uygun, sicili doğrulanmış bir
            gümrük müşavirlik firmasıyla eşleştirmek ve size dönüş yapmak.
          </li>
        </ul>

        <h2>Veriler kimlerle paylaşılır?</h2>
        <p>
          Müşavir talebinizdeki iletişim bilgileri, yalnızca eşleştirme amacıyla
          anlaşmalı gümrük müşavirlik firmasına iletilir; bunun dışında üçüncü
          kişilerle paylaşılmaz, pazarlama amacıyla kullanılmaz ve satılmaz.
          Veriler, altyapı sağlayıcımız Supabase üzerinde saklanır.
        </p>

        <h2>Saklama süresi</h2>
        <p>
          Müşavir talebi kayıtları, eşleştirme tamamlandıktan sonra makul bir
          süre (en fazla 12 ay) saklanır ve ardından silinir. Anonim hesaplama
          kayıtları istatistik amaçlı tutulmaya devam edebilir.
        </p>

        <h2>KVKK kapsamındaki haklarınız</h2>
        <p>
          KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini
          öğrenme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme
          haklarına sahipsiniz. Talepleriniz için bize e-posta ile
          ulaşabilirsiniz:{' '}
          <a href="mailto:baranmertozturk@gmail.com">
            baranmertozturk@gmail.com
          </a>
        </p>

        <p className="ipucu">
          Bu sitedeki hesaplamalar bilgilendirme amaçlı tahminlerdir; resmî
          gümrük beyanı veya hukuki danışmanlık yerine geçmez.
        </p>

        <Link className="btn btn-ikincil" to="/">
          ← Ana sayfa
        </Link>
      </div>
    </main>
  );
}

export default Gizlilik;
