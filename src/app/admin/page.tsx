'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Order = {
  id: string; card_type: string; quantity: number; total_amount: number; status: string; created_at: string
  customers: { email: string; full_name: string | null } | null
  profiles: { slug: string } | null
  shipments: { tracking_number: string | null; carrier: string | null } | null
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },{ value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },{ value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },{ value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  pending:'#EF9F27',paid:'#00E5FF',in_production:'#7B61FF',programmed:'#7B61FF',
  shipped:'#639922',delivered:'#1D9E75',cancelled:'#E24B4A',
}

const ADMIN_EMAIL = 'synqotap@gmail.com'

export default function AdminPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [selected, setSelected] = useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tracking, setTracking] = useState({ number: '', carrier: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = '/login'
        return
      }
      setAuthChecked(true)
      loadOrders()
    }
    checkAuth()
  }, [])

  async function loadOrders() {
    const { data } = await supabase.from('orders').select(`id,card_type,quantity,total_amount,status,created_at,customers(email,full_name),profiles(slug),shipments(tracking_number,carrier,shipped_at)`).order('created_at', { ascending: false })
    setOrders((data as any) || []); setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected({ ...selected, status })
  }

  async function saveTracking() {
    if (!selected) return
    setSaving(true)
    const { data: existing } = await supabase.from('shipments').select('id').eq('order_id', selected.id).single()
    if (existing) {
      await supabase.from('shipments').update({ tracking_number: tracking.number, carrier: tracking.carrier, shipped_at: new Date().toISOString() }).eq('order_id', selected.id)
    } else {
      await supabase.from('shipments').insert({ order_id: selected.id, tracking_number: tracking.number, carrier: tracking.carrier, shipped_at: new Date().toISOString() })
    }
    await updateStatus(selected.id, 'shipped')
    setSaving(false)
    alert('Tracking saved and order marked as Shipped.')
    loadOrders()
  }

  function selectOrder(order: Order) {
    setSelected(order)
    setTracking({ number: order.shipments?.tracking_number || '', carrier: order.shipments?.carrier || '' })
    setDrawerOpen(true)
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customers?.email?.includes(search) || o.customers?.full_name?.toLowerCase().includes(search.toLowerCase()) || o.profiles?.slug?.includes(search)
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

  if (!authChecked) return (
    <div style={{background:'#07070C',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B6B80',fontFamily:'DM Sans,sans-serif'}}>
      Verifying access...
    </div>
  )

  const DetailPanel = () => !selected ? (
    <div style={{textAlign:'center',paddingTop:'60px',color:'#6B6B80',fontSize:'14px'}}>Select an order to view details</div>
  ) : (
    <>
      <div className="detail-title">{selected.customers?.full_name || 'No name'}</div>
      <div className="detail-sub">{selected.customers?.email}</div>
      <div style={{marginBottom:'16px'}}>
        <div className="detail-label">Public profile</div>
        <a href={`/c/${selected.profiles?.slug}`} target="_blank" className="url-link">/c/{selected.profiles?.slug}</a>
      </div>
      <div style={{marginBottom:'16px'}}>
        <div className="detail-label">Order</div>
        <div style={{fontSize:'14px'}}>SynqoTap {selected.card_type === 'pvc' ? 'PVC' : 'Metal'} × {selected.quantity}</div>
        <div style={{fontSize:'12px',color:'#6B6B80'}}>${selected.total_amount} USD · {new Date(selected.created_at).toLocaleDateString('en',{day:'numeric',month:'long',year:'numeric'})}</div>
      </div>
      <hr className="divider"/>
      <div style={{marginBottom:'16px'}}>
        <div className="detail-label">Change status</div>
        <select className="status-select" value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <hr className="divider"/>
      <div>
        <div className="detail-label">Add tracking</div>
        <div className="field"><label className="field-label">Carrier</label><input value={tracking.carrier} onChange={e => setTracking({...tracking, carrier: e.target.value})} placeholder="FedEx, UPS, DHL..."/></div>
        <div className="field"><label className="field-label">Tracking number</label><input value={tracking.number} onChange={e => setTracking({...tracking, number: e.target.value})} placeholder="1Z999AA10123456784"/></div>
        <button className="btn-save" onClick={saveTracking} disabled={saving || !tracking.number}>{saving ? 'Saving...' : 'Save and mark as Shipped'}</button>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:20}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .admin-badge{background:rgba(226,75,74,0.15);border:1px solid rgba(226,75,74,0.3);color:#F09595;font-size:11px;font-weight:500;padding:3px 8px;border-radius:4px}
        /* Desktop layout */
        .layout{display:grid;grid-template-columns:1fr 380px;min-height:calc(100vh - 56px)}
        .main{padding:20px;overflow-y:auto}
        .detail-desktop{background:#0E0E16;border-left:1px solid #1C1C2E;padding:24px;overflow-y:auto}
        /* Stats */
        .stat-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px}
        .stat-card{background:#0E0E16;border:1px solid #22223A;border-radius:12px;padding:14px}
        .stat-num{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;margin-bottom:4px}
        .stat-label{font-size:11px;color:#6B6B80}
        /* Toolbar */
        .toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
        input,select{background:#0E0E16;border:1px solid #22223A;border-radius:8px;padding:8px 12px;color:#F2F2F4;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;width:100%}
        input:focus,select:focus{border-color:#00E5FF}
        input::placeholder{color:#3A3A50}
        .search{flex:1;min-width:180px}
        .filter-select{width:auto;min-width:140px}
        /* Table */
        table{width:100%;border-collapse:collapse}
        th{text-align:left;font-size:11px;font-weight:500;color:#6B6B80;letter-spacing:.5px;text-transform:uppercase;padding:10px 12px;border-bottom:1px solid #1C1C2E}
        td{padding:11px 12px;border-bottom:1px solid #1C1C2E;font-size:13px;vertical-align:middle}
        tr{cursor:pointer;transition:background 0.15s}
        tr:hover td{background:#0E0E16}
        tr.active-row td{background:rgba(0,229,255,0.05)}
        .status-badge{font-size:11px;font-weight:500;padding:3px 8px;border-radius:20px;border:1px solid;white-space:nowrap}
        /* Detail shared styles */
        .detail-title{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;margin-bottom:4px}
        .detail-sub{font-size:13px;color:#6B6B80;margin-bottom:20px}
        .detail-label{font-size:11px;color:#6B6B80;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px}
        .url-link{color:#00E5FF;text-decoration:none;font-family:monospace;font-size:12px;word-break:break-all}
        .status-select{width:100%;margin-bottom:16px}
        .field{margin-bottom:12px}
        label.field-label{display:block;font-size:12px;color:#6B6B80;margin-bottom:5px}
        .btn-save{width:100%;background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:10px;border-radius:50px;border:none;cursor:pointer}
        .btn-save:hover{opacity:0.85}
        .btn-save:disabled{opacity:0.5;cursor:not-allowed}
        .divider{border:none;border-top:1px solid #1C1C2E;margin:16px 0}
        .empty{text-align:center;padding:48px;color:#6B6B80;font-size:14px}
        /* Mobile drawer */
        .drawer-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:30;backdrop-filter:blur(4px)}
        .drawer{position:fixed;bottom:0;left:0;right:0;background:#0E0E16;border-top:1px solid #1C1C2E;border-radius:20px 20px 0 0;z-index:31;padding:20px;max-height:85vh;overflow-y:auto;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1)}
        .drawer-handle{width:36px;height:4px;background:#22223A;border-radius:2px;margin:0 auto 20px}
        .drawer-close{position:absolute;top:16px;right:20px;background:none;border:none;color:#6B6B80;font-size:22px;cursor:pointer;line-height:1}
        /* Responsive */
        @media(max-width:900px){
          .layout{grid-template-columns:1fr}
          .detail-desktop{display:none}
          .stat-grid{grid-template-columns:repeat(2,1fr)}
          .drawer-overlay{display:block}
        }
        @media(min-width:901px){
          .drawer-overlay{display:none !important}
          .drawer{display:none !important}
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>

      {/* TOPBAR */}
      <div className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <a href="/" className="logo">Synqo<span>Tap</span></a>
          <span className="admin-badge">ADMIN</span>
        </div>
        <a href="/portal" style={{color:'#6B6B80',textDecoration:'none',fontSize:'13px'}}>Customer portal</a>
      </div>

      <div className="layout">
        {/* MAIN */}
        <div className="main">
          <div className="stat-grid">
            {[
              {num:stats.total,label:'Total orders',color:'#F2F2F4'},
              {num:stats.paid,label:'Paid',color:'#00E5FF'},
              {num:stats.shipped,label:'Shipped',color:'#639922'},
              {num:stats.delivered,label:'Delivered',color:'#1D9E75'},
              {num:`$${stats.revenue}`,label:'Revenue USD',color:'#EF9F27'},
            ].map((s,i)=>(
              <div key={i} className="stat-card">
                <div className="stat-num" style={{color:s.color}}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="toolbar">
            <input className="search" placeholder="Search by email, name or slug..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {loading ? <div className="empty">Loading orders...</div> : filtered.length === 0 ? <div className="empty">No orders match.</div> : (
            <table>
              <thead><tr><th>Customer</th><th>Type</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {filtered.map(order => {
                  const color = STATUS_COLORS[order.status] || '#6B6B80'
                  return (
                    <tr key={order.id} className={selected?.id === order.id ? 'active-row' : ''} onClick={() => selectOrder(order)}>
                      <td><div style={{fontWeight:500}}>{order.customers?.full_name || '—'}</div><div style={{fontSize:'11px',color:'#6B6B80'}}>{order.customers?.email}</div></td>
                      <td style={{textTransform:'uppercase',fontSize:'12px',fontWeight:500}}>{order.card_type}</td>
                      <td>${order.total_amount}</td>
                      <td><span className="status-badge" style={{color,borderColor:color+'40',background:color+'15'}}>{STATUS_OPTIONS.find(s=>s.value===order.status)?.label||order.status}</span></td>
                      <td style={{color:'#6B6B80'}}>{new Date(order.created_at).toLocaleDateString('en',{day:'numeric',month:'short'})}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* DETAIL — desktop sidebar */}
        <div className="detail-desktop">
          <DetailPanel/>
        </div>
      </div>

      {/* DETAIL — mobile bottom drawer */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" style={{transform:'translateY(0)'}} onClick={e => e.stopPropagation()}>
            <div className="drawer-handle"/>
            <button className="drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
            <DetailPanel/>
          </div>
        </div>
      )}
    </>
  )
}