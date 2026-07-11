import { Link } from 'react-router-dom';
import { REHBERLER } from '../content/rehberler';

function RehberIndex() {
  return (
    <main>
      <h1>DIY Rehberler</h1>
      <p>
        Müşavire para ödemeden paketini kendin çekmek için senaryona uyan
        rehberi seç. Her rehber adım adım ilerler.
      </p>
      {REHBERLER.map((r) => (
        <div className="kart" key={r.slug}>
          <h2 style={{ marginTop: 0 }}>
            <Link to={`/rehber/${r.slug}`}>{r.baslik}</Link>
          </h2>
          <p>{r.ozet}</p>
          <p className="ipucu">{r.kimeUygun}</p>
        </div>
      ))}
    </main>
  );
}

export default RehberIndex;
