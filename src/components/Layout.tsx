import { Link, NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="sayfa">
      <header className="ust-bar">
        <div className="ust-bar-ic container">
          <Link to="/" className="marka">
            <span className="marka-ikon" aria-hidden="true">
              📦
            </span>
            <span className="marka-ad">
              gümrükte<strong>kalmasın</strong>
            </span>
          </Link>
          <nav className="ust-menu" aria-label="Ana menü">
            <NavLink to="/hesapla" className={({ isActive }) => (isActive ? 'aktif' : '')}>
              Hesapla
            </NavLink>
            <NavLink to="/rehber" className={({ isActive }) => (isActive ? 'aktif' : '')}>
              Rehberler
            </NavLink>
            <NavLink to="/musavir" className={({ isActive }) => (isActive ? 'aktif' : '')}>
              Müşavir Bul
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="container icerik">
        <Outlet />
      </div>

      <footer className="alt-bilgi">
        <div className="container">
          <p>
            <strong>gümrüktekalmasın.com</strong> — hesaplar 2026 mevzuatına
            (Karar 10813, 2026 Müşavirlik Asgari Ücret Tarifesi) dayalı{' '}
            <strong>tahminlerdir</strong>; resmî gümrük beyanı yerine geçmez.
            Kesin tutarlar gümrük idaresinin kıymet tespitine göre değişebilir.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
