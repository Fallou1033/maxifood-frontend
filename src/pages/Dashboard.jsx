import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { supabase } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const STATUTS = {
  recue:          { label: 'Reçue',          bg: 'bg-blue-100',  text: 'text-blue-700'  },
  en_preparation: { label: 'En préparation', bg: 'bg-amber-100', text: 'text-amber-700' },
  prete:          { label: 'Prête',          bg: 'bg-green-100', text: 'text-green-700' },
  livree:         { label: 'Livrée',         bg: 'bg-stone-100', text: 'text-stone-500' },
  annulee:        { label: 'Annulée',        bg: 'bg-red-100',   text: 'text-red-500'   },
}
const PROCHAINS = { recue:'en_preparation', en_preparation:'prete', prete:'livree' }
const MODE_LABELS = { sur_place:'🪑 Sur place', a_emporter:'🥡 À emporter', livraison:'🛵 Livraison' }

export default function Dashboard() {
  const { gerant, logout } = useAuth()
  const [commandes, setCommandes] = useState([])
  const [stats, setStats] = useState(null)
  const [onglet, setOnglet] = useState('live')
  const [loadingCmd, setLoadingCmd] = useState(true)
  const restaurantId = gerant?.restaurant?.id
  const couleur = gerant?.restaurant?.couleur_principale || '#D85A30'

  const chargerCommandes = useCallback(async () => {
    if (!restaurantId) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await api.get(`/commandes/restaurant/${restaurantId}?date=${today}`)
      setCommandes(res.data)
    } catch (err) { console.error(err) }
    finally { setLoadingCmd(false) }
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

  const actives   = commandes.filter(c => ['recue','en_preparation','prete'].includes(c.statut))
  const terminees = commandes.filter(c => ['livree','annulee'].includes(c.statut))
  const maxMontant = Math.max(...(stats?.evolution?.map(j => j.montant) || [1]))

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            <p className="font-bold text-stone-800">{gerant?.restaurant?.nom}</p>
            <p className="text-xs text-stone-400">
              {new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Link to="/dashboard/menu"       className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">Menu</Link>
            <Link to="/dashboard/qrcodes"    className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">QR</Link>
            <Link to="/dashboard/historique" className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">Historique</Link>
            <Link to="/dashboard/parametres" className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">⚙️</Link>
            <button onClick={logout} className="text-xs text-red-400 hover:text-red-600">Déco.</button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        <div className="flex gap-2">
          {[{id:'live',label:'🔴 Live'},{id:'stats',label:'📊 Stats'}].map(o => (
            <button key={o.id} onClick={() => setOnglet(o.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                onglet===o.id ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600'
              }`}>{o.label}</button>
          ))}
        </div>

        {onglet === 'live' && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label:'Commandes', value: commandes.filter(c=>c.statut!=='annulee').length },
                { label:'Revenus', value: `${commandes.filter(c=>c.statut!=='annulee').reduce((s,c)=>s+c.montant_total,0).toLocaleString('fr-FR')} F` },
                { label:'En attente', value: actives.length, alert: actives.length > 0 },
              ].map(s => (
                <div key={s.label} className={`rounded-2xl p-4 text-center ${s.alert?'bg-orange-50 border border-orange-200':'bg-white border border-stone-100'}`}>
                  <p className="text-xs text-stone-400 mb-1">{s.label}</p>
                  <p className={`font-bold text-xl ${s.alert?'text-orange-600':'text-stone-800'}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">Actives ({actives.length})</p>
              {loadingCmd ? (
                <div className="space-y-2">{[1,2].map(i=><div key={i} className="bg-white rounded-2xl h-24 animate-pulse"/>)}</div>
              ) : actives.length === 0 ? (
                <div className="bg-white border border-stone-100 rounded-2xl p-6 text-center text-stone-400 text-sm">Aucune commande en cours</div>
              ) : (
                <div className="space-y-3">
                  {actives.map(c => {
                    const s = STATUTS[c.statut]
                    const prochain = PROCHAINS[c.statut]
                    return (
                      <div key={c.id} className="bg-white border border-stone-100 rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-stone-800">
                              #{String(c.numero).padStart(4,'0')}
                              {c.nom_client && <span className="font-normal text-stone-500 ml-2 text-sm">· {c.nom_client}</span>}
                            </p>
                            <p className="text-xs text-stone-400">{MODE_LABELS[c.mode]} · {new Date(c.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</p>
                          </div>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                        </div>
                        <p className="text-sm text-stone-500 mb-3">{c.lignes_commande?.map(l=>`${l.nom_plat} ×${l.quantite}`).join(' · ')}</p>
                        {c.note_client && <p className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg mb-3">📝 {c.note_client}</p>}
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-800">{c.montant_total.toLocaleString('fr-FR')} F</p>
                          <div className="flex gap-2">
                            {c.statut==='recue' && <button onClick={()=>changerStatut(c.id,'annulee')} className="text-xs text-red-400 px-3 py-1.5 border border-red-100 rounded-lg">Annuler</button>}
                            {prochain && <button onClick={()=>changerStatut(c.id,prochain)} className="text-sm text-white px-4 py-1.5 rounded-lg" style={{background:couleur}}>→ {STATUTS[prochain].label}</button>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {terminees.length > 0 && (
              <div>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">Terminées ({terminees.length})</p>
                <div className="space-y-2">
                  {terminees.slice(0,5).map(c => (
                    <div key={c.id} className="bg-white border border-stone-100 rounded-xl px-4 py-3 flex items-center gap-3 opacity-70">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUTS[c.statut].bg} ${STATUTS[c.statut].text}`}>{STATUTS[c.statut].label}</span>
                      <p className="text-sm text-stone-600 flex-1 truncate">#{String(c.numero).padStart(4,'0')} · {c.lignes_commande?.map(l=>l.nom_plat).join(', ')}</p>
                      <p className="text-sm font-medium text-stone-700 flex-shrink-0">{c.montant_total.toLocaleString('fr-FR')} F</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {onglet === 'stats' && stats && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                {label:"Aujourd'hui", s:stats.aujourd_hui},
                {label:'Cette semaine', s:stats.semaine},
                {label:'Ce mois', s:stats.mois},
              ].map(({label,s}) => (
                <div key={label} className="bg-white border border-stone-100 rounded-2xl p-4">
                  <p className="text-xs text-stone-400 mb-1">{label}</p>
                  <p className="font-bold text-base text-stone-800">{s.montant.toLocaleString('fr-FR')} F</p>
                  <p className="text-xs text-stone-400 mt-0.5">{s.count} cmd</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-4">Revenus — 7 derniers jours</p>
              <div className="flex items-end gap-2 h-28">
                {stats.evolution.map((jour, i) => {
                  const h = maxMontant > 0 ? Math.max((jour.montant/maxMontant)*100, 4) : 4
                  const today = i === stats.evolution.length - 1
                  return (
                    <div key={jour.date} className="flex-1 flex flex-col items-center gap-1">
                      {jour.montant > 0 && <p className="text-xs text-stone-400">{Math.round(jour.montant/1000)}k</p>}
                      <div className="w-full rounded-t-lg" style={{height:`${h}%`, background: today ? couleur : couleur+'40', minHeight:'4px'}} />
                      <p className="text-xs text-stone-400 text-center leading-tight">{jour.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-4">Par mode (aujourd'hui)</p>
              {stats.par_mode.map(m => {
                const total = stats.aujourd_hui.count || 1
                const pct = Math.round((m.count/total)*100)
                return (
                  <div key={m.mode} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-stone-600">{MODE_LABELS[m.mode]}</span>
                      <span className="font-medium text-stone-800">{m.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${pct}%`, background:couleur}} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white border border-stone-100 rounded-2xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-4">Top plats ce mois</p>
              {stats.top_plats.length === 0
                ? <p className="text-stone-400 text-sm text-center py-2">Pas encore de données</p>
                : stats.top_plats.map((plat,i) => (
                    <div key={plat.nom} className="flex items-center gap-3 mb-3">
                      <span className="text-base font-bold text-stone-300 w-6">#{i+1}</span>
                      <p className="flex-1 text-sm text-stone-700">{plat.nom}</p>
                      <span className="text-sm font-bold text-stone-800">{plat.quantite} vendus</span>
                    </div>
                  ))
              }
            </div>

            <Link to="/dashboard/historique" className="block text-center border border-stone-200 text-stone-600 py-3 rounded-2xl text-sm hover:bg-stone-50">
              Voir l'historique complet →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
