import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'

export default function Contact() {
  const [restaurant, setRestaurant] = useState(null)
  const [form, setForm] = useState({ nom:'', contact:'', sujet:'Commande spéciale', message:'' })
  const [envoye, setEnvoye] = useState(false)
  const couleur = restaurant?.couleur_principale || '#C4420A'

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`).then(r => setRestaurant(r.data)).catch(console.error)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnvoye(true)
    setTimeout(() => setEnvoye(false), 4000)
  }

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', color:'#1A1008', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .nav-link:hover{color:${couleur}!important;background:#FFF0E8!important}
        .form-input:focus{border-color:${couleur}!important;outline:none}
        .contact-item{background:white;border:1px solid #EDE4D8;border-radius:12px;padding:18px;display:flex;align-items:flex-start;gap:14px;transition:all .3s}
        .contact-item:hover{border-color:${couleur};transform:translateX(4px)}
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ background:'#FBF7F2', padding:'18px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:100 }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:couleur, textDecoration:'none' }}>Maxi-food</Link>
        <div style={{ display:'flex', gap:4 }}>
          {[['Accueil','/'],['Menu','/menu'],['À propos','/apropos'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} to={h} className="nav-link" style={{ fontSize:13, fontWeight:500, color: h==='/contact' ? couleur : '#8A6A50', padding:'8px 16px', borderRadius:8, background: h==='/contact' ? '#FFF0E8' : 'transparent', transition:'all .2s', textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
        <Link to="/menu"><button style={{ background:couleur, color:'white', padding:'10px 22px', borderRadius:8, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>Commander →</button></Link>
      </nav>

      {/* CONTENT */}
      <div style={{ padding:'80px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60 }}>

        {/* LEFT */}
        <div style={{ animation:'fadeUp .8s ease .1s both' }}>
          <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:couleur, marginBottom:12 }}>Contactez-nous</div>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:44, fontWeight:900, color:'#1A1008', marginBottom:16, lineHeight:1.1 }}>On est là<br />pour vous</h1>
          <p style={{ fontSize:14, color:'#8A6A50', lineHeight:1.7, marginBottom:32, fontWeight:300 }}>
            Une question, une commande spéciale ou un avis ? Notre équipe vous répond rapidement.
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:32 }}>
            {[
              { icon:'📍', label:'Adresse', val: restaurant?.adresse || 'Plateau, Dakar, Sénégal' },
              { icon:'📞', label:'Téléphone', val: restaurant?.telephone || '+221 77 000 00 00' },
              { icon:'🕐', label:'Horaires', val: `Lun–Dim · ${restaurant?.heure_ouverture?.slice(0,5)||'08h00'} – ${restaurant?.heure_fermeture?.slice(0,5)||'23h00'}` },
              { icon:'📱', label:'Paiement', val:'Wave · Orange Money · Cash' },
            ].map((c,i) => (
              <div key={i} className="contact-item">
                <span style={{ fontSize:22, flexShrink:0 }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'.08em', color:'#B0906A', fontWeight:600, marginBottom:4 }}>{c.label}</div>
                  <div style={{ fontSize:14, fontWeight:500, color:'#1A1008' }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Map image */}
          <div style={{ borderRadius:16, overflow:'hidden', height:200, position:'relative' }}>
            <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&q=80" alt="Carte" style={{ width:'100%', height:'100%', objectFit:'cover', opacity:.7 }} loading="lazy" />
            <div style={{ position:'absolute', inset:0, background:'rgba(26,16,8,.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ background:couleur, color:'white', padding:'10px 20px', borderRadius:20, fontSize:13, fontWeight:600 }}>📍 Plateau, Dakar</span>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:20, padding:40, animation:'fadeUp .8s ease .2s both' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:700, color:'#1A1008', marginBottom:24 }}>Envoyez-nous un message</div>

          {envoye && (
            <div style={{ background:'#F0FFF4', border:'1px solid #9FE1CB', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:14, color:'#085041', fontWeight:500 }}>
              ✅ Message envoyé ! Nous vous répondrons sous 24h.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { label:'Votre nom', key:'nom', type:'text', placeholder:'Mamadou Diop' },
              { label:'Email ou téléphone', key:'contact', type:'text', placeholder:'+221 77 000 00 00' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:18 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', marginBottom:6, display:'block', letterSpacing:'.04em', textTransform:'uppercase' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({...form, [f.key]:e.target.value})}
                  className="form-input"
                  style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:10, padding:'12px 16px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#1A1008', background:'#FBF7F2', transition:'border .2s' }} />
              </div>
            ))}
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', marginBottom:6, display:'block', letterSpacing:'.04em', textTransform:'uppercase' }}>Sujet</label>
              <select value={form.sujet} onChange={e => setForm({...form, sujet:e.target.value})}
                className="form-input"
                style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:10, padding:'12px 16px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#1A1008', background:'#FBF7F2', cursor:'pointer' }}>
                {['Commande spéciale','Question sur le menu','Réservation','Réclamation','Autre'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', marginBottom:6, display:'block', letterSpacing:'.04em', textTransform:'uppercase' }}>Message</label>
              <textarea value={form.message} onChange={e => setForm({...form, message:e.target.value})}
                placeholder="Votre message..." rows={4}
                className="form-input"
                style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:10, padding:'12px 16px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#1A1008', background:'#FBF7F2', resize:'vertical', transition:'border .2s' }} />
            </div>
            <button type="submit"
              style={{ width:'100%', background:couleur, color:'white', padding:14, borderRadius:8, fontWeight:600, fontSize:15, border:'none', cursor:'pointer', transition:'all .2s' }}>
              Envoyer le message
            </button>
          </form>
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
