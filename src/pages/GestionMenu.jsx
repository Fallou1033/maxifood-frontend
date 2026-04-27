import { useEffect, useState } from 'react'
import { api, RESTAURANT_ID } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import SidebarGerant from '../components/SidebarGerant'

export default function GestionMenu() {
  const { gerant } = useAuth()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const couleur = gerant?.restaurant?.couleur_principale || '#C4420A'
  const restId = gerant?.restaurant?.id || RESTAURANT_ID

  const charger = async () => {
    try {
      const res = await api.get(`/menu/${restId}`)
      setMenu(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { charger() }, [])

  const ouvrirModal = (plat = null) => {
    setForm(plat ? { ...plat } : { nom:'', description:'', prix:'', categorie_id: menu[0]?.id || '', disponible:true, est_populaire:false })
    setModal({ edit: !!plat })
  }

  const sauvegarder = async () => {
    setSaving(true)
    try {
      if (modal.edit) await api.put(`/menu/plats/${form.id}`, { ...form, prix: parseInt(form.prix) })
      else await api.post('/menu/plats', { ...form, prix: parseInt(form.prix) })
      setModal(null)
      charger()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const toggleDispo = async (plat) => {
    try {
      await api.put(`/menu/plats/${plat.id}`, { ...plat, disponible: !plat.disponible })
      charger()
    } catch (err) { console.error(err) }
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return
    try { await api.delete(`/menu/plats/${id}`); charger() }
    catch (err) { console.error(err) }
  }

  return (
    <div style={{ display:'flex', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FBF7F2', minHeight:'100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .plat-card{background:white;border:1px solid #EDE4D8;border-radius:14px;padding:16px 20px;display:flex;align-items:center;gap:16px;transition:all .3s;animation:fadeUp .4s ease both}
        .plat-card:hover{border-color:#F5D5C0;transform:translateX(3px)}
        .action-btn{font-size:12px;font-weight:500;padding:6px 14px;border-radius:8px;cursor:pointer;transition:all .2s;border:none}
        .form-input:focus{border-color:${couleur}!important;outline:none}
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      <SidebarGerant />

      <div style={{ flex:1, overflow:'auto' }}>
        {/* TOPBAR */}
        <div style={{ background:'#FBF7F2', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #EDE4D8', position:'sticky', top:0, zIndex:10 }}>
          <div>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:900, color:'#1A1008' }}>Gestion du menu</div>
            <div style={{ fontSize:12, color:'#B0906A', marginTop:2 }}>{menu.reduce((s,c) => s + (c.plats?.length||0), 0)} plats · {menu.length} catégories</div>
          </div>
          <button onClick={() => ouvrirModal()}
            style={{ background:couleur, color:'white', padding:'10px 22px', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
            + Ajouter un plat
          </button>
        </div>

        <div style={{ padding:'28px 32px' }}>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[1,2,3].map(i => <div key={i} style={{ background:'white', borderRadius:14, height:72, animation:'fadeUp .3s ease' }} />)}
            </div>
          ) : (
            menu.map(cat => (
              <div key={cat.id} style={{ marginBottom:32 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'#1A1008' }}>{cat.nom}</div>
                  <span style={{ fontSize:11, fontWeight:600, color:'#B0906A', background:'#F5EDE0', padding:'2px 10px', borderRadius:20 }}>
                    {cat.plats?.length || 0} plats
                  </span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {(cat.plats || []).map((plat, i) => (
                    <div key={plat.id} className="plat-card" style={{ animationDelay:`${i*.05}s`, opacity: plat.disponible ? 1 : 0.55 }}>
                      <div style={{ width:44, height:44, background:'#FFF0E8', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>🍽</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:14, color:'#1A1008', marginBottom:2 }}>{plat.nom}</div>
                        <div style={{ fontSize:12, color:'#B0906A' }}>{plat.description}</div>
                      </div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:couleur, minWidth:70 }}>{plat.prix?.toLocaleString('fr-FR')} F</div>
                      {plat.est_populaire && <span style={{ fontSize:10, fontWeight:700, color:'#BA7517', background:'#FFF8E8', padding:'3px 10px', borderRadius:20 }}>★ Populaire</span>}
                      {/* Toggle */}
                      <div onClick={() => toggleDispo(plat)} style={{ width:44, height:24, borderRadius:12, background: plat.disponible ? '#1D9E75' : '#EDE4D8', position:'relative', cursor:'pointer', transition:'background .3s', flexShrink:0 }}>
                        <div style={{ position:'absolute', top:3, left: plat.disponible ? 23 : 3, width:18, height:18, background:'white', borderRadius:'50%', transition:'left .3s', boxShadow:'0 1px 4px rgba(0,0,0,.15)' }} />
                      </div>
                      <button className="action-btn" onClick={() => ouvrirModal(plat)} style={{ background:'#EBF4FF', color:'#185FA5' }}>Modifier</button>
                      <button className="action-btn" onClick={() => supprimer(plat.id)} style={{ background:'#FFF0F0', color:'#C4320A' }}>Suppr.</button>
                    </div>
                  ))}
                  {(!cat.plats || cat.plats.length === 0) && (
                    <div style={{ background:'white', border:'1px dashed #EDE4D8', borderRadius:12, padding:'20px', textAlign:'center', color:'#B0906A', fontSize:13 }}>
                      Aucun plat dans cette catégorie
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div style={{ background:'#FBF7F2', borderRadius:20, width:'100%', maxWidth:480, padding:32, maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:'#1A1008', marginBottom:24 }}>
              {modal.edit ? 'Modifier le plat' : 'Ajouter un plat'}
            </div>
            {[
              { label:'Nom du plat *', key:'nom', type:'text', placeholder:'Burger Maxi' },
              { label:'Description', key:'description', type:'text', placeholder:'Double steak, cheddar...' },
              { label:'Prix en FCFA *', key:'prix', type:'number', placeholder:'3500' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', display:'block', marginBottom:6, letterSpacing:'.04em', textTransform:'uppercase' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]||''}
                  onChange={e => setForm({...form,[f.key]:e.target.value})}
                  className="form-input"
                  style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:10, padding:'11px 14px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", background:'white', color:'#1A1008' }} />
              </div>
            ))}
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#8A6A50', display:'block', marginBottom:6, letterSpacing:'.04em', textTransform:'uppercase' }}>Catégorie</label>
              <select value={form.categorie_id||''} onChange={e => setForm({...form,categorie_id:e.target.value})}
                className="form-input"
                style={{ width:'100%', border:'1.5px solid #EDE4D8', borderRadius:10, padding:'11px 14px', fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", background:'white', color:'#1A1008', cursor:'pointer' }}>
                {menu.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', marginBottom:20, fontSize:14, color:'#1A1008' }}>
              <input type="checkbox" checked={form.est_populaire||false} onChange={e => setForm({...form,est_populaire:e.target.checked})} />
              Marquer comme populaire ★
            </label>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={() => setModal(null)} style={{ flex:1, border:'1.5px solid #EDE4D8', background:'white', color:'#8A6A50', padding:'12px', borderRadius:10, fontSize:14, cursor:'pointer' }}>Annuler</button>
              <button onClick={sauvegarder} disabled={saving || !form.nom || !form.prix}
                style={{ flex:1, background:couleur, color:'white', padding:'12px', borderRadius:10, fontSize:14, fontWeight:600, border:'none', cursor:'pointer', opacity: saving || !form.nom || !form.prix ? .6 : 1 }}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}