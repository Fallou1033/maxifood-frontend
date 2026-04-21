import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

const TICKER = ['Livraison 30 min','Wave & Orange Money','QR code sur table','Frais du jour','Ouvert 08h–23h','Commande en ligne']

const FEATURED = [
  { img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', name:'Burger Maxi', desc:'Double steak, cheddar, sauce maison', price:'3 500 F', tag:'Best-seller' },
  { img:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', name:'Pizza Margherita', desc:'Tomate, mozzarella, basilic frais', price:'4 200 F', tag:'Nouveau' },
  { img:'https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400&q=80', name:'Poulet grillé', desc:'Mariné 24h, sauce piment maison', price:'3 800 F', tag:'Populaire' },
  { img:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80', name:'Frites maison', desc:'Pommes de terre fraîches, sel de mer', price:'1 200 F', tag:'' },
]

export default function Accueil() {
  const [restaurant, setRestaurant] = useState(null)
  const [visible, setVisible] = useState(false)
  const { nbArticles } = usePanier()
  const navigate = useNavigate()
  const couleur = restaurant?.couleur_principale || '#C4420A'

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`).then(r => setRestaurant(r.data)).catch(console.error)
    setTimeout(() => setVisible(true), 80)
  }, [])

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', color:'#1A1008', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes imgZoom{from{transform:scale(1.08)}to{transform:scale(1)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .food-card{background:white;border-radius:16px;overflow:hidden;cursor:pointer;transition:all .3s;border:1px solid #EDE4D8}
        .food-card:hover{transform:translateY(-6px);box-shadow:0 16px 40px rgba(196,66,10,.12)}
        .food-img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
        .food-card:hover .food-img{transform:scale(1.06)}
        .food-add:hover{background:${couleur}!important;color:white!important}
        .btn-p:hover{background:#A83508!important;transform:translateY(-2px)}
        .btn-s:hover{border-color:${couleur}!important;color:${couleur}!important}
        .nav-link:hover{color:${couleur}!important;background:#FFF0E8!important}
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'#FBF7F2', padding:'18px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:couleur, textDecoration:'none' }}>Maxi-food</Link>
        <div style={{ display:'flex', gap:4 }}>
          {[['Accueil','/'],['Menu','/menu'],['À propos','/apropos'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} to={h} className="nav-link" style={{ fontSize:13, fontWeight:500, color:'#8A6A50', padding:'8px 16px', borderRadius:8, transition:'all .2s', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
        <Link to="/menu">
          <button className="btn-p" style={{ background:couleur, color:'white', padding:'10px 22px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', transition:'all .2s' }}>
            Commander →{nbArticles > 0 && <span style={{ background:'white', color:couleur, borderRadius:'50%', width:18, height:18, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, marginLeft:8 }}>{nbArticles}</span>}
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:540 }}>
        <div style={{ padding:'70px 48px', display:'flex', flexDirection:'column', justifyContent:'center', animation: visible ? 'fadeUp .8s ease .1s both' : 'none' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#FFF0E8', border:'1px solid #F5D5C0', padding:'6px 14px', borderRadius:20, fontSize:11, fontWeight:600, color:couleur, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:24, width:'fit-content' }}>
            <span style={{ width:6, height:6, background:couleur, borderRadius:'50%', animation:'pulse 2s infinite', display:'inline-block' }} />
            Ouvert · {restaurant?.adresse || 'Plateau, Dakar'}
          </div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:58, fontWeight:900, lineHeight:1.05, color:'#1A1008', marginBottom:18 }}>
            La cuisine<br />qui <em style={{ color:couleur, fontStyle:'italic' }}>fait</em><br />voyager
          </h1>
          <p style={{ fontSize:15, color:'#8A6A50', lineHeight:1.8, marginBottom:32, fontWeight:300, maxWidth:420 }}>
            {restaurant?.slogan || 'Burgers juteux, pizzas croustillantes, poulet grillé et frites dorées — une explosion de saveurs à Dakar.'}
          </p>
          <div style={{ display:'flex', gap:12, marginBottom:40 }}>
            <Link to="/menu"><button className="btn-p" style={{ background:couleur, color:'white', padding:'13px 28px', borderRadius:8, fontWeight:600, fontSize:14, border:'none', cursor:'pointer', transition:'all .2s' }}>Commander maintenant</button></Link>
            <Link to="/menu"><button className="btn-s" style={{ background:'white', color:'#1A1008', padding:'13px 28px', borderRadius:8, fontWeight:500, fontSize:14, border:'1.5px solid #EDE4D8', cursor:'pointer', transition:'all .2s' }}>Voir le menu</button></Link>
          </div>
          <div style={{ display:'flex', gap:32, paddingTop:32, borderTop:'1px solid #EDE4D8' }}>
            {[['4.8★','Satisfaction'],['500+','Clients'],["30'",'Livraison']].map(([n,l]) => (
              <div key={l}><div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:900, color:couleur }}>{n}</div><div style={{ fontSize:11, color:'#B0906A', marginTop:2, letterSpacing:'.05em', textTransform:'uppercase' }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ position:'relative', overflow:'hidden', animation: visible ? 'scaleIn 1s ease .3s both' : 'none' }}>
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" alt="Burger" style={{ width:'100%', height:'100%', objectFit:'cover', animation:'imgZoom 8s ease both' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(196,66,10,.15),transparent)' }} />
          <div style={{ position:'absolute', bottom:32, left:28, background:'white', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:14, boxShadow:'0 8px 32px rgba(0,0,0,.12)' }}>
            <span style={{ fontSize:28, animation:'float 3s ease infinite', display:'inline-block' }}>🍔</span>
            <div><div style={{ fontWeight:700, fontSize:14, color:'#1A1008' }}>Burger Maxi</div><div style={{ fontSize:13, color:couleur, fontWeight:600 }}>3 500 F · Best-seller</div></div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ background:couleur, padding:'12px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'ticker 22s linear infinite', width:'max-content' }}>
          {[...TICKER,...TICKER,...TICKER].map((t,i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'0 24px', fontSize:12, color:'rgba(255,255,255,.85)', whiteSpace:'nowrap', fontWeight:500, letterSpacing:'.04em' }}>
              ⬥ {t}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      <div style={{ padding:'80px 48px' }}>
        <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:couleur, marginBottom:10 }}>Nos incontournables</div>
        <div style={{ fontFamily:"'Fraunces',serif", fontSize:38, fontWeight:900, color:'#1A1008', marginBottom:8, lineHeight:1.1 }}>Ce que tout le monde commande</div>
        <div style={{ fontSize:14, color:'#8A6A50', marginBottom:40, fontWeight:300 }}>Sélectionnés par nos clients les plus fidèles</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {FEATURED.map((f,i) => (
            <div key={i} className="food-card" style={{ animationDelay:`${i*.08}s`, animation:'cardIn .5s ease both' }} onClick={() => navigate('/menu')}>
              <div style={{ position:'relative', height:160, overflow:'hidden' }}>
                <img className="food-img" src={f.img} alt={f.name} loading="lazy" />
                {f.tag && <span style={{ position:'absolute', top:12, left:12, background:couleur, color:'white', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'.06em' }}>{f.tag}</span>}
              </div>
              <div style={{ padding:16 }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:700, color:'#1A1008', marginBottom:4 }}>{f.name}</div>
                <div style={{ fontSize:12, color:'#B0906A', lineHeight:1.5, marginBottom:12 }}>{f.desc}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:700, fontSize:15, color:couleur }}>{f.price}</span>
                  <button className="food-add" style={{ width:30, height:30, background:'#FFF0E8', border:'none', borderRadius:8, color:couleur, fontSize:18, cursor:'pointer', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin:'0 48px 80px', background:'#1A1008', borderRadius:20, padding:'56px 60px', display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'center' }}>
        <div>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:34, fontWeight:900, color:'#FBF7F2', marginBottom:8, lineHeight:1.1 }}>Commandez en<br />3 clics chrono</div>
          <div style={{ fontSize:14, color:'#8A7060', fontWeight:300 }}>Sur place avec le QR code, à emporter ou en livraison</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, minWidth:200 }}>
          <Link to="/menu"><button className="btn-p" style={{ background:couleur, color:'white', padding:'13px 0', borderRadius:8, fontWeight:600, fontSize:14, border:'none', cursor:'pointer', transition:'all .2s', width:'100%' }}>Commander maintenant</button></Link>
          <Link to="/contact"><button className="btn-s" style={{ background:'transparent', color:'#FBF7F2', padding:'13px 0', borderRadius:8, fontWeight:500, fontSize:14, border:'1.5px solid #3A2A1A', cursor:'pointer', transition:'all .2s', width:'100%' }}>Nous appeler</button></Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#1A1008', padding:'32px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:couleur }}>Maxi-food</span>
        <span style={{ fontSize:12, color:'#4A3A2A', letterSpacing:'.04em' }}>{restaurant?.adresse || 'Plateau, Dakar'} · {restaurant?.heure_ouverture?.slice(0,5)||'08h00'} – {restaurant?.heure_fermeture?.slice(0,5)||'23h00'}</span>
        <span style={{ fontSize:12, color:'#4A3A2A' }}>© 2026 Maxi-food</span>
      </footer>
    </div>
  )
}
