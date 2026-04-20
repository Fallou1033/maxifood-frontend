import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function GestionMenu() {
  const { gerant } = useAuth()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { type: 'plat'|'categorie', data?: {...} }
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const chargerMenu = async () => {
    const restId = gerant?.restaurant?.id || RESTAURANT_ID
    try {
      const res = await api.get(`/menu/${restId}`)
      setMenu(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { chargerMenu() }, [])

  const ouvrirModalPlat = (plat = null) => {
    setForm(plat ? { ...plat } : { nom: '', description: '', prix: '', categorie_id: menu[0]?.id || '', disponible: true, est_populaire: false })
    setModal({ type: 'plat', edit: !!plat })
  }

  const sauvegarderPlat = async () => {
    setSaving(true)
    try {
      if (modal.edit) {
        await api.put(`/menu/plats/${form.id}`, form)
      } else {
        await api.post('/menu/plats', { ...form, prix: parseInt(form.prix) })
      }
      setModal(null)
      chargerMenu()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const toggleDisponible = async (plat) => {
    try {
      await api.put(`/menu/plats/${plat.id}`, { ...plat, disponible: !plat.disponible })
      chargerMenu()
    } catch (err) {
      console.error(err)
    }
  }

  const supprimerPlat = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return
    try {
      await api.delete(`/menu/plats/${id}`)
      chargerMenu()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-700 text-sm">
            ← Dashboard
          </Link>
          <h2 className="font-semibold text-stone-800">Gestion du menu</h2>
          <button
            onClick={() => ouvrirModalPlat()}
            className="bg-orange-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-orange-700"
          >
            + Plat
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />)}
          </div>
        ) : (
          menu.map(cat => (
            <div key={cat.id} className="mb-6">
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">
                {cat.nom} ({cat.plats?.length || 0} plats)
              </p>
              <div className="space-y-2">
                {(cat.plats || []).map(plat => (
                  <div key={plat.id}
                    className={`bg-white border rounded-2xl p-4 flex items-center gap-3 ${
                      plat.disponible ? 'border-stone-100' : 'border-stone-100 opacity-50'
                    }`}>
                    <div className="flex-1">
                      <p className="font-medium text-stone-800 text-sm">{plat.nom}</p>
                      <p className="text-xs text-stone-400">
                        {plat.prix?.toLocaleString('fr-FR')} F
                        {plat.est_populaire && ' · ★ Populaire'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Toggle disponible */}
                      <button
                        onClick={() => toggleDisponible(plat)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          plat.disponible ? 'bg-green-400' : 'bg-stone-200'
                        } relative`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                          plat.disponible ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                      <button
                        onClick={() => ouvrirModalPlat(plat)}
                        className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => supprimerPlat(plat.id)}
                        className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                      >
                        Suppr.
                      </button>
                    </div>
                  </div>
                ))}
                {(!cat.plats || cat.plats.length === 0) && (
                  <p className="text-xs text-stone-300 py-2 text-center">Aucun plat dans cette catégorie</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal plat */}
      {modal?.type === 'plat' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="font-semibold text-stone-800">
              {modal.edit ? 'Modifier le plat' : 'Ajouter un plat'}
            </h3>

            <input
              type="text"
              placeholder="Nom du plat *"
              value={form.nom || ''}
              onChange={e => setForm({...form, nom: e.target.value})}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
            <textarea
              placeholder="Description"
              value={form.description || ''}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={2}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400"
            />
            <input
              type="number"
              placeholder="Prix en FCFA *"
              value={form.prix || ''}
              onChange={e => setForm({...form, prix: e.target.value})}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
            <select
              value={form.categorie_id || ''}
              onChange={e => setForm({...form, categorie_id: e.target.value})}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            >
              {menu.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>

            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.est_populaire || false}
                onChange={e => setForm({...form, est_populaire: e.target.checked})}
                className="rounded"
              />
              Marquer comme populaire
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl text-sm hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                onClick={sauvegarderPlat}
                disabled={saving || !form.nom || !form.prix}
                className="flex-1 bg-orange-600 text-white py-2.5 rounded-xl text-sm hover:bg-orange-700 disabled:opacity-60"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
