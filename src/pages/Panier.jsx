import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

const MODES = [
  { id: 'sur_place',   label: 'Sur place',   emoji: '🪑' },
  { id: 'a_emporter',  label: 'À emporter',  emoji: '🥡' },
  { id: 'livraison',   label: 'Livraison',   emoji: '🛵' },
]

export default function Panier() {
  const { lignes, mode, setMode, modifierQuantite, viderPanier, total, tableId } = usePanier()
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')
  const navigate = useNavigate()

  const passerCommande = async () => {
    if (lignes.length === 0) return
    setErreur('')
    setLoading(true)

    try {
      const payload = {
        restaurant_id: RESTAURANT_ID,
        table_id: tableId || null,
        mode,
        lignes: lignes.map(l => ({
          plat_id: l.plat_id,
          quantite: l.quantite,
        })),
        nom_client: nom || null,
        telephone_client: telephone || null,
        adresse_livraison: mode === 'livraison' ? adresse : null,
        note_client: note || null,
      }

      const res = await api.post('/commandes', payload)
      viderPanier()
      navigate(`/commande/${res.data.id}`)
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur lors de la commande')
    } finally {
      setLoading(false)
    }
  }

  if (lignes.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-5xl">🛒</p>
        <p className="font-semibold text-stone-700 text-lg">Votre panier est vide</p>
        <Link to="/menu"
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-medium">
          Voir le menu
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-stone-400 hover:text-stone-700">
            ← Retour
          </button>
          <h2 className="font-semibold text-stone-800">Mon panier</h2>
          <button onClick={viderPanier} className="text-xs text-red-400 hover:text-red-600">
            Vider
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Mode de commande */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">
            Comment souhaitez-vous commander ?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  mode === m.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">
            Articles
          </p>
          <div className="space-y-3">
            {lignes.map(ligne => (
              <div key={ligne.plat_id} className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium text-stone-800 text-sm">{ligne.nom}</p>
                  <p className="text-xs text-stone-400">
                    {ligne.prix.toLocaleString('fr-FR')} F / unité
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => modifierQuantite(ligne.plat_id, ligne.quantite - 1)}
                    className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200 font-bold"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-semibold text-stone-800 text-sm">
                    {ligne.quantite}
                  </span>
                  <button
                    onClick={() => modifierQuantite(ligne.plat_id, ligne.quantite + 1)}
                    className="w-7 h-7 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 font-bold"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-stone-800 text-sm w-20 text-right">
                  {(ligne.prix * ligne.quantite).toLocaleString('fr-FR')} F
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Infos client */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
            Vos informations (facultatif)
          </p>
          <input
            type="text"
            placeholder="Votre prénom"
            value={nom}
            onChange={e => setNom(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
          <input
            type="tel"
            placeholder="Téléphone (pour le suivi)"
            value={telephone}
            onChange={e => setTelephone(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
          {mode === 'livraison' && (
            <input
              type="text"
              placeholder="Adresse de livraison"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              required
            />
          )}
          <textarea
            placeholder="Note pour le restaurant..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Récapitulatif */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-stone-500 text-sm">Sous-total</span>
            <span className="text-stone-700 text-sm">{total.toLocaleString('fr-FR')} F</span>
          </div>
          {mode === 'livraison' && (
            <div className="flex justify-between mb-2">
              <span className="text-stone-500 text-sm">Livraison</span>
              <span className="text-stone-700 text-sm">500 F</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-stone-100">
            <span className="font-semibold text-stone-800">Total</span>
            <span className="font-bold text-stone-800 text-lg">
              {(total + (mode === 'livraison' ? 500 : 0)).toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>

        {erreur && (
          <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">{erreur}</p>
        )}
      </div>

      {/* Bouton commander fixe */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-20">
        <button
          onClick={passerCommande}
          disabled={loading}
          className="max-w-lg mx-auto flex items-center justify-center bg-orange-600 text-white w-full py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-60 hover:bg-orange-700 transition-colors"
        >
          {loading ? 'Envoi en cours...' : 'Confirmer la commande →'}
        </button>
      </div>
    </div>
  )
}
