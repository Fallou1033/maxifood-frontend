import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

const PLATS_DEFAUT = [
  { img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', nom:'Burger Maxi', description:'Double steak, cheddar, sauce maison', prix:3500, cat:'Burgers', tag:'Best-seller' },
  { img:'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80', nom:'Burger Classic', description:'Steak, salade, tomate, ketchup', prix:2800, cat:'Burgers', tag:'' },
  { img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', nom:'Pizza Margherita', description:'Tomate, mozzarella, basilic frais', prix:4200, cat:'Pizzas', tag:'Nouveau' },
  { img:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', nom:'Pizza 4 fromages', description:'Mozzarella, cheddar, parmesan, chèvre', prix:4800, cat:'Pizzas', tag:'' },
  { img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400&q=80', nom:'Poulet grillé', description:'Mariné 24h, sauce piment maison', prix:3800, cat:'Poulet', tag:'Populaire' },
  { img:'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80', nom:'Poulet frit', description:'Croustillant, épices maison', prix:3200, cat:'Poulet', tag:'' },
  { img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', nom:'Frites maison', description:'Pommes de terre fraîches, sel de mer', prix:1200, cat:'Frites & Extras', tag:'' },
  { img:'https://images.unsplash.com/photo-1554979948-71a1c0b3ead5?w=400&q=80', nom:'Bissap frais', description:'Hibiscus, citron, sucre de canne', prix:700, cat:'Boissons', tag:'' },
]

export default function Menu() {
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [catActive, setCatActive] = useState('Tout')
  const { ajouterPlat, nbArticles } = usePanier()
  const navigate = useNavigate()
  const couleur = restaurant?.couleur_principale || '#C4420A'

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`).then(r => setRestaurant(r.data)).catch(console.error)
    api.get(`/menu/${RESTAURANT_ID}`).then(r => setMenu(r.data)).catch(console.error)
  }, [])

  const platsReels = menu.flatMap(c => c.plats.map(p => ({ ...p, cat: c.nom })))
  const plats = platsReels.length > 0 ? platsReels : PLATS_DEFAUT
  const categories = ['Tout', ...new Set(plats.map(p => p.cat))]
  const platsFiltres = catActive === 'Tout' ? plats : plats.filter(p => p.cat === catActive)

  const handleAjouter = (plat) => {
    if (platsReels.length > 0) {
      ajouterPlat(plat)
    } else {
      navigate('/panier')
    }
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', color:'#1A1008', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes cardIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .food-card{background:white;border-radius:16px;overflow:hidden;cursor:pointer;transition:all .3s;border:1px solid #EDE4D8}
        .food-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(196,66,10,.12)}
        .food-img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .food-card:hover .food-img{transform:scale(1.06)}
        .nav-link:hover{color:${couleur}!important;background:#FFF0E8!important}
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'#FBF7F2', padding:'18px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:couleur, textDecoration:'none' }}>Maxi-food</Link>
        <div style={{ display:'flex', gap:4 }}>
          {[['Accueil','/'],['Menu','/menu'],['À propos','/apropos'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} to={h} className="nav-link" style={{ fontSize:13, fontWeight:500, color: h==='/menu' ? couleur : '#8A6A50', padding:'8px 16px', borderRadius:8, background: h==='/menu' ? '#FFF0E8' : 'transparent', transition:'all .2s', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
        <Link to="/panier">
          <button style={{ background:couleur, color:'white', padding:'10px 22px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            Panier {nbArticles > 0 && `(${nbArticles})`}
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <div style={{ background:'#1A1008', padding:'60px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>
        <div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:48, fontWeight:900, color:'#FBF7F2', marginBottom:12 }}>Notre menu</h1>
          <p style={{ fontSize:14, color:'#8A7060', lineHeight:1.7, fontWeight:300 }}>Tout est préparé chaque jour avec des ingrédients frais. Commandez sur place ou depuis chez vous.</p>
        </div>
        <div style={{ borderRadius:16, overflow:'hidden', height:240 }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="Restaurant" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
        </div>
      </div>

      {/* MENU CONTENT */}
      <div style={{ padding:'60px 48px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:32, flexWrap:'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatActive(cat)}
              style={{ padding:'9px 20px', borderRadius:20, fontSize:13, fontWeight:500, cursor:'pointer', border: catActive===cat ? 'none' : '1.5px solid #EDE4D8', background: catActive===cat ? couleur : 'white', color: catActive===cat ? 'white' : '#8A6A50', transition:'all .2s' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:18 }}>
          {platsFiltres.map((plat, i) => (
            <div key={plat.id || i} className="food-card" style={{ animation:`cardIn .5s ease ${i*.06}s both` }}>
              <div style={{ position:'relative', height:180, overflow:'hidden' }}>
                <img className="food-img" src={plat.img || plat.image_url || `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80`} alt={plat.nom} loading="lazy" />
                {plat.tag && <span style={{ position:'absolute', top:12, left:12, background:couleur, color:'white', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>{plat.tag}</span>}
                {plat.est_populaire && <span style={{ position:'absolute', top:12, left:12, background:couleur, color:'white', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>Populaire</span>}
              </div>
              <div style={{ padding:18 }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:6 }}>{plat.nom}</div>
                <div style={{ fontSize:12, color:'#B0906A', lineHeight:1.5, marginBottom:16 }}>{plat.description || 'Plat préparé avec des ingrédients frais'}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:700, fontSize:16, color:couleur }}>{plat.prix?.toLocaleString('fr-FR')} F</span>
                  <button onClick={() => handleAjouter(plat)}
                    style={{ background:couleur, color:'white', border:'none', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all .2s' }}>
                    + Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background:'#1A1008', padding:'32px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:couleur }}>Maxi-food</span>
        <span style={{ fontSize:12, color:'#4A3A2A' }}>{restaurant?.adresse || 'Plateau, Dakar'} · 08h00 – 23h00</span>
        <span style={{ fontSize:12, color:'#4A3A2A' }}>© 2026 Maxi-food</span>
      </footer>
    </div>
  )
}
