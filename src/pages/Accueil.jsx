import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

const TICKER_ITEMS = [
  'Commande en ligne 24h/24',
  'Paiement Wave & Orange Money',
  'Livraison rapide à Dakar',
  'QR code sur chaque table',
  'Cuisine fraîche du marché',
  'Ouvert 08h – 23h tous les jours',
]

export default function Accueil() {
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [categorieActive, setCategorieActive] = useState('all')
  const [visible, setVisible] = useState(false)
  const { nbArticles } = usePanier()
  const navigate = useNavigate()
  const heroRef = useRef(null)

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`)
      .then(res => setRestaurant(res.data))
      .catch(console.error)

    api.get(`/menu/${RESTAURANT_ID}`)
      .then(res => setMenu(res.data))
      .catch(console.error)

    setTimeout(() => setVisible(true), 100)
  }, [])

  const categories = menu.map(c => ({ id: c.id, nom: c.nom }))
  const platsAffiches = categorieActive === 'all'
    ? menu.flatMap(c => c.plats).slice(0, 8)
    : menu.find(c => c.id === categorieActive)?.plats || []

  const couleur = restaurant?.couleur_principale || '#E8A272'

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#ddd2cb', color: '#F0E6D6', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        @keyframes fadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.94) } to { opacity:1; transform:scale(1) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-7px) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        @keyframes ticker { 0% { transform:translateX(0) } 100% { transform:translateX(-50%) } }
        @keyframes cardIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }

        .v3-nav-link:hover { color: #E8A272 !important; }
        .v3-order-btn:hover { background: #E8A272 !important; border-color: #E8A272 !important; color: #080503 !important; }
        .v3-featured:hover { border-color: #E8A272 !important; transform: translateY(-4px); }
        .v3-mini:hover { border-color: #3A2A1A !important; transform: translateY(-2px); }
        .v3-card:hover { border-color: #3A2A1A !important; transform: translateY(-6px); }
        .v3-card-btn:hover { background: #E8A272 !important; color: #080503 !important; }
        .v3-btn-primary:hover { background: #F0B882 !important; transform: translateY(-2px); }
        .v3-btn-ghost:hover { border-color: #E8A272 !important; color: #E8A272 !important; }
        .v3-feat-add:hover { background: #F0B882 !important; }
        .v3-tab { transition: all 0.2s; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1A0D05', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, letterSpacing: '0.04em' }}>
          Maxi<span style={{ color: couleur }}>·</span>food
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {['Menu', 'À propos', 'Livraison', 'Contact'].map(l => (
            <span key={l} className="v3-nav-link" style={{ fontSize: 13, color: '#6B5A48', cursor: 'pointer', letterSpacing: '0.04em', transition: 'color 0.2s' }}>{l}</span>
          ))}
        </div>
        <Link to="/menu">
          <button className="v3-order-btn" style={{ background: 'transparent', border: '1px solid #3A2A1A', color: '#F0E6D6', padding: '10px 24px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s' }}>
            Commander →
            {nbArticles > 0 && <span style={{ background: couleur, color: '#080503', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginLeft: 8 }}>{nbArticles}</span>}
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <div style={{ padding: '70px 48px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>

        {/* Left */}
        <div style={{ animation: visible ? 'fadeUp 0.9s ease 0.1s both' : 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #2A1A0A', padding: '6px 14px', borderRadius: 4, fontSize: 11, fontWeight: 500, color: '#9A7A5A', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: couleur, borderRadius: '50%', animation: 'pulse 2s ease infinite', display: 'inline-block' }} />
            Ouvert maintenant · {restaurant?.adresse || 'Dakar'}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 62, fontWeight: 700, lineHeight: 1.0, color: '#F0E6D6', marginBottom: 20, letterSpacing: '-0.01em' }}>
            L'âme de<br />Dakar dans<br />
            <em style={{ color: couleur, fontStyle: 'italic' }}>chaque plat</em>
          </h1>
          <p style={{ fontSize: 15, color: '#6B5A48', lineHeight: 1.8, marginBottom: 36, fontWeight: 300, maxWidth: 400 }}>
            {restaurant?.slogan || 'Une cuisine qui célèbre les saveurs authentiques du Sénégal — thiéboudienne, yassa, brochettes et bien plus encore.'}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link to="/menu">
              <button className="v3-btn-primary" style={{ background: couleur, color: '#080503', padding: '14px 32px', borderRadius: 6, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s' }}>
                Commander maintenant
              </button>
            </Link>
            <Link to="/menu">
              <button className="v3-btn-ghost" style={{ background: 'transparent', color: '#F0E6D6', padding: '14px 32px', borderRadius: 6, fontWeight: 400, fontSize: 14, border: '1px solid #2A1A0A', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s' }}>
                Voir le menu
              </button>
            </Link>
          </div>
          <div style={{ width: 48, height: 1, background: '#2A1A0A', marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 36 }}>
            {[{ n: '4.8★', l: 'Satisfaction' }, { n: '200+', l: 'Avis clients' }, { n: "30'", l: 'Livraison' }].map(m => (
              <div key={m.l}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: couleur, lineHeight: 1 }}>{m.n}</div>
                <div style={{ fontSize: 11, color: '#6B5A48', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ animation: visible ? 'scaleIn 1s ease 0.3s both' : 'none' }}>
          {/* Featured card */}
          <div className="v3-featured" style={{ background: '#0F0905', border: '1px solid #2A1A0A', borderRadius: 16, padding: 28, marginBottom: 14, transition: 'all 0.4s', cursor: 'pointer' }}
            onClick={() => navigate('/menu')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 70, height: 70, background: '#1A0D05', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, animation: 'float 3s ease infinite', flexShrink: 0 }}>
                {platsAffiches[0] ? '🍽' : '🍔'}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: couleur, background: couleur + '20', padding: '3px 10px', borderRadius: 3, marginBottom: 6, display: 'inline-block' }}>
                  Best-seller
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: '#F0E6D6' }}>
                  {platsAffiches[0]?.nom || 'Burger Maxi'}
                </div>
                <div style={{ fontSize: 12, color: '#6B5A48', lineHeight: 1.5 }}>
                  {platsAffiches[0]?.description || 'Double steak · Cheddar fondant · Sauce maison'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #1A0D05' }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: couleur }}>
                {platsAffiches[0]?.prix ? `${platsAffiches[0].prix.toLocaleString('fr-FR')} F` : '3 500 F'}
              </span>
              <button className="v3-feat-add" style={{ background: couleur, color: '#080503', border: 'none', padding: '9px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                Ajouter au panier
              </button>
            </div>
          </div>

          {/* Mini grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {(platsAffiches.slice(1, 5).length > 0 ? platsAffiches.slice(1, 5) : [
              { nom: 'Thiéboudienne', prix: 2500 },
              { nom: 'Yassa poulet', prix: 3000 },
              { nom: 'Brochettes bœuf', prix: 3200 },
              { nom: 'Bissap frais', prix: 500 },
            ]).map((p, i) => (
              <div key={i} className="v3-mini" style={{ background: '#0F0905', border: '1px solid #1A0D05', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => navigate('/menu')}>
                <div style={{ width: 44, height: 44, background: '#1A0D05', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                  {['🍚','🍗','🥩','🥤'][i] || '🍽'}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#D0C0A8', marginBottom: 2 }}>{p.nom}</div>
                  <div style={{ fontSize: 12, color: couleur }}>{p.prix?.toLocaleString('fr-FR')} F</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ background: '#0F0905', borderTop: '1px solid #1A0D05', borderBottom: '1px solid #1A0D05', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'ticker 25s linear infinite', width: 'max-content' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 28px', fontSize: 13, color: '#6B5A48', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              <span style={{ color: '#3A2A1A', fontSize: 18 }}>·</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* MENU SECTION */}
      <div style={{ padding: '80px 48px' }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: couleur, marginBottom: 12 }}>
          Notre sélection
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, color: '#F0E6D6', marginBottom: 40, lineHeight: 1.1 }}>
          Des plats préparés<br />avec passion
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, background: '#0F0905', padding: 4, borderRadius: 8, border: '1px solid #1A0D05', width: 'fit-content' }}>
          <button onClick={() => setCategorieActive('all')}
            style={{ padding: '8px 20px', borderRadius: 6, fontSize: 13, cursor: 'pointer', letterSpacing: '0.03em', border: 'none', background: categorieActive === 'all' ? couleur : 'transparent', color: categorieActive === 'all' ? '#080503' : '#6B5A48', fontWeight: categorieActive === 'all' ? 600 : 400 }}>
            Tout
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategorieActive(cat.id)}
              style={{ padding: '8px 20px', borderRadius: 6, fontSize: 13, cursor: 'pointer', letterSpacing: '0.03em', border: 'none', background: categorieActive === cat.id ? couleur : 'transparent', color: categorieActive === cat.id ? '#080503' : '#6B5A48', fontWeight: categorieActive === cat.id ? 600 : 400 }}>
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
          {platsAffiches.map((plat, i) => (
            <div key={plat.id} className="v3-card"
              style={{ background: '#0F0905', border: '1px solid #1A0D05', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.35s', animation: `cardIn 0.5s ease ${i * 0.08}s both` }}>
              <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, background: '#080503' }}>
                🍽
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: '#F0E6D6', marginBottom: 6 }}>{plat.nom}</div>
                <div style={{ fontSize: 12, color: '#5A4A38', lineHeight: 1.5, marginBottom: 16 }}>{plat.description || 'Plat préparé avec des ingrédients frais'}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: couleur }}>{plat.prix?.toLocaleString('fr-FR')} F</span>
                  <button className="v3-card-btn"
                    style={{ width: 32, height: 32, background: couleur + '20', border: `1px solid ${couleur}40`, borderRadius: 8, color: couleur, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onClick={() => navigate('/menu')}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          {platsAffiches.length === 0 && [
            { n: 'Burger Maxi', d: 'Double steak, cheddar, sauce maison', p: 3500 },
            { n: 'Thiéboudienne', d: 'Riz au poisson fumé, légumes frais', p: 2500 },
            { n: 'Yassa poulet', d: 'Poulet mariné aux oignons et citron', p: 3000 },
            { n: 'Brochettes bœuf', d: '6 pièces grillées, sauce piment', p: 3200 },
          ].map((p, i) => (
            <div key={i} className="v3-card"
              style={{ background: '#0F0905', border: '1px solid #1A0D05', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.35s', animation: `cardIn 0.5s ease ${i * 0.08}s both` }}
              onClick={() => navigate('/menu')}>
              <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, background: '#080503' }}>
                {['🍔','🍚','🍗','🥩'][i]}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: '#F0E6D6', marginBottom: 6 }}>{p.n}</div>
                <div style={{ fontSize: 12, color: '#5A4A38', lineHeight: 1.5, marginBottom: 16 }}>{p.d}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: couleur }}>{p.p.toLocaleString('fr-FR')} F</span>
                  <button className="v3-card-btn"
                    style={{ width: 32, height: 32, background: couleur + '20', border: `1px solid ${couleur}40`, borderRadius: 8, color: couleur, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/menu">
            <button className="v3-btn-ghost" style={{ background: 'transparent', color: '#F0E6D6', padding: '14px 40px', borderRadius: 6, fontWeight: 400, fontSize: 14, border: '1px solid #2A1A0A', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s' }}>
              Voir tout le menu →
            </button>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: '0 48px 80px', background: '#0F0905', border: '1px solid #1A0D05', borderRadius: 20, padding: '60px 60px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 700, color: '#F0E6D6', marginBottom: 10, lineHeight: 1.1 }}>
            Prêt à vous<br />régaler ?
          </div>
          <div style={{ fontSize: 14, color: '#6B5A48', fontWeight: 300 }}>
            Sur place, à emporter ou en livraison — disponible 7j/7 de {restaurant?.heure_ouverture?.slice(0,5) || '08h00'} à {restaurant?.heure_fermeture?.slice(0,5) || '23h00'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 220 }}>
          <Link to="/menu">
            <button className="v3-btn-primary" style={{ background: couleur, color: '#080503', padding: '14px 0', borderRadius: 6, fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s', width: '100%' }}>
              Commander maintenant
            </button>
          </Link>
          {restaurant?.telephone && (
            <a href={`tel:${restaurant.telephone}`}>
              <button className="v3-btn-ghost" style={{ background: 'transparent', color: '#F0E6D6', padding: '14px 0', borderRadius: 6, fontWeight: 400, fontSize: 14, border: '1px solid #2A1A0A', cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.3s', width: '100%' }}>
                {restaurant.telephone}
              </button>
            </a>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '32px 48px', borderTop: '1px solid #1A0D05', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700, color: couleur }}>Maxi·food</span>
        <span style={{ fontSize: 12, color: '#3A2A1A', letterSpacing: '0.04em' }}>
          {restaurant?.adresse || 'Plateau, Dakar'} · Ouvert {restaurant?.heure_ouverture?.slice(0,5) || '08h00'} – {restaurant?.heure_fermeture?.slice(0,5) || '23h00'}
        </span>
        <span style={{ fontSize: 12, color: '#3A2A1A', letterSpacing: '0.04em' }}>© 2026 Maxi-food</span>
      </footer>
    </div>
  )
}
