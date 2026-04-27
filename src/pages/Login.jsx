import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      await login(email, motDePasse)
      navigate('/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.error || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#1A1008', display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes imgZoom{from{transform:scale(1.06)}to{transform:scale(1)}}
        .login-input:focus{border-color:#C4420A!important;outline:none}
        .login-input{transition:border .2s}
        .login-btn:hover{background:#A83508!important;transform:translateY(-1px)}
        .login-btn{transition:all .2s}
      `}</style>

      {/* LEFT - Photo */}
      <div style={{ flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:48 }}>
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80" alt="Restaurant"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', animation:'imgZoom 10s ease both' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(26,16,8,.95) 0%, rgba(26,16,8,.3) 60%, transparent 100%)' }} />
        <div style={{ position:'relative', zIndex:1, animation:'fadeUp .8s ease .2s both' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:900, color:'white', marginBottom:12, lineHeight:1.1 }}>
            Gérez votre<br /><em style={{ color:'#C4420A', fontStyle:'italic' }}>restaurant</em><br />avec style
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,.6)', lineHeight:1.7, maxWidth:380 }}>
            Tableau de bord complet — commandes en temps réel, statistiques, gestion du menu et bien plus encore.
          </p>
          <div style={{ display:'flex', gap:24, marginTop:28 }}>
            {[['🛒','Commandes live'],['📊','Statistiques'],['🍽','Gestion menu']].map(([icon,label]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:18 }}>{icon}</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,.6)', fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Form */}
      <div style={{ width:440, background:'#FBF7F2', display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 40px', animation:'fadeUp .7s ease .1s both' }}>
        <Link to="/" style={{ textDecoration:'none' }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:24, fontWeight:900, color:'#C4420A', marginBottom:40 }}>Maxi-food</div>
        </Link>

        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:32, fontWeight:900, color:'#1A1008', marginBottom:8 }}>Espace gérant</h1>
          <p style={{ fontSize:14, color:'#8A6A50', fontWeight:300 }}>Connectez-vous pour accéder au dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', display:'block', marginBottom:8, letterSpacing:'.04em', textTransform:'uppercase' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@maxifood.sn" required
              className="login-input"
              style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:12, padding:'13px 16px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#1A1008', background:'white' }} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', display:'block', marginBottom:8, letterSpacing:'.04em', textTransform:'uppercase' }}>Mot de passe</label>
            <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} placeholder="••••••••" required
              className="login-input"
              style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:12, padding:'13px 16px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", color:'#1A1008', background:'white' }} />
          </div>

          {erreur && (
            <div style={{ background:'#FFF0F0', border:'1px solid #F5C5C5', borderRadius:10, padding:'10px 16px', marginBottom:18, fontSize:13, color:'#C4320A', fontWeight:500 }}>
              ⚠️ {erreur}
            </div>
          )}

          <button type="submit" disabled={loading} className="login-btn"
            style={{ width:'100%', background:'#C4420A', color:'white', padding:'14px', borderRadius:12, fontWeight:600, fontSize:15, border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <div style={{ marginTop:32, paddingTop:24, borderTop:'1px solid #EDE4D8', textAlign:'center' }}>
          <Link to="/menu" style={{ fontSize:13, color:'#C4420A', textDecoration:'none', fontWeight:500 }}>← Retour au site client</Link>
        </div>
      </div>
    </div>
  )
}