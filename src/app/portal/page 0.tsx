'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string
  slug: string
  display_name: string | null
  company_name: string | null
  job_title: string | null
  bio: string | null
  template: string
  is_published: boolean
  view_count: number
}

type Button = {
  id: string
  type: string
  label: string | null
  value: string
  position: number
  is_active: boolean
}

type Order = {
  id: string
  card_type: string
  quantity: number
  total_amount: number
  status: string
  created_at: string
}

const BUTTON_TYPES = [
  { type: 'phone',     label: 'Teléfono',  icon: '📞', placeholder: '+1 555 0000' },
  { type: 'whatsapp',  label: 'WhatsApp',  icon: '💬', placeholder: '+1 555 0000' },
  { type: 'email',     label: 'Email',     icon: '✉️', placeholder: 'tu@email.com' },
  { type: 'instagram', label: 'Instagram', icon: '📷', placeholder: '@usuario' },
  { type: 'linkedin',  label: 'LinkedIn',  icon: '💼', placeholder: 'usuario' },
  { type: 'facebook',  label: 'Facebook',  icon: '👥', placeholder: 'usuario' },
  { type: 'website',   label: 'Sitio web', icon: '🌐', placeholder: 'https://tusitio.com' },
  { type: 'tiktok',    label: 'TikTok',    icon: '🎵', placeholder: '@usuario' },
]

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:       { label: 'Pendiente',    color: '#EF9F27' },
  paid:          { label: 'Pagado',       color: '#00E5FF' },
  in_production: { label: 'En producción', color: '#7B61FF' },
  programmed:    { label: 'Programado',   color: '#7B61FF' },
  shipped:       { label: 'Enviado',      color: '#639922' },
  delivered:     { label: 'Entregado',    color: '#1D9E75' },
}

