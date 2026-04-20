import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePanier } from '../context/PanierContext'
import { api, RESTAURANT_ID } from '../lib/api'

export default function TablePage() {
  const { numero } = useParams()
  const { setMode, setTableId } = usePanier()
  const navigate = useNavigate()

  useEffect(() => {
    // Retrouver l'ID de la table depuis son numéro
    const init = async () => {
      try {
        const { data: tables } = await api.get(`/tables/${RESTAURANT_ID}`)
        // Note: cet endpoint est protégé, on utilise supabase directement
      } catch (_) {}

      // Pré-sélectionner le mode "sur place" et mémoriser le numéro de table
      setMode('sur_place')
      // On stocke le numéro en attendant de récupérer l'UUID
      sessionStorage.setItem('mf_table', numero)
      navigate('/menu', { replace: true })
    }

    init()
  }, [numero, setMode, navigate])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🪑</p>
        <p className="font-semibold text-stone-700 text-lg">Table {numero}</p>
        <p className="text-stone-400 text-sm mt-1">Chargement du menu…</p>
      </div>
    </div>
  )
}
