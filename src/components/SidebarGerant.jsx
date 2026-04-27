import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { section: 'Principal' },
  { label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { label: 'Commandes', icon: '🛒', path: '/dashboard', badge: true },
  { label: 'Historique', icon: '📋', path: '/dashboard/historique' },
  { section: 'Gestion' },
  { label: 'Menu', icon: '🍽', path: '/dashboard/menu' },
  { label: 'QR Codes', icon: '📱', path: '/dashboard/qrcodes' },
  { label: 'Paramètres', icon: '⚙️', path: '/dashboard/parametres' },
]

export default function SidebarGerant({ commandesEnAttente = 0 }) {
  const { gerant, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const couleur = gerant?.restaurant?.couleur_principale || '#C4420A'

  return (
    <div style={{ background: '#1A1008', width: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '28px 16px', position: 'sticky', top: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        .sb-item { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .2s;color:#8A7060;font-size:13px;font-weight:500;text-decoration:none; }
        .sb-item:hover { background:#2A1A0A;color:#F0E6D6; }
        .sb-item.active { background:${couleur};color:white; }
      `}</style>

      {/* Logo */}
      <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:couleur, marginBottom:28, padding:'0 8px', textDecoration:'none', display:'block' }}>
        Maxi-food
      </Link>

      {/* Nav */}
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#4A3A2A', padding:'4px 8px', marginTop:i>0?12:0, marginBottom:2 }}>
              {item.section}
            </div>
          )
          const isActive = location.pathname === item.path
          return (
            <Link key={i} to={item.path} className={`sb-item${isActive?' active':''}`}>
              <span style={{ fontSize:16, width:20, textAlign:'center' }}>{item.icon}</span>
              {item.label}
              {item.badge && commandesEnAttente > 0 && (
                <span style={{ background: isActive ? 'white' : couleur, color: isActive ? couleur : 'white', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, marginLeft:'auto' }}>
                  {commandesEnAttente}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom */}
      <div style={{ marginTop:'auto', paddingTop:20, borderTop:'1px solid #2A1A0A', display:'flex', flexDirection:'column', gap:2 }}>
        <Link to="/" className="sb-item" style={{ color:'#8A7060' }}>
          <span style={{ fontSize:16 }}>👁</span> Voir le site
        </Link>
        <div className="sb-item" style={{ color:'#E24B4A' }} onClick={() => { logout(); navigate('/login') }}>
          <span style={{ fontSize:16 }}>🚪</span> Déconnexion
        </div>
      </div>
    </div>
  )
}