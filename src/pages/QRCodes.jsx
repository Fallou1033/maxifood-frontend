import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function QRCodes() {
  const { gerant } = useAuth()
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const restaurantId = gerant?.restaurant?.id
  const couleur = gerant?.restaurant?.couleur_principale || '#D85A30'
  const nomRestaurant = gerant?.restaurant?.nom || 'Restaurant'

  useEffect(() => {
    if (!restaurantId) return
    api.get(`/tables/${restaurantId}`)
      .then(res => setTables(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [restaurantId])

  const imprimer = () => window.print()

  const ouvrirQRTable = (table) => {
    // Ouvre la page HTML imprimable générée par le backend
    window.open(`${import.meta.env.VITE_API_URL?.replace('/api','')}/api/qr/table/${table.id}/svg?print=0`, '_blank')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header - caché à l'impression */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 print:hidden">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-700 text-sm">
            ← Dashboard
          </Link>
          <h2 className="font-semibold text-stone-800">QR Codes des tables</h2>
          <button
            onClick={imprimer}
            className="bg-orange-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-orange-700"
          >
            🖨 Imprimer tout
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-4 print:hidden">
              {tables.length} table(s) — cliquez sur une table pour voir son QR individuellement
            </p>

            <div className="grid grid-cols-2 gap-4">
              {tables.map(table => {
                const url = `${window.location.origin}/table/${table.numero}`
                return (
                  <div
                    key={table.id}
                    className="bg-white border-2 rounded-2xl p-5 text-center cursor-pointer hover:border-orange-300 transition-colors print:break-inside-avoid"
                    style={{ borderColor: couleur + '40' }}
                    onClick={() => ouvrirQRTable(table)}
                  >
                    <p className="font-bold text-lg mb-1" style={{ color: couleur }}>
                      {nomRestaurant}
                    </p>
                    <p className="text-sm text-stone-400 mb-4">
                      Table {table.numero} · {table.capacite} pers.
                    </p>
                    <div className="flex justify-center mb-4">
                      <QRCodeSVG
                        value={url}
                        size={160}
                        fgColor={couleur}
                        bgColor="#FFFFFF"
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Scannez pour commander
                    </p>
                    <p className="text-xs text-stone-300 mt-1 break-all">{url}</p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Styles d'impression */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
        }
      `}</style>
    </div>
  )
}
