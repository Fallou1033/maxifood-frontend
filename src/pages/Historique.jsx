import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const STATUTS = {
  recue:'Reçue', en_preparation:'En préparation',
  prete:'Prête', livree:'Livrée', annulee:'Annulée'
}
const STATUTS_COLORS = {
  recue:'bg-blue-100 text-blue-700', en_preparation:'bg-amber-100 text-amber-700',
  prete:'bg-green-100 text-green-700', livree:'bg-stone-100 text-stone-500',
  annulee:'bg-red-100 text-red-500'
}
const MODES = { sur_place:'🪑 Sur place', a_emporter:'🥡 Emporter', livraison:'🛵 Livraison' }

export default function Historique() {
  const { gerant } = useAuth()
  const [commandes, setCommandes] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filtres, setFiltres] = useState({ statut:'', mode:'', date_debut:'', date_fin:'' })
  const restaurantId = gerant?.restaurant?.id

  const charger = async (p = 1) => {
    if (!restaurantId) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: p, limite: 15 })
      Object.entries(filtres).forEach(([k,v]) => { if (v) params.append(k, v) })
      const res = await api.get(`/stats/${restaurantId}/historique?${params}`)
      setCommandes(res.data.commandes)
      setTotalPages(res.data.pages)
      setTotal(res.data.total)
      setPage(p)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { charger(1) }, [restaurantId])

  const appliquerFiltres = () => charger(1)
  const reinitialiser = () => {
    setFiltres({ statut:'', mode:'', date_debut:'', date_fin:'' })
    setTimeout(() => charger(1), 100)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-700 text-sm">← Dashboard</Link>
          <h2 className="font-semibold text-stone-800">Historique</h2>
          <p className="text-sm text-stone-400">{total} commande{total>1?'s':''}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-4">
        {/* Filtres */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Filtres</p>
          <div className="grid grid-cols-2 gap-3">
            <select value={filtres.statut} onChange={e=>setFiltres({...filtres,statut:e.target.value})}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Tous les statuts</option>
              {Object.entries(STATUTS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filtres.mode} onChange={e=>setFiltres({...filtres,mode:e.target.value})}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
              <option value="">Tous les modes</option>
              {Object.entries(MODES).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <input type="date" value={filtres.date_debut} onChange={e=>setFiltres({...filtres,date_debut:e.target.value})}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
            <input type="date" value={filtres.date_fin} onChange={e=>setFiltres({...filtres,date_fin:e.target.value})}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
          </div>
          <div className="flex gap-2">
            <button onClick={appliquerFiltres}
              className="flex-1 bg-orange-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-orange-700">
              Appliquer
            </button>
            <button onClick={reinitialiser}
              className="px-4 border border-stone-200 text-stone-500 py-2 rounded-xl text-sm hover:bg-stone-50">
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-2">{[1,2,3,4,5].map(i=><div key={i} className="bg-white rounded-2xl h-20 animate-pulse"/>)}</div>
        ) : commandes.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-2xl p-10 text-center text-stone-400">
            Aucune commande trouvée
          </div>
        ) : (
          <div className="space-y-2">
            {commandes.map(c => (
              <div key={c.id} className="bg-white border border-stone-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-stone-800 text-sm">
                        #{String(c.numero).padStart(4,'0')}
                      </p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUTS_COLORS[c.statut]}`}>
                        {STATUTS[c.statut]}
                      </span>
                      <span className="text-xs text-stone-400">{MODES[c.mode]}</span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(c.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})}
                      {' · '}
                      {new Date(c.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
                      {c.nom_client && ` · ${c.nom_client}`}
                    </p>
                    <p className="text-xs text-stone-500 mt-1 truncate">
                      {c.lignes_commande?.map(l=>`${l.nom_plat} ×${l.quantite}`).join(' · ')}
                    </p>
                  </div>
                  <p className="font-bold text-stone-800 flex-shrink-0">
                    {c.montant_total.toLocaleString('fr-FR')} F
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button disabled={page<=1} onClick={()=>charger(page-1)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm disabled:opacity-40 hover:bg-stone-50">
              ← Précédent
            </button>
            <span className="px-4 py-2 text-sm text-stone-500">
              {page} / {totalPages}
            </span>
            <button disabled={page>=totalPages} onClick={()=>charger(page+1)}
              className="px-4 py-2 border border-stone-200 rounded-xl text-sm disabled:opacity-40 hover:bg-stone-50">
              Suivant →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
