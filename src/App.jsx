import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PanierProvider } from './context/PanierContext'

import Accueil       from './pages/Accueil'
import Menu          from './pages/Menu'
import Panier        from './pages/Panier'
import Paiement      from './pages/Paiement'
import SuiviCommande from './pages/SuiviCommande'
import TablePage     from './pages/TablePage'

import Login         from './pages/Login'
import Dashboard     from './pages/Dashboard'
import GestionMenu   from './pages/GestionMenu'
import QRCodes       from './pages/QRCodes'
import Historique    from './pages/Historique'
import Parametres    from './pages/Parametres'

function RouteProtegee({ children }) {
  const { gerant, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center text-stone-400">Chargement...</div>
  return gerant ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <PanierProvider>
        <BrowserRouter>
          <Routes>
            {/* Client */}
            <Route path="/"                      element={<Accueil />} />
            <Route path="/menu"                  element={<Menu />} />
            <Route path="/panier"                element={<Panier />} />
            <Route path="/paiement/:commande_id" element={<Paiement />} />
            <Route path="/commande/:id"          element={<SuiviCommande />} />
            <Route path="/table/:numero"         element={<TablePage />} />

            {/* Gérant */}
            <Route path="/login"                    element={<Login />} />
            <Route path="/dashboard"                element={<RouteProtegee><Dashboard /></RouteProtegee>} />
            <Route path="/dashboard/menu"           element={<RouteProtegee><GestionMenu /></RouteProtegee>} />
            <Route path="/dashboard/qrcodes"        element={<RouteProtegee><QRCodes /></RouteProtegee>} />
            <Route path="/dashboard/historique"     element={<RouteProtegee><Historique /></RouteProtegee>} />
            <Route path="/dashboard/parametres"     element={<RouteProtegee><Parametres /></RouteProtegee>} />
          </Routes>
        </BrowserRouter>
      </PanierProvider>
    </AuthProvider>
  )
}
