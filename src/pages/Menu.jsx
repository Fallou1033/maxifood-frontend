import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, RESTAURANT_ID } from '../lib/api'
import { usePanier } from '../context/PanierContext'

export default function Menu() {
  const [menu, setMenu] = useState([])
  const [categorieActive, setCategorieActive] = useState('all')
  const [loading, setLoading] = useState(true)
  const { ajouterPlat, nbArticles, total } = usePanier()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/menu/${RESTAURANT_ID}`)
      .then(res => setMenu(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const platsAffiches = categorieActive === 'all'
    ? menu.flatMap(c => c.plats)
    : menu.find(c => c.id === categorieActive)?.plats || []

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-stone-400 hover:text-stone-700">
            ← Retour
          </button>
          <h2 className="font-semibold text-stone-800">Menu</h2>
          <div className="w-16" />
        </div>
      </div>

      {/* Filtres catégories */}
      <div className="bg-white border-b border-stone-100 px-4 py-3 sticky top-14 z-10 overflow-x-auto">
        <div className="max-w-lg mx-auto flex gap-2 min-w-max">
          <button
            onClick={() => setCategorieActive('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categorieActive === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tout
          </button>
          {menu.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategorieActive(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categorieActive === cat.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Plats */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && platsAffiches.length === 0 && (
          <p className="text-center text-stone-400 py-12">Aucun plat disponible</p>
        )}

        {!loading && platsAffiches.map(plat => (
          <div key={plat.id} className="bg-white border border-stone-100 rounded-2xl p-4 flex gap-3 items-center">
            {plat.image_url ? (
              <img src={plat.image_url} alt={plat.nom}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 text-2xl">
                🍽
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-stone-800 truncate">{plat.nom}</p>
                {plat.est_populaire && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    ★ Populaire
                  </span>
                )}
              </div>
              {plat.description && (
                <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{plat.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <p className="font-bold text-stone-800 text-sm">
                {plat.prix.toLocaleString('fr-FR')} F
              </p>
              <button
                onClick={() => ajouterPlat(plat)}
                className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-lg hover:bg-orange-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Barre panier flottante */}
      {nbArticles > 0 && (
        <div className="fixed bottom-4 left-0 right-0 px-4 z-20">
          <Link to="/panier"
            className="max-w-lg mx-auto flex items-center justify-between bg-orange-600 text-white px-5 py-4 rounded-2xl shadow-lg">
            <span className="bg-orange-700 text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
              {nbArticles}
            </span>
            <span className="font-semibold">Voir le panier</span>
            <span className="font-bold">{total.toLocaleString('fr-FR')} F</span>
          </Link>
        </div>
      )}
    </div>
  )
}
