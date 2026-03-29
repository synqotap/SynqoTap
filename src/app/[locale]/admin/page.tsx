'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string
  card_type: string
  quantity: number
  total_amount: number
  status: string
  created_at: string
  stripe_session_id: string | null
  customers: {
    email: string
    full_name: string | null
  } | null
  profiles: {
    slug: string
  } | null
  shipments: {
    tracking_number: string | null
    carrier: string | null
    shipped_at: string | null
  } | null
}

const STATUS_OPTIONS = [
  { value: 'pending',       label: 'Pendiente' },
  { value: 'paid',          label: 'Pagado' },
  { value: 'in_production', label: 'En producción' },
  { value: 'programmed',    label: 'Programado' },
  { value: 'shipped',       label: 'Enviado' },
  { value: 'delivered',     label: 'Entregado' },
  { value: 'cancelled',     label: 'Cancelado' },
]

const STATUS_COLORS: Record<string, string> = {
  pending:       '#EF9F27',
  paid:          '#00E5FF',
  in_production: '#7B61FF',
  programmed:    '#7B61FF',
  shipped:       '#639922',
  delivered:     '#1D9E75',
  cancelled:     '#E24B4A',
}

export default function AdminPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Order | null>(null)
  const [tracking, setTracking] = useState({ number: '', carrier: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select(`
        id, card_type, quantity, total_amount, status, created_at, stripe_session_id,
        customers ( email, full_name ),
        profiles ( slug ),
        shipments ( tracking_number, carrier, shipped_at )
      `)
      .order('created_at', { ascending: false })

    setOrders((data as any) || [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected({ ...selected, status })
  }

  async function saveTracking() {
    if (!selected) return
    setSaving(true)

    const { data: existing } = await supabase
      .from('shipments').select('id').eq('order_id', selected.id).single()

    if (existing) {
      await supabase.from('shipments').update({
        tracking_number: tracking.number,
        carrier: tracking.carrier,
        shipped_at: new Date().toISOString(),
      }).eq('order_id', selected.id)
    } else {
      await supabase.from('shipments').insert({
        order_id: selected.id,
        tracking_number: tracking.number,
        carrier: tracking.carrier,
        shipped_at: new Date().toISOString(),
      })
    }

    await updateStatus(selected.id, 'shipped')
    setSaving(false)
    alert('Tracking guardado y orden marcada como Enviada.')
    loadOrders()
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.customers?.email?.includes(search) ||
      o.customers?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.slug?.includes(search)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0),
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:10}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .admin-badge{background:rgba(226,75,74,0.15);border:1px solid rgba(226,75,74,0.3);color:#F09595;font-size:11px;font-weight:500;padding:3px 8px;border-radius:4px}
        .layout{display:grid;grid-template-columns:1fr 380px;min-height:calc(100vh - 56px);gap:0}
        .main{padding:28px;overflow-y:auto}
        .detail{background:#0E0E16;border-left:1px solid #1C1C2E;padding:24px;overflow-y:auto}
        .stat-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:24px}
        .stat-card{background:#0E0E16;border:1px solid #22223A;border-radius:12px;padding:16px}
        .stat-num{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;margin-bottom:4px}
        .stat-label{font-size:12px;color:#6B6B80}
        .toolbar{display:flex;gap:10px;margin-bottom:20px}
        input,select{background:#0E0E16;border:1px solid #22223A;border-radius:8px;padding:8px 12px;color:#F2F2F4;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s}
        input:focus,select:focus{border-color:#00E5FF}
        input::placeholder{color:#3A3A50}
        .search{flex:1}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;font-size:11px;font-weight:500;color:#6B6B80;letter-spacing:.5px;text-transform:uppercase;padding:10px 12px;border-bottom:1px solid #1C1C2E}
        td{padding:12px;border-bottom:1px solid #1C1C2E;font-size:13px;vertical-align:middle}
        tr{cursor:pointer;transition:background 0.15s}
        tr:hover td{background:#0E0E16}
        tr.active td{background:rgba(0,229,255,0.05)}
        .status-badge{font-size:11px;font-weight:500;padding:3px 8px;border-radius:20px;border:1px solid;white-space:nowrap}
        .card-type{font-weight:500;text-transform:uppercase;font-size:12px}
        .detail-title{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;margin-bottom:4px}
        .detail-sub{font-size:13px;color:#6B6B80;margin-bottom:20px}
        .detail-section{margin-bottom:20px}
        .detail-label{font-size:11px;color:#6B6B80;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
        .detail-value{font-size:14px;color:#F2F2F4;line-height:1.6}
        .url-link{color:#00E5FF;text-decoration:none;font-family:monospace;font-size:12px;word-break:break-all}
        .url-link:hover{opacity:0.7}
        .status-select{width:100%;margin-bottom:16px}
        .field{margin-bottom:12px}
        label{display:block;font-size:12px;color:#6B6B80;margin-bottom:5px}
        .btn-save{width:100%;background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:10px;border-radius:50px;border:none;cursor:pointer;transition:opacity 0.2s}
        .btn-save:hover{opacity:0.85}
        .btn-save:disabled{opacity:0.5}
        .divider{border:none;border-top:1px solid #1C1C2E;margin:16px 0}
        .empty{text-align:center;padding:48px;color:#6B6B80;font-size:14px}
        @media(max-width:900px){.layout{grid-template-columns:1fr}.detail{display:none}.stat-grid{grid-template-columns:repeat(2,1fr)}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>

      <div className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <a href="/" className="logo">Smart<span>Card</span></a>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div style={{display:'flex',gap:12}}>
          <a href="/portal" style={{color:'#6B6B80',textDecoration:'none',fontSize:'13px'}}>Portal cliente</a>
        </div>
      </div>

      <div className="layout">
        <div className="main">
          {/* STATS */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Total pedidos</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{color:'#00E5FF'}}>{stats.paid}</div>
              <div className="stat-label">Pagados</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{color:'#639922'}}>{stats.shipped}</div>
              <div className="stat-label">Enviados</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{color:'#1D9E75'}}>{stats.delivered}</div>
              <div className="stat-label">Entregados</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{color:'#EF9F27'}}>${stats.revenue}</div>
              <div className="stat-label">Ingresos USD</div>
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="toolbar">
            <input
              className="search"
              placeholder="Buscar por email, nombre o slug..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">Todos los estados</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="empty">Cargando pedidos...</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No hay pedidos que coincidan.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const color = STATUS_COLORS[order.status] || '#6B6B80'
                  return (
                    <tr
                      key={order.id}
                      className={selected?.id === order.id ? 'active' : ''}
                      onClick={() => {
                        setSelected(order)
                        setTracking({
                          number: order.shipments?.tracking_number || '',
                          carrier: order.shipments?.carrier || '',
                        })
                      }}
                    >
                      <td>
                        <div style={{fontWeight:500}}>{order.customers?.full_name || '—'}</div>
                        <div style={{fontSize:'11px',color:'#6B6B80'}}>{order.customers?.email}</div>
                      </td>
                      <td><span className="card-type">{order.card_type}</span></td>
                      <td>${order.total_amount}</td>
                      <td>
                        <span className="status-badge" style={{color,borderColor:color+'40',background:color+'15'}}>
                          {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
                        </span>
                      </td>
                      <td style={{color:'#6B6B80'}}>
                        {new Date(order.created_at).toLocaleDateString('es', {day:'numeric',month:'short'})}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* DETAIL PANEL */}
        <div className="detail">
          {!selected ? (
            <div style={{textAlign:'center',paddingTop:'60px',color:'#6B6B80',fontSize:'14px'}}>
              Selecciona un pedido para ver el detalle
            </div>
          ) : (
            <>
              <div className="detail-title">
                {selected.customers?.full_name || 'Sin nombre'}
              </div>
              <div className="detail-sub">{selected.customers?.email}</div>

              <div className="detail-section">
                <div className="detail-label">Perfil público</div>
                <a
                  href={`/c/${selected.profiles?.slug}`}
                  target="_blank"
                  className="url-link"
                >
                  /c/{selected.profiles?.slug}
                </a>
              </div>

              <div className="detail-section">
                <div className="detail-label">Pedido</div>
                <div className="detail-value">
                  SmartCard {selected.card_type === 'pvc' ? 'PVC' : 'Metal'} × {selected.quantity}<br/>
                  <span style={{color:'#6B6B80',fontSize:'12px'}}>
                    ${selected.total_amount} USD · {new Date(selected.created_at).toLocaleDateString('es', {day:'numeric',month:'long',year:'numeric'})}
                  </span>
                </div>
              </div>

              <hr className="divider"/>

              <div className="detail-section">
                <div className="detail-label">Cambiar estado</div>
                <select
                  className="status-select"
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <hr className="divider"/>

              <div className="detail-section">
                <div className="detail-label">Agregar tracking</div>
                <div className="field">
                  <label>Transportista</label>
                  <input
                    value={tracking.carrier}
                    onChange={e => setTracking({...tracking, carrier: e.target.value})}
                    placeholder="FedEx, UPS, DHL..."
                  />
                </div>
                <div className="field">
                  <label>Número de tracking</label>
                  <input
                    value={tracking.number}
                    onChange={e => setTracking({...tracking, number: e.target.value})}
                    placeholder="1Z999AA10123456784"
                  />
                </div>
                <button className="btn-save" onClick={saveTracking} disabled={saving || !tracking.number}>
                  {saving ? 'Guardando...' : 'Guardar y marcar como enviado'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}