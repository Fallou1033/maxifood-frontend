import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

export default function Accueil() {
  const [restaurant, setRestaurant] = useState(null)
  const { nbArticles } = usePanier()

  useEffect(() => {
    api.get(`/restaurant/${RESTAURANT_ID}`)
      .then(res => setRestaurant(res.data))
      .catch(console.error)
  }, [])

  const couleur = restaurant?.couleur_principale || '#D85A30'

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="text-white px-4 pt-10 pb-8" style={{ background: couleur }}>
        <div className="max-w-lg mx-auto flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {restaurant?.nom || 'Chargement...'}
            </h1>
            <p className="text-sm opacity-80 mb-3">{restaurant?.slogan}</p>
            <p className="text-xs opacity-70">
              {restaurant?.adresse} · {restaurant?.heure_ouverture?.slice(0,5)} – {restaurant?.heure_fermeture?.slice(0,5)}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white p-2 rounded-xl">
              <QRCodeSVG
                value={`${window.location.origin}/menu`}
                size={72}
                fgColor={couleur}
              />
            </div>
            <p className="text-xs opacity-70 mt-1">Scanner</p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/menu"
            className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-2 hover:border-orange-300 transition-colors">
            <span className="text-2xl">🍽</span>
            <p className="font-semibold text-stone-800">Commander</p>
            <p className="text-xs text-stone-500">Voir le menu complet</p>
          </Link>
          <Link to={nbArticles > 0 ? '/panier' : '/menu'}
            className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col gap-2 hover:border-orange-300 transition-colors">
            <span className="text-2xl">🛒</span>
            <p className="font-semibold text-stone-800">
              Mon panier {nbArticles > 0 && <span className="text-orange-600">({nbArticles})</span>}
            </p>
            <p className="text-xs text-stone-500">Voir et valider</p>
          </Link>
        </div>

        {/* Contact */}
        {restaurant?.telephone && (
          <div className="bg-white border border-stone-200 rounded-2xl p-4">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-2">Contact</p>
            <a href={`tel:${restaurant.telephone}`}
              className="text-orange-600 font-medium">{restaurant.telephone}</a>
          </div>
        )}
      </div>
    </div>
  )
}
