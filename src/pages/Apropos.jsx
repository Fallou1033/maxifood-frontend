import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'

const VALEURS = [
  { icon:'🌿', titre:'Ingrédients frais', texte:"Nous sélectionnons chaque jour les meilleurs produits du marché local de Dakar." },
  { icon:'👨‍🍳', titre:'Cuisine maison', texte:"Tout est préparé sur place par notre équipe de cuisiniers passionnés." },
  { icon:'⚡', titre:'Service rapide', texte:"Livraison en 30 minutes ou prêt en 15 minutes pour les commandes sur place." },
  { icon:'❤️', titre:"Client d'abord", texte:"Votre satisfaction est notre priorité. Nous sommes là 7j/7 pour vous servir." },
]

export default function Apropos() {
  const [restaurant, setRestaurant] = useState(null)
  const couleur = restaurant?.couleur_principale || '#C4420A'

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`).then(r => setRestaurant(r.data)).catch(console.error)
  }, [])

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', color:'#1A1008', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .nav-link:hover{color:${couleur}!important;background:#FFF0E8!important}
        .val-card{background:white;border:1px solid #EDE4D8;border-radius:16px;padding:24px;transition:all .3s}
        .val-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(196,66,10,.1)}
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'#FBF7F2', padding:'18px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:couleur, textDecoration:'none' }}>Maxi-food</Link>
        <div style={{ display:'flex', gap:4 }}>
          {[['Accueil','/'],['Menu','/menu'],['À propos','/apropos'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} to={h} className="nav-link" style={{ fontSize:13, fontWeight:500, color: h==='/apropos' ? couleur : '#8A6A50', padding:'8px 16px', borderRadius:8, background: h==='/apropos' ? '#FFF0E8' : 'transparent', transition:'all .2s', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
        <Link to="/menu"><button style={{ background:couleur, color:'white', padding:'10px 22px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>Commander →</button></Link>
      </nav>

      {/* HERO */}
      <div style={{ padding:'80px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
        <div style={{ borderRadius:20, overflow:'hidden', height:420, animation:'fadeUp .8s ease .1s both' }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80" alt="Restaurant" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
        </div>
        <div style={{ animation:'fadeUp .8s ease .2s both' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:couleur, marginBottom:14 }}>Notre histoire</div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:900, color:'#1A1008', marginBottom:20, lineHeight:1.1 }}>Une passion pour la bonne cuisine</h1>
          <p style={{ fontSize:15, color:'#6A5040', lineHeight:1.9, marginBottom:16, fontWeight:300 }}>
            Maxi-food est né d'une idée simple : proposer une cuisine généreuse, savoureuse et accessible à tous les Dakarois. Depuis nos débuts au Plateau, nous avons grandi grâce à la confiance de nos clients.
          </p>
          <p style={{ fontSize:15, color:'#6A5040', lineHeight:1.9, marginBottom:28, fontWeight:300 }}>
            Chaque plat est préparé chaque jour avec des ingrédients frais sélectionnés au marché local. Notre équipe passionnée met tout son cœur pour que chaque repas soit une véritable expérience.
          </p>
          <div style={{ display:'flex', gap:12 }}>
            <Link to="/menu"><button style={{ background:couleur, color:'white', padding:'13px 28px', borderRadius:8, fontWeight:600, fontSize:14, border:'none', cursor:'pointer' }}>Voir notre menu</button></Link>
            <Link to="/contact"><button style={{ background:'white', color:'#1A1008', padding:'13px 28px', borderRadius:8, fontWeight:500, fontSize:14, border:'1.5px solid #EDE4D8', cursor:'pointer' }}>Nous contacter</button></Link>
          </div>
        </div>
      </div>

      {/* VALEURS */}
      <div style={{ padding:'0 48px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:couleur, marginBottom:10 }}>Nos valeurs</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:900, color:'#1A1008' }}>Ce qui nous rend différents</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {VALEURS.map((v,i) => (
            <div key={i} className="val-card" style={{ animationDelay:`${i*.1}s` }}>
              <div style={{ fontSize:28, marginBottom:12 }}>{v.icon}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:8 }}>{v.titre}</div>
              <div style={{ fontSize:13, color:'#8A6A50', lineHeight:1.6 }}>{v.texte}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM PHOTO */}
      <div style={{ margin:'0 48px 80px', borderRadius:20, overflow:'hidden', height:300, position:'relative' }}>
        <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80" alt="Cuisine" style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
        <div style={{ position:'absolute', inset:0, background:'rgba(26,16,8,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center', color:'white' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:900, marginBottom:8 }}>Notre équipe vous accueille</div>
            <div style={{ fontSize:14, opacity:.8 }}>7 jours sur 7, de 08h00 à 23h00</div>
          </div>
        </div>
      </div>

      <footer style={{ background:'#1A1008', padding:'32px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:couleur }}>Maxi-food</span>
        <span style={{ fontSize:12, color:'#4A3A2A' }}>{restaurant?.adresse || 'Plateau, Dakar'} · 08h00 – 23h00</span>
        <span style={{ fontSize:12, color:'#4A3A2A' }}>© 2026 Maxi-food</span>
      </footer>
    </div>
  )
}
