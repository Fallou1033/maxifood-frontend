import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const COULEURS_PRESET = [
  '#D85A30', '#1B75BB', '#1D9E75', '#9333EA',
  '#DC2626', '#D97706', '#059669', '#2563EB',
]

export default function Parametres() {
  const { gerant } = useAuth()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/parametres')
      .then(res => setForm(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sauvegarder = async () => {
    setSaving(true)
    setMessage('')
    try {
      await api.put('/parametres', form)
      setMessage('✅ Modifications sauvegardées !')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-stone-400 hover:text-stone-700 text-sm">← Dashboard</Link>
          <h2 className="font-semibold text-stone-800">Paramètres</h2>
          <button onClick={sauvegarder} disabled={saving}
            className="bg-orange-600 text-white text-sm px-4 py-1.5 rounded-lg disabled:opacity-60 hover:bg-orange-700">
            {saving ? '...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {message && (
          <div className={`p-3 rounded-xl text-sm text-center font-medium ${
            message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}>{message}</div>
        )}

        {/* Aperçu couleur */}
        <div className="rounded-2xl p-5 text-white flex items-center gap-4 transition-colors"
          style={{ background: form?.couleur_principale || '#D85A30' }}>
          {form?.logo_url ? (
            <img src={form.logo_url} alt="logo" className="w-14 h-14 rounded-xl object-cover"/>
          ) : (
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🍔</div>
          )}
          <div>
            <p className="font-bold text-xl">{form?.nom || 'Nom du restaurant'}</p>
            <p className="text-sm opacity-80">{form?.slogan || 'Votre slogan'}</p>
          </div>
        </div>

        {/* Infos générales */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Informations</p>
          {[
            { label:'Nom du restaurant', key:'nom', type:'text', placeholder:'Maxi-food' },
            { label:'Slogan', key:'slogan', type:'text', placeholder:'Le goût de Dakar...' },
            { label:'Adresse', key:'adresse', type:'text', placeholder:'Plateau, Dakar' },
            { label:'Téléphone', key:'telephone', type:'tel', placeholder:'+221 77 000 00 00' },
            { label:'Email', key:'email', type:'email', placeholder:'contact@restaurant.sn' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs text-stone-500 mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                value={form?.[f.key] || ''}
                onChange={e => setForm({...form, [f.key]: e.target.value})}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"/>
            </div>
          ))}
        </div>

        {/* Horaires */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Horaires d'ouverture</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Ouverture</label>
              <input type="time" value={form?.heure_ouverture?.slice(0,5) || '08:00'}
                onChange={e => setForm({...form, heure_ouverture: e.target.value})}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"/>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Fermeture</label>
              <input type="time" value={form?.heure_fermeture?.slice(0,5) || '23:00'}
                onChange={e => setForm({...form, heure_fermeture: e.target.value})}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"/>
            </div>
          </div>
        </div>

        {/* Couleur */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Couleur principale</p>
          <div className="flex gap-3 flex-wrap">
            {COULEURS_PRESET.map(c => (
              <button key={c} onClick={() => setForm({...form, couleur_principale: c})}
                className="w-9 h-9 rounded-full transition-all"
                style={{
                  background: c,
                  outline: form?.couleur_principale === c ? `3px solid ${c}` : 'none',
                  outlineOffset: '2px'
                }}/>
            ))}
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">Couleur personnalisée (hex)</label>
            <div className="flex gap-2">
              <input type="color" value={form?.couleur_principale || '#D85A30'}
                onChange={e => setForm({...form, couleur_principale: e.target.value})}
                className="w-12 h-10 border border-stone-200 rounded-lg cursor-pointer"/>
              <input type="text" value={form?.couleur_principale || ''}
                onChange={e => setForm({...form, couleur_principale: e.target.value})}
                placeholder="#D85A30"
                className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Logo</p>
          <p className="text-xs text-stone-400">Coller l'URL de votre logo (hébergé sur Supabase Storage, Cloudinary, etc.)</p>
          <input type="url" placeholder="https://..." value={form?.logo_url || ''}
            onChange={e => setForm({...form, logo_url: e.target.value})}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"/>
        </div>

        <button onClick={sauvegarder} disabled={saving}
          className="w-full bg-orange-600 text-white py-4 rounded-2xl font-semibold disabled:opacity-60 hover:bg-orange-700">
          {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  )
}
