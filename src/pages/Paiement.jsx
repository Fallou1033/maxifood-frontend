import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

const METHODES = [
  { id: 'wave',         label: 'Wave',         couleur: '#1B75BB', emoji: '🌊', desc: 'Paiement mobile instantané' },
  { id: 'orange_money', label: 'Orange Money',  couleur: '#FF6600', emoji: '🟠', desc: 'Paiement Orange Money' },
  { id: 'cash',         label: 'Cash',          couleur: '#3B6D11', emoji: '💵', desc: 'Payer à la réception' },
]

export default function Paiement() {
  const { commande_id } = useParams()
  const [searchParams] = useSearchParams()
  const [commande, setCommande] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingPaiement, setLoadingPaiement] = useState(null)
  const [erreur, setErreur] = useState('')

  const statutRetour = searchParams.get('paiement') // 'success' | 'echec'

  useEffect(() => {
    api.get(`/commandes/${commande_id}`)
      .then(res => setCommande(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [commande_id])

  const payer = async (methode) => {
    if (methode === 'cash') {
      // Rediriger vers suivi sans paiement en ligne
      window.location.href = `/commande/${commande_id}`
      return
    }

    setErreur('')
    setLoadingPaiement(methode)

    try {
      const endpoint = methode === 'wave' ? 'wave' : 'orange'
      const res = await api.post(`/paiements/${endpoint}/${commande_id}`)
      // Rediriger vers la page de paiement Wave ou Orange Money
      window.location.href = res.data.checkout_url
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur lors de la création du paiement')
      setLoadingPaiement(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400">Chargement...</p>
      </div>
    )
  }

  // Retour après paiement
  if (statutRetour === 'success') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-stone-800">Paiement réussi !</h2>
        <p className="text-stone-500 text-center">
          Votre commande #{commande?.numero} est confirmée. Vous allez recevoir un message de confirmation.
        </p>
        <Link to={`/commande/${commande_id}`}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold">
          Suivre ma commande →
        </Link>
      </div>
    )
  }

  if (statutRetour === 'echec') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">❌</div>
        <h2 className="text-xl font-bold text-stone-800">Paiement échoué</h2>
        <p className="text-stone-500 text-center">Le paiement n'a pas pu être traité. Réessayez.</p>
        <button
          onClick={() => window.location.href = `/paiement/${commande_id}`}
          className="bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold">
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link to={`/commande/${commande_id}`} className="text-stone-400 hover:text-stone-700">
            ← Retour
          </Link>
          <h2 className="font-semibold text-stone-800">Paiement</h2>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Récap commande */}
        {commande && (
          <div className="bg-white border border-stone-100 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-stone-800">
                  Commande #{String(commande.numero).padStart(4,'0')}
                </p>
                <p className="text-sm text-stone-400">
                  {commande.lignes_commande?.length} article(s)
                </p>
              </div>
              <p className="text-2xl font-bold text-stone-800">
                {commande.montant_total?.toLocaleString('fr-FR')} F
              </p>
            </div>
          </div>
        )}

        {/* Méthodes de paiement */}
        <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
          Choisissez votre mode de paiement
        </p>

        <div className="space-y-3">
          {METHODES.map(m => (
            <button
              key={m.id}
              onClick={() => payer(m.id)}
              disabled={!!loadingPaiement}
              className="w-full bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-4 hover:border-stone-300 transition-colors disabled:opacity-60 text-left"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: m.couleur + '15' }}
              >
                {loadingPaiement === m.id ? (
                  <span className="animate-spin text-lg">⏳</span>
                ) : (
                  m.emoji
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-800">{m.label}</p>
                <p className="text-xs text-stone-400">{m.desc}</p>
              </div>
              <svg className="w-5 h-5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {erreur && (
          <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl px-4">
            {erreur}
          </p>
        )}

        <p className="text-xs text-stone-400 text-center">
          Paiements sécurisés · Vos données sont protégées
        </p>
      </div>
    </div>
  )
}
