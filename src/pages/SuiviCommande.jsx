import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { supabase } from '../lib/api'

const ETAPES = [
  { statut: 'recue',          label: 'Commande reçue',       emoji: '✅' },
  { statut: 'en_preparation', label: 'En préparation',        emoji: '👨‍🍳' },
  { statut: 'prete',          label: 'Prête / En livraison',  emoji: '🛵' },
  { statut: 'livree',         label: 'Livrée',                emoji: '🎉' },
]

const ORDRE = { recue: 0, en_preparation: 1, prete: 2, livree: 3 }

export default function SuiviCommande() {
  const { id } = useParams()
  const [commande, setCommande] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Chargement initial
    api.get(`/commandes/${id}`)
      .then(res => setCommande(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))

    // Écoute temps réel via Supabase
    const channel = supabase
      .channel(`commande-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'commandes',
        filter: `id=eq.${id}`
      }, payload => {
        setCommande(prev => ({ ...prev, ...payload.new }))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-pulse text-stone-400">Chargement...</div>
      </div>
    )
  }

  if (!commande) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-600">Commande introuvable</p>
        <Link to="/" className="text-orange-600 underline">Retour à l'accueil</Link>
      </div>
    )
  }

  const etapeActuelle = ORDRE[commande.statut] ?? 0
  const estTerminee = commande.statut === 'livree'
  const estAnnulee = commande.statut === 'annulee'

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link to="/" className="text-stone-400 hover:text-stone-700 text-sm">← Accueil</Link>
          <h2 className="font-semibold text-stone-800">Suivi commande</h2>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Numéro & statut */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 text-center">
          <p className="text-stone-400 text-sm mb-1">Commande</p>
          <p className="text-3xl font-bold text-stone-800 mb-3">
            #{String(commande.numero).padStart(4, '0')}
          </p>
          {estAnnulee ? (
            <span className="bg-red-100 text-red-600 text-sm font-medium px-4 py-1.5 rounded-full">
              Annulée
            </span>
          ) : estTerminee ? (
            <span className="bg-green-100 text-green-600 text-sm font-medium px-4 py-1.5 rounded-full">
              🎉 Livrée !
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full">
              En cours…
            </span>
          )}
        </div>

        {/* Timeline */}
        {!estAnnulee && (
          <div className="bg-white border border-stone-100 rounded-2xl p-5">
            <div className="space-y-5">
              {ETAPES.map((etape, index) => {
                const fait = index <= etapeActuelle
                const enCours = index === etapeActuelle && !estTerminee

                return (
                  <div key={etape.statut} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all ${
                      fait ? 'bg-orange-600' : 'bg-stone-100'
                    } ${enCours ? 'ring-2 ring-orange-300 ring-offset-2' : ''}`}>
                      {fait ? etape.emoji : <span className="text-stone-300">○</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${fait ? 'text-stone-800' : 'text-stone-400'}`}>
                        {etape.label}
                      </p>
                      {enCours && (
                        <p className="text-xs text-orange-500 mt-0.5">En cours…</p>
                      )}
                    </div>
                    {index < ETAPES.length - 1 && (
                      <div className={`absolute ml-5 mt-10 w-0.5 h-5 ${fait ? 'bg-orange-200' : 'bg-stone-100'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Récapitulatif des articles */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-3">Détail</p>
          <div className="space-y-2">
            {commande.lignes_commande?.map(ligne => (
              <div key={ligne.id} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {ligne.nom_plat} <span className="text-stone-400">×{ligne.quantite}</span>
                </span>
                <span className="text-stone-800 font-medium">
                  {(ligne.prix_unitaire * ligne.quantite).toLocaleString('fr-FR')} F
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-stone-100 font-semibold">
              <span>Total</span>
              <span>{commande.montant_total?.toLocaleString('fr-FR')} F</span>
            </div>
          </div>
        </div>

        <Link to="/menu"
          className="block text-center bg-orange-600 text-white py-4 rounded-2xl font-semibold">
          Nouvelle commande
        </Link>
      </div>
    </div>
  )
}