export default function PortalPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState<'profile' | 'buttons' | 'orders'>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [buttons, setButtons] = useState<Button[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [saved, setSaved] = useState(false)
  const [newBtn, setNewBtn] = useState({ type: 'phone', value: '', label: '' })
  const [showAddBtn, setShowAddBtn] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    const { data: customer } = await supabase
      .from('customers').select('id').eq('user_id', user.id).single()
    if (!customer) { setLoading(false); return }

    const { data: profileData } = await supabase
      .from('profiles').select('*').eq('customer_id', customer.id).single()

    const { data: buttonsData } = await supabase
      .from('profile_buttons').select('*')
      .eq('profile_id', profileData?.id)
      .order('position')

    const { data: ordersData } = await supabase
      .from('orders').select('*').eq('customer_id', customer.id)
      .order('created_at', { ascending: false })

    setProfile(profileData)
    setButtons(buttonsData || [])
    setOrders(ordersData || [])
    setLoading(false)
  }

  async function saveProfile() {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({
      display_name: profile.display_name,
      company_name: profile.company_name,
      job_title: profile.job_title,
      bio: profile.bio,
    }).eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function addButton() {
    if (!profile || !newBtn.value) return
    const position = buttons.length
    const { data } = await supabase.from('profile_buttons').insert({
      profile_id: profile.id,
      type: newBtn.type,
      value: newBtn.value,
      label: newBtn.label || null,
      position,
      is_active: true,
    }).select().single()
    if (data) setButtons([...buttons, data])
    setNewBtn({ type: 'phone', value: '', label: '' })
    setShowAddBtn(false)
  }

  async function toggleButton(id: string, is_active: boolean) {
    await supabase.from('profile_buttons').update({ is_active }).eq('id', id)
    setButtons(buttons.map(b => b.id === id ? { ...b, is_active } : b))
  }

  async function deleteButton(id: string) {
    await supabase.from('profile_buttons').delete().eq('id', id)
    setButtons(buttons.filter(b => b.id !== id))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div style={{background:'#07070C',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B6B80',fontFamily:'DM Sans,sans-serif'}}>
      Cargando tu portal...
    </div>
  )

  const profileUrl = profile ? `${window.location.origin}/c/${profile.slug}` : ''

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:10}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .logout-btn{background:none;border:1px solid #22223A;border-radius:8px;color:#6B6B80;font-size:13px;padding:6px 12px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:color 0.2s,border-color 0.2s}
        .logout-btn:hover{color:#F2F2F4;border-color:#6B6B80}
        .layout{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 56px)}
        .sidebar{background:#0E0E16;border-right:1px solid #1C1C2E;padding:24px 16px}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:14px;color:#6B6B80;cursor:pointer;transition:all 0.2s;margin-bottom:4px;border:none;background:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif}
        .nav-item:hover{color:#F2F2F4;background:#13131F}
        .nav-item.active{color:#00E5FF;background:rgba(0,229,255,0.08)}
        .main{padding:32px;max-width:760px}
        .section-title{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.5px;margin-bottom:4px}
        .section-sub{color:#6B6B80;font-size:14px;margin-bottom:28px}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:14px;padding:24px;margin-bottom:16px}
        .field{margin-bottom:16px}
        label{display:block;font-size:13px;color:#6B6B80;margin-bottom:6px}
        input,textarea,select{width:100%;background:#13131F;border:1px solid #22223A;border-radius:10px;padding:11px 14px;color:#F2F2F4;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;resize:none}
        input:focus,textarea:focus,select:focus{border-color:#00E5FF}
        input::placeholder,textarea::placeholder{color:#3A3A50}
        .btn-save{background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:11px 24px;border-radius:50px;border:none;cursor:pointer;transition:opacity 0.2s}
        .btn-save:hover{opacity:0.85}
        .btn-save:disabled{opacity:0.5}
        .btn-outline{background:transparent;color:#F2F2F4;border:1px solid #22223A;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:8px 16px;border-radius:50px;cursor:pointer;transition:all 0.2s}
        .btn-outline:hover{border-color:rgba(0,229,255,0.4);color:#00E5FF}
        .btn-danger{background:transparent;color:#F09595;border:1px solid rgba(226,75,74,0.3);font-size:12px;padding:5px 10px;border-radius:6px;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .btn-danger:hover{background:rgba(226,75,74,0.1)}
        .url-box{background:#13131F;border:1px solid #22223A;border-radius:10px;padding:12px 14px;font-family:monospace;font-size:13px;color:#00E5FF;word-break:break-all;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .copy-btn{background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.2);color:#00E5FF;font-size:12px;padding:4px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif;transition:background 0.2s}
        .copy-btn:hover{background:rgba(0,229,255,0.2)}
        .btn-row{display:flex;align-items:center;gap:10px;margin-top:20px}
        .saved-badge{background:rgba(29,158,117,0.15);border:1px solid rgba(29,158,117,0.3);color:#5DCAA5;font-size:13px;padding:6px 12px;border-radius:50px}
        .btn-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #1C1C2E}
        .btn-item:last-child{border-bottom:none}
        .btn-icon{width:36px;height:36px;border-radius:10px;background:#13131F;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .btn-info{flex:1}
        .btn-type{font-size:14px;font-weight:500;color:#F2F2F4}
        .btn-value{font-size:12px;color:#6B6B80;margin-top:2px}
        .toggle{width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0}
        .toggle.on{background:#00E5FF}
        .toggle.off{background:#22223A}
        .toggle::after{content:'';position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.2s}
        .toggle.on::after{left:18px}
        .toggle.off::after{left:2px}
        .add-btn-form{background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-top:16px}
        .add-btn-form .field{margin-bottom:12px}
        .order-item{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #1C1C2E}
        .order-item:last-child{border-bottom:none}
        .order-type{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;margin-bottom:4px}
        .order-date{font-size:12px;color:#6B6B80}
        .status-badge{font-size:12px;font-weight:500;padding:4px 10px;border-radius:50px;border:1px solid}
        .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
        .stat-card{background:#13131F;border:1px solid #22223A;border-radius:12px;padding:16px}
        .stat-num{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;color:#F2F2F4;margin-bottom:4px}
        .stat-label{font-size:12px;color:#6B6B80}
        @media(max-width:700px){.layout{grid-template-columns:1fr}.sidebar{display:none}.main{padding:20px}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>

      {/* TOPBAR */}
      <div className="topbar">
        <a href="/" className="logo">Smart<span>Card</span></a>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <button className={`nav-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            👤 Mi perfil
          </button>
          <button className={`nav-item ${tab === 'buttons' ? 'active' : ''}`} onClick={() => setTab('buttons')}>
            🔘 Mis botones
          </button>
          <button className={`nav-item ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            📦 Mis pedidos
          </button>
          {profile && (
            
            <div style={{marginTop:'auto',paddingTop:'24px'}}>
              <a href={`/c/${profile.slug}`} target="_blank" style={{display:'flex',alignItems:'center',gap:8,color:'#6B6B80',textDecoration:'none',fontSize:'13px',padding:'10px 12px',borderRadius:'10px',border:'1px solid #22223A',transition:'all 0.2s'}}
                onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,0.3)';(e.currentTarget as HTMLElement).style.color='#00E5FF'}}
                onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor='#22223A';(e.currentTarget as HTMLElement).style.color='#6B6B80'}}>
                🔗 Ver mi perfil público
              </a>
              <button className={`nav-item ${tab === 'settings' ? 'active' : ''}`} onClick={() => window.location.href = '/portal/settings'}>
  ⚙️ Cambiar contraseña
</button>
            </div>
          )}
        </div>

        {/* MAIN */}
        <div className="main">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <>
              <div className="section-title">Mi perfil</div>
              <p className="section-sub">Esta información aparece en tu tarjeta cuando alguien la escanea.</p>

              {profile && (
                <>
                  <div className="card">
                    <div style={{marginBottom:'16px'}}>
                      <div style={{fontSize:'13px',color:'#6B6B80',marginBottom:'8px'}}>Tu URL pública</div>
                      <div className="url-box">
                        <span>{profileUrl}</span>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(profileUrl)}>
                          Copiar
                        </button>
                      </div>
                    </div>

                    <div className="stat-grid">
                      <div className="stat-card">
                        <div className="stat-num">{profile.view_count}</div>
                        <div className="stat-label">Visitas totales</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-num">{buttons.filter(b => b.is_active).length}</div>
                        <div className="stat-label">Botones activos</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="field">
                      <label>Nombre completo</label>
                      <input
                        value={profile.display_name || ''}
                        onChange={e => setProfile({...profile, display_name: e.target.value})}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="field">
                      <label>Cargo / Posición</label>
                      <input
                        value={profile.job_title || ''}
                        onChange={e => setProfile({...profile, job_title: e.target.value})}
                        placeholder="CEO, Diseñador, Consultor..."
                      />
                    </div>
                    <div className="field">
                      <label>Empresa</label>
                      <input
                        value={profile.company_name || ''}
                        onChange={e => setProfile({...profile, company_name: e.target.value})}
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div className="field">
                      <label>Bio corta</label>
                      <textarea
                        rows={3}
                        value={profile.bio || ''}
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        placeholder="Una línea sobre lo que haces..."
                      />
                    </div>
                    <div className="btn-row">
                      <button className="btn-save" onClick={saveProfile} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                      {saved && <span className="saved-badge">✓ Guardado</span>}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* BUTTONS TAB */}
          {tab === 'buttons' && (
            <>
              <div className="section-title">Mis botones</div>
              <p className="section-sub">Los botones que aparecen en tu perfil cuando alguien escanea tu tarjeta.</p>

              <div className="card">
                {buttons.length === 0 && (
                  <div style={{textAlign:'center',padding:'24px 0',color:'#6B6B80',fontSize:'14px'}}>
                    No tienes botones aún. Agrega el primero abajo.
                  </div>
                )}
                {buttons.map(btn => {
                  const config = BUTTON_TYPES.find(b => b.type === btn.type)
                  return (
                    <div key={btn.id} className="btn-item">
                      <div className="btn-icon">{config?.icon}</div>
                      <div className="btn-info">
                        <div className="btn-type">{config?.label || btn.type}</div>
                        <div className="btn-value">{btn.value}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <button
                          className={`toggle ${btn.is_active ? 'on' : 'off'}`}
                          onClick={() => toggleButton(btn.id, !btn.is_active)}
                        />
                        <button className="btn-danger" onClick={() => deleteButton(btn.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {buttons.length < 8 && (
                <>
                  <button className="btn-outline" onClick={() => setShowAddBtn(!showAddBtn)}>
                    {showAddBtn ? '✕ Cancelar' : '+ Agregar botón'}
                  </button>
                  {showAddBtn && (
                    <div className="add-btn-form">
                      <div className="field">
                        <label>Tipo de botón</label>
                        <select value={newBtn.type} onChange={e => setNewBtn({...newBtn, type: e.target.value})}>
                          {BUTTON_TYPES.map(b => (
                            <option key={b.type} value={b.type}>{b.icon} {b.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>Valor</label>
                        <input
                          value={newBtn.value}
                          onChange={e => setNewBtn({...newBtn, value: e.target.value})}
                          placeholder={BUTTON_TYPES.find(b => b.type === newBtn.type)?.placeholder}
                        />
                      </div>
                      <div className="field">
                        <label>Etiqueta personalizada (opcional)</label>
                        <input
                          value={newBtn.label}
                          onChange={e => setNewBtn({...newBtn, label: e.target.value})}
                          placeholder="Ej: Llámame, Mi Instagram..."
                        />
                      </div>
                      <button className="btn-save" onClick={addButton}>
                        Agregar botón
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <>
              <div className="section-title">Mis pedidos</div>
              <p className="section-sub">Estado de tus tarjetas SmartCard.</p>

              <div className="card">
                {orders.length === 0 && (
                  <div style={{textAlign:'center',padding:'24px 0',color:'#6B6B80',fontSize:'14px'}}>
                    No tienes pedidos aún.
                  </div>
                )}
                {orders.map(order => {
                  const status = STATUS_LABELS[order.status] || { label: order.status, color: '#6B6B80' }
                  return (
                    <div key={order.id} className="order-item">
                      <div>
                        <div className="order-type">
                          SmartCard {order.card_type === 'pvc' ? 'PVC' : 'Metal'} × {order.quantity}
                        </div>
                        <div className="order-date">
                          {new Date(order.created_at).toLocaleDateString('es', { day:'numeric', month:'long', year:'numeric' })}
                          {' · '}${order.total_amount} USD
                        </div>
                      </div>
                      <div className="status-badge" style={{color: status.color, borderColor: status.color + '40', background: status.color + '15'}}>
                        {status.label}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}