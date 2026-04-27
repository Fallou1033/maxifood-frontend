import { useEffect, useState, useCallback } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import SidebarGerant from '../components/SidebarGerant'

const STATUTS = {
  recue:          { label:'Reçue',          bg:'#EBF4FF', text:'#185FA5' },
  en_preparation: { label:'En préparation', bg:'#FFF8E8', text:'#BA7517' },
  prete:          { label:'Prête',          bg:'#F0FFF4', text:'#0F6E56' },
  livree:         { label:'Livrée',         bg:'#F5F5F5', text:'#6B6B6B' },
  annulee:        { label:'Annulée',        bg:'#FFF0F0', text:'#C4320A' },
}
const PROCHAINS = { recue:'en_preparation', en_preparation:'prete', prete:'livree' }
const MODE_LABELS = { sur_place:'🪑 Sur place', a_emporter:'🥡 À emporter', livraison:'🛵 Livraison' }

export default function Dashboard() {
  const { gerant } = useAuth()
  const [commandes, setCommandes] = useState([])
  const [stats, setStats] = useState(null)
  const [onglet, setOnglet] = useState('live')
  const restaurantId = gerant?.restaurant?.id
  const couleur = gerant?.restaurant?.couleur_principale || '#C4420A'
  const nom = gerant?.nom || 'Admin'

  const chargerCommandes = useCallback(async () => {
    if (!restaurantId) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await api.get(`/commandes/restaurant/${restaurantId}?date=${today}`)
      setCommandes(res.data)
    } catch (err) { console.error(err) }
  }, [restaurantId])

  const chargerStats = useCallback(async () => {
    if (!restaurantId) return
    try {
      const res = await api.get(`/stats/${restaurantId}/resume`)
      setStats(res.data)
    } catch (err) { console.error(err) }
  }, [restaurantId])

  useEffect(() => {
    chargerCommandes()
    chargerStats()
    if (!restaurantId) return
    const channel = supabase.channel('dashboard-live')
      .on('postgres_changes', { event:'*', schema:'public', table:'commandes', filter:`restaurant_id=eq.${restaurantId}` },
        () => { chargerCommandes(); chargerStats() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [restaurantId, chargerCommandes, chargerStats])

  const changerStatut = async (commandeId, statut) => {
    try {
      await api.patch(`/commandes/${commandeId}/statut`, { statut })
      setCommandes(prev => prev.map(c => c.id === commandeId ? { ...c, statut } : c))
    } catch (err) { console.error(err) }
  }

  const actives = commandes.filter(c => ['recue','en_preparation','prete'].includes(c.statut))
  const terminees = commandes.filter(c => ['livree','annulee'].includes(c.statut))
  const totalJour = commandes.filter(c => c.statut !== 'annulee').reduce((s,c) => s + c.montant_total, 0)
  const maxMontant = Math.max(...(stats?.evolution?.map(j => j.montant) || [1]))

  const heure = new Date().getHours()
  const salut = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div style={{ display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .stat-card{background:white;border:1px solid #EDE4D8;border-radius:16px;padding:20px;transition:all .3s;animation:fadeUp .5s ease both}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(196,66,10,.08)}
        .cmd-card{background:white;border:1px solid #EDE4D8;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;transition:all .3s;animation:slideIn .4s ease both}
        .cmd-card:hover{border-color:#F5D5C0;transform:translateX(4px)}
        .onglet-btn{padding:9px 20px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid #EDE4D8;background:white;color:#8A6A50;transition:all .2s;font-family:'Plus Jakarta Sans',sans-serif}
        .onglet-btn.on{border:none;color:white}
        .btn-next{font-size:12px;font-weight:600;padding:7px 16px;border-radius:8px;border:none;cursor:pointer;color:white;transition:all .2s}
        .btn-next:hover{opacity:.85;transform:scale(.98)}
      `}</style>

      <SidebarGerant commandesActives={actives.length} />

      <div style={{ flex:1, overflow:'auto' }}>
        {/* TOPBAR */}
        <div style={{ background:'#FBF7F2', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:10 }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#1A1008' }}>{salut}, {nom} 👋</div>
            <div style={{ fontSize:12, color:'#B0906A', marginTop:2 }}>
              {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {gerant?.restaurant?.nom}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {actives.length > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, background:'#FFF0E8', border:'1px solid #F5D5C0', borderRadius:10, padding:'8px 14px' }}>
                <span style={{ width:8, height:8, background:couleur, borderRadius:'50%', animation:'pulse 1.5s infinite', display:'inline-block' }} />
                <span style={{ fontSize:13, fontWeight:600, color:couleur }}>{actives.length} commande{actives.length > 1 ? 's' : ''} active{actives.length > 1 ? 's' : ''}</span>
              </div>
            )}
            <div style={{ width:36, height:36, background:couleur, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white' }}>
              {nom.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ padding:'28px 32px' }}>
          {/* ONGLETS */}
          <div style={{ display:'flex', gap:8, marginBottom:24 }}>
            <button className={`onglet-btn ${onglet==='live'?'on':''}`} onClick={() => setOnglet('live')} style={{ background: onglet==='live' ? couleur : 'white' }}>
              🔴 Live {actives.length > 0 && `(${actives.length})`}
            </button>
            <button className={`onglet-btn ${onglet==='stats'?'on':''}`} onClick={() => setOnglet('stats')} style={{ background: onglet==='stats' ? couleur : 'white' }}>
              📊 Statistiques
            </button>
          </div>

          {/* ── LIVE ── */}
          {onglet === 'live' && (
            <>
              {/* Stats rapides */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
                {[
                  { icon:'🛒', bg:'#FFF0E8', label:'Commandes', value: commandes.filter(c=>c.statut!=='annulee').length, sub:'Aujourd\'hui' },
                  { icon:'💰', bg:'#F0FFF4', label:'Revenus', value: `${totalJour.toLocaleString('fr-FR')} F`, sub:'Aujourd\'hui' },
                  { icon:'⏳', bg:'#FFF8E8', label:'En attente', value: actives.length, sub: actives.length > 0 ? '⚠️ Action requise' : 'Aucune en cours', alert: actives.length > 0 },
                  { icon:'✅', bg:'#F0F8FF', label:'Terminées', value: terminees.length, sub:'Aujourd\'hui' },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{ animationDelay:`${i*.08}s`, borderColor: s.alert ? '#F5D5C0' : '#EDE4D8' }}>
                    <div style={{ width:40, height:40, background:s.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:14 }}>{s.icon}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:'#B0906A', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:6 }}>{s.label}</div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:900, color: s.alert ? couleur : '#1A1008', lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:11, color: s.alert ? couleur : '#B0906A', marginTop:6, fontWeight:500 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Commandes actives */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008' }}>Commandes en cours</div>
                <span style={{ fontSize:12, color:couleur, fontWeight:500 }}>{actives.length} active{actives.length > 1 ? 's' : ''}</span>
              </div>

              {actives.length === 0 ? (
                <div style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:16, padding:'48px', textAlign:'center', marginBottom:28 }}>
                  <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:4 }}>Tout est à jour !</div>
                  <div style={{ fontSize:14, color:'#B0906A' }}>Aucune commande en attente pour le moment.</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
                  {actives.map((c,i) => {
                    const s = STATUTS[c.statut]
                    const prochain = PROCHAINS[c.statut]
                    return (
                      <div key={c.id} className="cmd-card" style={{ animationDelay:`${i*.08}s` }}>
                        <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:900, color:'#1A1008', minWidth:54 }}>
                          #{String(c.numero).padStart(4,'0')}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, color:'#1A1008', fontWeight:600, marginBottom:3 }}>
                            {c.lignes_commande?.map(l=>`${l.nom_plat} ×${l.quantite}`).join(' · ')}
                          </div>
                          <div style={{ fontSize:11, color:'#B0906A' }}>
                            {MODE_LABELS[c.mode]} {c.nom_client && `· ${c.nom_client}`} · {new Date(c.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                          </div>
                          {c.note_client && (
                            <div style={{ fontSize:11, color:'#BA7517', background:'#FFF8E8', borderRadius:6, padding:'3px 8px', marginTop:4, display:'inline-block' }}>
                              📝 {c.note_client}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:20, background:s.bg, color:s.text, whiteSpace:'nowrap' }}>{s.label}</span>
                        <span style={{ fontWeight:700, fontSize:15, color:couleur, whiteSpace:'nowrap' }}>{c.montant_total.toLocaleString('fr-FR')} F</span>
                        <div style={{ display:'flex', gap:6 }}>
                          {c.statut === 'recue' && (
                            <button onClick={() => changerStatut(c.id,'annulee')}
                              style={{ fontSize:12, fontWeight:500, padding:'7px 12px', borderRadius:8, border:'1px solid #F5D5C0', background:'white', color:'#C4320A', cursor:'pointer' }}>
                              Annuler
                            </button>
                          )}
                          {prochain && (
                            <button className="btn-next" onClick={() => changerStatut(c.id, prochain)} style={{ background:couleur }}>
                              → {STATUTS[prochain].label}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Terminées */}
              {terminees.length > 0 && (
                <>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:14 }}>Terminées aujourd'hui</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {terminees.slice(0,5).map((c,i) => {
                      const s = STATUTS[c.statut]
                      return (
                        <div key={c.id} style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:12, padding:'12px 20px', display:'flex', alignItems:'center', gap:14, opacity:.7 }}>
                          <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:900, color:'#1A1008', minWidth:50 }}>#{String(c.numero).padStart(4,'0')}</div>
                          <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20, background:s.bg, color:s.text }}>{s.label}</span>
                          <div style={{ flex:1, fontSize:13, color:'#8A6A50', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {c.lignes_commande?.map(l=>l.nom_plat).join(', ')}
                          </div>
                          <div style={{ fontWeight:700, fontSize:14, color:'#1A1008' }}>{c.montant_total.toLocaleString('fr-FR')} F</div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── STATS ── */}
          {onglet === 'stats' && stats && (
            <>
              {/* Résumé */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }}>
                {[
                  { label:"Aujourd'hui", s:stats.aujourd_hui },
                  { label:'Cette semaine', s:stats.semaine },
                  { label:'Ce mois', s:stats.mois },
                ].map(({label,s},i) => (
                  <div key={i} className="stat-card" style={{ animationDelay:`${i*.08}s` }}>
                    <div style={{ fontSize:12, color:'#B0906A', marginBottom:8, fontWeight:500 }}>{label}</div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:28, fontWeight:900, color:couleur, marginBottom:4 }}>{s.montant.toLocaleString('fr-FR')} F</div>
                    <div style={{ fontSize:12, color:'#B0906A' }}>{s.count} commande{s.count>1?'s':''}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {/* Graphique */}
                <div style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:16, padding:24 }}>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:20 }}>Revenus — 7 derniers jours</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
                    {stats.evolution.map((jour,i) => {
                      const h = maxMontant > 0 ? Math.max((jour.montant/maxMontant)*100, 4) : 4
                      const today = i === stats.evolution.length - 1
                      return (
                        <div key={jour.date} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                          {jour.montant > 0 && <span style={{ fontSize:9, color:'#B0906A' }}>{Math.round(jour.montant/1000)}k</span>}
                          <div style={{ width:'100%', borderRadius:'6px 6px 0 0', background: today ? couleur : couleur+'40', minHeight:4, height:`${h}%`, transition:'height .8s ease' }} />
                          <span style={{ fontSize:10, color:'#B0906A', textAlign:'center', lineHeight:1.2 }}>{jour.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Top plats */}
                <div style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:16, padding:24 }}>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:20 }}>Top plats ce mois</div>
                  {stats.top_plats.length === 0 ? (
                    <p style={{ color:'#B0906A', fontSize:14, textAlign:'center', paddingTop:20 }}>Pas encore de données</p>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                      {stats.top_plats.map((plat,i) => (
                        <div key={plat.nom} style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:900, color:'#EDE4D8', width:24 }}>#{i+1}</span>
                          <span style={{ fontSize:13, fontWeight:500, color:'#1A1008', minWidth:100, flex:1 }}>{plat.nom}</span>
                          <div style={{ flex:2, height:6, background:'#F5EDE0', borderRadius:3, overflow:'hidden' }}>
                            <div style={{ height:'100%', background:couleur, borderRadius:3, width:`${(plat.quantite/stats.top_plats[0].quantite)*100}%`, transition:'width .8s ease' }} />
                          </div>
                          <span style={{ fontSize:12, color:'#B0906A', minWidth:50, textAlign:'right' }}>{plat.quantite} vendus</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Répartition modes */}
                <div style={{ background:'white', border:'1px solid #EDE4D8', borderRadius:16, padding:24, gridColumn:'span 2' }}>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008', marginBottom:20 }}>Répartition par mode (aujourd'hui)</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
                    {stats.par_mode.map(m => {
                      const total = stats.aujourd_hui.count || 1
                      const pct = Math.round((m.count/total)*100)
                      const icons = { sur_place:'🪑', a_emporter:'🥡', livraison:'🛵' }
                      const labels = { sur_place:'Sur place', a_emporter:'À emporter', livraison:'Livraison' }
                      return (
                        <div key={m.mode} style={{ background:'#FBF7F2', borderRadius:12, padding:16 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                            <span style={{ fontSize:14 }}>{icons[m.mode]} {labels[m.mode]}</span>
                            <span style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:couleur }}>{pct}%</span>
                          </div>
                          <div style={{ height:6, background:'#EDE4D8', borderRadius:3, overflow:'hidden' }}>
                            <div style={{ height:'100%', background:couleur, borderRadius:3, width:`${pct}%` }} />
                          </div>
                          <div style={{ fontSize:12, color:'#B0906A', marginTop:6 }}>{m.count} commande{m.count>1?'s':''}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}