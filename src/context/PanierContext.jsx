import { createContext, useContext, useState, useCallback } from 'react'

const PanierContext = createContext(null)

export function PanierProvider({ children }) {
  const [lignes, setLignes] = useState([])
  const [mode, setMode] = useState('sur_place')
  const [tableId, setTableId] = useState(null)

  const ajouterPlat = useCallback((plat, quantite = 1, note = '') => {
    setLignes(prev => {
      const existant = prev.find(l => l.plat_id === plat.id)
      if (existant) {
        return prev.map(l =>
          l.plat_id === plat.id
            ? { ...l, quantite: l.quantite + quantite }
            : l
        )
      }
      return [...prev, {
        plat_id: plat.id,
        nom: plat.nom,
        prix: plat.prix,
        quantite,
        note
      }]
    })
  }, [])

  const modifierQuantite = useCallback((platId, quantite) => {
    if (quantite <= 0) {
      setLignes(prev => prev.filter(l => l.plat_id !== platId))
    } else {
      setLignes(prev => prev.map(l =>
        l.plat_id === platId ? { ...l, quantite } : l
      ))
    }
  }, [])

  const viderPanier = useCallback(() => setLignes([]), [])

  const total = lignes.reduce((sum, l) => sum + l.prix * l.quantite, 0)
  const nbArticles = lignes.reduce((sum, l) => sum + l.quantite, 0)

  return (
    <PanierContext.Provider value={{
      lignes, mode, tableId,
      setMode, setTableId,
      ajouterPlat, modifierQuantite, viderPanier,
      total, nbArticles
    }}>
      {children}
    </PanierContext.Provider>
  )
}

export const usePanier = () => useContext(PanierContext)
