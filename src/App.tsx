import { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TriageForm from './pages/TriageForm';
import Sonuc from './pages/Sonuc';
import RehberIndex from './pages/RehberIndex';
import RehberDetay from './pages/RehberDetay';
import MusavirForm from './pages/MusavirForm';
import Gizlilik from './pages/Gizlilik';

/** SPA'da sayfa geçişinde kaydırma konumu korunur; her rotada en üstten başla */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hesapla" element={<TriageForm />} />
          <Route path="/sonuc" element={<Sonuc />} />
          <Route path="/rehber" element={<RehberIndex />} />
          <Route path="/rehber/:slug" element={<RehberDetay />} />
          <Route path="/musavir" element={<MusavirForm />} />
          <Route path="/gizlilik" element={<Gizlilik />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
