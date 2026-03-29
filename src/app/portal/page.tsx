'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  id: string; slug: string; display_name: string | null; company_name: string | null
  job_title: string | null; bio: string | null; avatar_url: string | null
  cover_url: string | null; accent_color: string | null; is_published: boolean; view_count: number
}
type Button = { id: string; type: string; label: string | null; value: string; position: number; is_active: boolean }
type Order = { id: string; card_type: string; quantity: number; total_amount: number; status: string; created_at: string }

const BUTTON_TYPES = [
  { type: 'phone',    label: 'Phone',         icon: '📞', placeholder: '+1 555 0000' },
  { type: 'whatsapp', label: 'WhatsApp',       icon: '💬', placeholder: '+1 555 0000' },
  { type: 'email',    label: 'Email',          icon: '✉️', placeholder: 'your@email.com' },
  { type: 'instagram',label: 'Instagram',      icon: '📷', placeholder: '@username' },
  { type: 'linkedin', label: 'LinkedIn',       icon: '💼', placeholder: 'username' },
  { type: 'facebook', label: 'Facebook',       icon: '👥', placeholder: 'username' },
  { type: 'tiktok',   label: 'TikTok',         icon: '🎵', placeholder: '@username' },
  { type: 'website',  label: 'Website',        icon: '🌐', placeholder: 'https://yoursite.com' },
  { type: 'calendly', label: 'Book a meeting', icon: '📅', placeholder: 'your-username or full URL' },
]

const ACCENT_COLORS = ['#00E5FF','#7B61FF','#FF6B6B','#FFD93D','#6BCB77','#FF922B','#F06595','#4DABF7']

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:       { label: 'Pending',       color: '#EF9F27' },
  paid:          { label: 'Paid',          color: '#00E5FF' },
  in_production: { label: 'In production', color: '#7B61FF' },
  programmed:    { label: 'Programmed',    color: '#7B61FF' },
  shipped:       { label: 'Shipped',       color: '#639922' },
  delivered:     { label: 'Delivered',     color: '#1D9E75' },
  cancelled:     { label: 'Cancelled',     color: '#E24B4A' },
}

const WIZARD_STEPS = [
  { title: "What's your name?",        field: 'display_name', placeholder: 'Your full name',          type: 'text' },
  { title: "What's your job title?",   field: 'job_title',    placeholder: 'CEO, Designer, Advisor...',type: 'text' },
  { title: 'What company do you work for?', field: 'company_name', placeholder: 'Company name',      type: 'text' },
  { title: 'Tell us a bit about yourself',  field: 'bio',          placeholder: 'One line about what you do...', type: 'textarea' },
]

export default function PortalPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'profile'|'buttons'|'orders'|'design'>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [buttons, setButtons] = useState<Button[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [showAddBtn, setShowAddBtn] = useState(false)
  const [newBtn, setNewBtn] = useState({ type: 'phone', value: '', label: '' })
  const [showPreview, setShowPreview] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardData, setWizardData] = useState<Record<string, string>>({})
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    const { data: customer } = await supabase.from('customers').select('id').eq('user_id', user.id).single()
    if (!customer) { setLoading(false); return }
    const { data: profileData } = await supabase.from('profiles').select('*').eq('customer_id', customer.id).single()
    const { data: buttonsData } = await supabase.from('profile_buttons').select('*').eq('profile_id', profileData?.id).order('position')
    const { data: ordersData } = await supabase.from('orders').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false })
    setProfile(profileData); setButtons(buttonsData || []); setOrders(ordersData || [])
    if (profileData && !profileData.display_name) setShowWizard(true)
    setLoading(false)
  }

  async function saveProfile() {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ display_name: profile.display_name, company_name: profile.company_name, job_title: profile.job_title, bio: profile.bio, accent_color: profile.accent_color }).eq('id', profile.id)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  async function finishWizard() {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update(wizardData).eq('id', profile.id)
    setProfile({ ...profile, ...wizardData as any }); setSaving(false); setShowWizard(false)
  }

  async function uploadImage(file: File, type: 'avatar'|'cover') {
    if (!profile) return
    if (type === 'avatar') setUploadingAvatar(true); else setUploadingCover(true)
    const ext = file.name.split('.').pop()
    const path = `${profile.id}/${type}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      const field = type === 'avatar' ? 'avatar_url' : 'cover_url'
      await supabase.from('profiles').update({ [field]: urlData.publicUrl }).eq('id', profile.id)
      setProfile({ ...profile, [field]: urlData.publicUrl })
    }
    if (type === 'avatar') setUploadingAvatar(false); else setUploadingCover(false)
  }

  async function addButton() {
    if (!profile || !newBtn.value) return
    const { data } = await supabase.from('profile_buttons').insert({ profile_id: profile.id, type: newBtn.type, value: newBtn.value, label: newBtn.label || null, position: buttons.length, is_active: true }).select().single()
    if (data) setButtons([...buttons, data])
    setNewBtn({ type: 'phone', value: '', label: '' }); setShowAddBtn(false)
  }

  async function toggleButton(id: string, is_active: boolean) {
    await supabase.from('profile_buttons').update({ is_active }).eq('id', id)
    setButtons(buttons.map(b => b.id === id ? { ...b, is_active } : b))
  }

  async function deleteButton(id: string) {
    await supabase.from('profile_buttons').delete().eq('id', id)
    setButtons(buttons.filter(b => b.id !== id))
  }

  const accent = profile?.accent_color || '#00E5FF'
  const initials = (profile?.display_name || 'ST').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
  const profileUrl = profile && typeof window !== 'undefined' ? `${window.location.origin}/c/${profile.slug}` : ''

  if (loading) return (
    <div style={{background:'#07070C',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#6B6B80',fontFamily:'DM Sans,sans-serif'}}>
      Loading your portal...
    </div>
  )

  // WIZARD
  if (showWizard) {
    const step = WIZARD_STEPS[wizardStep]
    const isLast = wizardStep === WIZARD_STEPS.length - 1
    return (
      <>
        <style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}.wiz{max-width:480px;width:100%}.wiz-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;text-align:center;margin-bottom:48px}.wiz-logo span{color:#00E5FF}.progress{display:flex;gap:6px;margin-bottom:32px}.prog-dot{flex:1;height:3px;border-radius:2px;background:#22223A;transition:background 0.3s}.prog-dot.done{background:#00E5FF}.step-label{font-size:12px;color:#6B6B80;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px}h2{font-family:'Syne',sans-serif;font-weight:800;font-size:28px;letter-spacing:-0.5px;margin-bottom:28px}input,textarea{width:100%;background:#0E0E16;border:1px solid #22223A;border-radius:12px;padding:14px 16px;color:#F2F2F4;font-size:16px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;resize:none}input:focus,textarea:focus{border-color:#00E5FF}input::placeholder,textarea::placeholder{color:#3A3A50}.actions{display:flex;gap:12px;margin-top:20px}.btn-next{flex:1;background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;padding:13px;border-radius:50px;border:none;cursor:pointer}.btn-skip{background:transparent;color:#6B6B80;font-size:14px;padding:13px 20px;border-radius:50px;border:1px solid #22223A;cursor:pointer;font-family:'DM Sans',sans-serif}`}</style>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400&display=swap" rel="stylesheet"/>
        <div className="wiz">
          <div className="wiz-logo">Synqo<span>Tap</span></div>
          <div className="progress">{WIZARD_STEPS.map((_,i) => <div key={i} className={`prog-dot ${i<=wizardStep?'done':''}`}/>)}</div>
          <div className="step-label">Step {wizardStep+1} of {WIZARD_STEPS.length}</div>
          <h2>{step.title}</h2>
          {step.type==='textarea' ? (
            <textarea rows={4} placeholder={step.placeholder} value={wizardData[step.field]||''} onChange={e=>setWizardData({...wizardData,[step.field]:e.target.value})} autoFocus/>
          ) : (
            <input type="text" placeholder={step.placeholder} value={wizardData[step.field]||''} onChange={e=>setWizardData({...wizardData,[step.field]:e.target.value})} autoFocus onKeyDown={e=>{if(e.key==='Enter'&&!isLast)setWizardStep(s=>s+1)}}/>
          )}
          <div className="actions">
            <button className="btn-skip" onClick={()=>{if(isLast)finishWizard();else setWizardStep(s=>s+1)}}>{isLast?'Skip':'Skip'}</button>
            <button className="btn-next" onClick={()=>{if(isLast)finishWizard();else setWizardStep(s=>s+1)}}>{isLast?(saving?'Saving...':'Finish and enter →'):'Continue →'}</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:56px;position:sticky;top:0;z-index:10}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .preview-btn{background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.2);color:#00E5FF;font-size:13px;padding:6px 14px;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif}
        .logout-btn{background:none;border:1px solid #22223A;border-radius:8px;color:#6B6B80;font-size:13px;padding:6px 12px;cursor:pointer;font-family:'DM Sans',sans-serif}
        .logout-btn:hover{color:#F2F2F4}
        .layout{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 56px)}
        .sidebar{background:#0E0E16;border-right:1px solid #1C1C2E;padding:24px 16px;display:flex;flex-direction:column}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;font-size:14px;color:#6B6B80;cursor:pointer;transition:all 0.2s;margin-bottom:4px;border:none;background:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif}
        .nav-item:hover{color:#F2F2F4;background:#13131F}
        .nav-item.active{color:#00E5FF;background:rgba(0,229,255,0.08)}
        .nav-bottom{margin-top:auto;display:flex;flex-direction:column;gap:8px}
        .main{padding:28px;max-width:700px}
        .section-title{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.5px;margin-bottom:4px}
        .section-sub{color:#6B6B80;font-size:14px;margin-bottom:24px}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:14px;padding:24px;margin-bottom:16px}
        .field{margin-bottom:14px}
        label{display:block;font-size:13px;color:#6B6B80;margin-bottom:6px}
        input[type=text],input[type=email],textarea,select{width:100%;background:#13131F;border:1px solid #22223A;border-radius:10px;padding:11px 14px;color:#F2F2F4;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;resize:none}
        input[type=text]:focus,textarea:focus,select:focus{border-color:#00E5FF}
        input::placeholder,textarea::placeholder{color:#3A3A50}
        .btn-save{background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;padding:11px 24px;border-radius:50px;border:none;cursor:pointer;transition:opacity 0.2s}
        .btn-save:hover{opacity:0.85}
        .btn-save:disabled{opacity:0.5}
        .btn-outline{background:transparent;color:#F2F2F4;border:1px solid #22223A;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:8px 16px;border-radius:50px;cursor:pointer;transition:all 0.2s}
        .btn-outline:hover{border-color:rgba(0,229,255,0.4);color:#00E5FF}
        .btn-danger{background:transparent;color:#F09595;border:1px solid rgba(226,75,74,0.3);font-size:12px;padding:5px 10px;border-radius:6px;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-danger:hover{background:rgba(226,75,74,0.1)}
        .btn-row{display:flex;align-items:center;gap:10px;margin-top:16px}
        .saved-badge{background:rgba(29,158,117,0.15);border:1px solid rgba(29,158,117,0.3);color:#5DCAA5;font-size:13px;padding:6px 12px;border-radius:50px}
        .url-box{background:#13131F;border:1px solid #22223A;border-radius:10px;padding:12px 14px;font-family:monospace;font-size:12px;color:#00E5FF;word-break:break-all;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
        .copy-btn{background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.2);color:#00E5FF;font-size:12px;padding:4px 10px;border-radius:6px;cursor:pointer;white-space:nowrap;font-family:'DM Sans',sans-serif}
        .stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}
        .stat-card{background:#13131F;border:1px solid #22223A;border-radius:12px;padding:16px}
        .stat-num{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;margin-bottom:4px}
        .stat-label{font-size:12px;color:#6B6B80}
        .cover-upload{width:100%;height:120px;border-radius:12px;border:2px dashed #22223A;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;background:#13131F;margin-bottom:12px}
        .cover-upload:hover{border-color:rgba(0,229,255,0.4)}
        .cover-upload img{width:100%;height:100%;object-fit:cover}
        .cover-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;font-size:13px;color:#fff}
        .cover-upload:hover .cover-overlay{opacity:1}
        .avatar-upload{width:80px;height:80px;border-radius:50%;border:2px dashed #22223A;display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;background:#13131F;flex-shrink:0}
        .avatar-upload:hover{border-color:rgba(0,229,255,0.4)}
        .avatar-upload img{width:80px;height:80px;border-radius:50%;object-fit:cover}
        .avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;font-size:11px;color:#fff;text-align:center}
        .avatar-upload:hover .avatar-overlay{opacity:1}
        .color-grid{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
        .color-dot{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:transform 0.15s;border:3px solid transparent}
        .color-dot:hover{transform:scale(1.15)}
        .color-dot.selected{border-color:#fff;transform:scale(1.1)}
        .color-input-wrap{display:flex;align-items:center;gap:10px;margin-top:10px}
        .color-preview{width:32px;height:32px;border-radius:50%;border:2px solid #22223A;flex-shrink:0}
        .btn-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #1C1C2E}
        .btn-item:last-child{border-bottom:none}
        .btn-icon-preview{width:36px;height:36px;border-radius:10px;background:#13131F;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .btn-info{flex:1}
        .btn-type{font-size:14px;font-weight:500}
        .btn-value{font-size:12px;color:#6B6B80;margin-top:2px}
        .toggle{width:36px;height:20px;border-radius:10px;border:none;cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0}
        .toggle.on{background:#00E5FF}
        .toggle.off{background:#22223A}
        .toggle::after{content:'';position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left 0.2s}
        .toggle.on::after{left:18px}
        .toggle.off::after{left:2px}
        .add-btn-form{background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-top:12px}
        .add-btn-form .field{margin-bottom:12px}
        .order-item{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid #1C1C2E}
        .order-item:last-child{border-bottom:none}
        .order-type{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;margin-bottom:4px}
        .order-date{font-size:12px;color:#6B6B80}
        .status-badge{font-size:12px;font-weight:500;padding:4px 10px;border-radius:50px;border:1px solid}
        .preview-modal{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:24px}
        .preview-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px)}
        .preview-frame{position:relative;z-index:1;width:375px;height:700px;background:#07070C;border-radius:40px;overflow:hidden;border:8px solid #1C1C2E;box-shadow:0 40px 80px rgba(0,0,0,0.8)}
        .preview-close{position:absolute;top:-16px;right:-16px;width:36px;height:36px;border-radius:50%;background:#22223A;border:none;color:#F2F2F4;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2}
        .preview-inner{width:100%;height:100%;overflow-y:auto}
        @media(max-width:700px){.layout{grid-template-columns:1fr}.sidebar{display:none}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <input type="file" ref={avatarRef} accept="image/jpeg,image/png,image/webp" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&uploadImage(e.target.files[0],'avatar')}/>
      <input type="file" ref={coverRef} accept="image/jpeg,image/png,image/webp" style={{display:'none'}} onChange={e=>e.target.files?.[0]&&uploadImage(e.target.files[0],'cover')}/>

      {/* PREVIEW MODAL */}
      {showPreview && profile && (
        <div className="preview-modal">
          <div className="preview-backdrop" onClick={()=>setShowPreview(false)}/>
          <div className="preview-frame">
            <button className="preview-close" onClick={()=>setShowPreview(false)}>✕</button>
            <div className="preview-inner">
              <div style={{width:'100%',height:'140px',background:profile.cover_url?`url(${profile.cover_url}) center/cover`:`linear-gradient(135deg,rgba(0,229,255,0.2),#0E0E16)`}}/>
              <div style={{padding:'0 16px',marginTop:'-40px',display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'12px'}}>
                <div style={{width:'80px',height:'80px',borderRadius:'50%',background:profile.avatar_url?`url(${profile.avatar_url}) center/cover`:`linear-gradient(135deg,${accent},#7B61FF)`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'24px',color:'#fff',border:'3px solid #07070C',flexShrink:0}}>
                  {!profile.avatar_url&&initials}
                </div>
                <div style={{fontSize:'11px',padding:'7px 12px',borderRadius:'50px',fontWeight:'700',fontFamily:"'Syne',sans-serif",background:accent,color:'#07070C'}}>+ Save</div>
              </div>
              <div style={{padding:'0 16px 16px'}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'20px',marginBottom:'3px'}}>{profile.display_name||'Your name'}</div>
                {profile.job_title&&<div style={{fontSize:'13px',color:accent,marginBottom:'2px'}}>{profile.job_title}</div>}
                {profile.company_name&&<div style={{fontSize:'13px',color:'#6B6B80',marginBottom:'8px'}}>{profile.company_name}</div>}
                {profile.bio&&<div style={{fontSize:'12px',color:'#6B6B80',lineHeight:'1.6'}}>{profile.bio}</div>}
              </div>
              {buttons.filter(b=>b.is_active).length>0&&(
                <div style={{padding:'0 16px'}}>
                  <div style={{borderTop:'1px solid #1C1C2E',margin:'8px 0 12px'}}/>
                  {buttons.filter(b=>b.is_active).slice(0,5).map((btn,i)=>{
                    const config=BUTTON_TYPES.find(t=>t.type===btn.type)
                    return <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',background:'#0E0E16',border:'1px solid #22223A',borderRadius:'12px',padding:'11px 14px',marginBottom:'8px',fontSize:'13px',color:'#F2F2F4'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>{config?.icon}</div>
                      <span>{btn.label||config?.label}</span>
                    </div>
                  })}
                </div>
              )}
              <div style={{textAlign:'center',padding:'24px 0 8px',fontSize:'11px',color:'#3A3A50'}}>Created with SynqoTap</div>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div className="topbar">
        <a href="/" className="logo">Synqo<span>Tap</span></a>
        <div className="topbar-right">
          <button className="preview-btn" onClick={()=>setShowPreview(true)}>👁 Preview</button>
          <button className="logout-btn" onClick={async()=>{await supabase.auth.signOut();window.location.href='/'}}>Sign out</button>
        </div>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <button className={`nav-item ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>👤 My profile</button>
          <button className={`nav-item ${tab==='design'?'active':''}`} onClick={()=>setTab('design')}>🎨 Design</button>
          <button className={`nav-item ${tab==='buttons'?'active':''}`} onClick={()=>setTab('buttons')}>🔘 Buttons</button>
          <button className={`nav-item ${tab==='orders'?'active':''}`} onClick={()=>setTab('orders')}>📦 My orders</button>
          <div className="nav-bottom">
            {profile&&<a href={`/c/${profile.slug}`} target="_blank" style={{display:'flex',alignItems:'center',gap:8,color:'#6B6B80',textDecoration:'none',fontSize:'13px',padding:'10px 12px',borderRadius:'10px',border:'1px solid #22223A'}}>🔗 View public profile</a>}
            <button className="nav-item" onClick={()=>window.location.href='/portal/settings'} style={{color:'#6B6B80'}}>⚙️ Change password</button>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">

          {/* PROFILE TAB */}
          {tab==='profile'&&profile&&(
            <>
              <div className="section-title">My profile</div>
              <p className="section-sub">Information that appears on your public card.</p>
              <div className="card">
                <div className="url-box">
                  <span>{profileUrl}</span>
                  <button className="copy-btn" onClick={()=>navigator.clipboard.writeText(profileUrl)}>Copy</button>
                </div>
                <div className="stat-grid">
                  <div className="stat-card"><div className="stat-num">{profile.view_count}</div><div className="stat-label">Total views</div></div>
                  <div className="stat-card"><div className="stat-num">{buttons.filter(b=>b.is_active).length}</div><div className="stat-label">Active buttons</div></div>
                </div>
              </div>
              <div className="card">
                <div className="field">
                  <label>Cover photo</label>
                  <div className="cover-upload" onClick={()=>coverRef.current?.click()}>
                    {profile.cover_url?<img src={profile.cover_url} alt="cover"/>:<span style={{color:'#3A3A50',fontSize:'13px'}}>{uploadingCover?'Uploading...':'+ Add cover photo'}</span>}
                    <div className="cover-overlay">{uploadingCover?'Uploading...':'📷 Change cover'}</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                  <div>
                    <label style={{fontSize:'13px',color:'#6B6B80',marginBottom:'6px',display:'block'}}>Profile photo</label>
                    <div className="avatar-upload" onClick={()=>avatarRef.current?.click()}>
                      {profile.avatar_url?<img src={profile.avatar_url} alt="avatar"/>:<span style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',background:`linear-gradient(135deg,${accent},#7B61FF)`,fontFamily:"'Syne',sans-serif",fontWeight:'800',fontSize:'20px',color:'#fff'}}>{initials}</span>}
                      <div className="avatar-overlay">{uploadingAvatar?'...':'📷'}</div>
                    </div>
                  </div>
                  <div style={{fontSize:'13px',color:'#6B6B80',lineHeight:'1.6'}}>Click image to change.<br/>Recommended: square, min 400×400px.<br/>Formats: JPG, PNG, WebP.</div>
                </div>
              </div>
              <div className="card">
                <div className="field"><label>Full name</label><input type="text" value={profile.display_name||''} onChange={e=>setProfile({...profile,display_name:e.target.value})} placeholder="Your name"/></div>
                <div className="field"><label>Job title</label><input type="text" value={profile.job_title||''} onChange={e=>setProfile({...profile,job_title:e.target.value})} placeholder="CEO, Designer..."/></div>
                <div className="field"><label>Company</label><input type="text" value={profile.company_name||''} onChange={e=>setProfile({...profile,company_name:e.target.value})} placeholder="Company name"/></div>
                <div className="field"><label>Short bio</label><textarea rows={3} value={profile.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})} placeholder="One line about what you do..."/></div>
                <div className="btn-row">
                  <button className="btn-save" onClick={saveProfile} disabled={saving}>{saving?'Saving...':'Save changes'}</button>
                  {saved&&<span className="saved-badge">✓ Saved</span>}
                </div>
              </div>
            </>
          )}

          {/* DESIGN TAB */}
          {tab==='design'&&profile&&(
            <>
              <div className="section-title">Design</div>
              <p className="section-sub">Customize the colors of your public profile.</p>
              <div className="card">
                <label>Accent color</label>
                <div className="color-grid">
                  {ACCENT_COLORS.map(c=>(
                    <div key={c} className={`color-dot ${profile.accent_color===c?'selected':''}`} style={{background:c}} onClick={()=>setProfile({...profile,accent_color:c})}/>
                  ))}
                </div>
                <div className="color-input-wrap">
                  <div className="color-preview" style={{background:profile.accent_color||'#00E5FF'}}/>
                  <input type="text" value={profile.accent_color||'#00E5FF'} onChange={e=>setProfile({...profile,accent_color:e.target.value})} placeholder="#00E5FF" style={{flex:1}}/>
                </div>
                <div className="btn-row">
                  <button className="btn-save" onClick={saveProfile} disabled={saving}>{saving?'Saving...':'Save design'}</button>
                  {saved&&<span className="saved-badge">✓ Saved</span>}
                </div>
              </div>
              <div className="card" style={{textAlign:'center',padding:'32px'}}>
                <div style={{fontSize:'13px',color:'#6B6B80',marginBottom:'16px'}}>See how your profile looks with these changes</div>
                <button className="btn-save" onClick={()=>setShowPreview(true)}>👁 Open preview</button>
              </div>
            </>
          )}

          {/* BUTTONS TAB */}
          {tab==='buttons'&&(
            <>
              <div className="section-title">My buttons</div>
              <p className="section-sub">Buttons that appear on your public profile. Maximum 8.</p>
              <div className="card">
                {buttons.length===0&&<div style={{textAlign:'center',padding:'24px',color:'#6B6B80',fontSize:'14px'}}>No buttons yet. Add your first one below.</div>}
                {buttons.map(btn=>{
                  const config=BUTTON_TYPES.find(b=>b.type===btn.type)
                  return(
                    <div key={btn.id} className="btn-item">
                      <div className="btn-icon-preview">{config?.icon}</div>
                      <div className="btn-info"><div className="btn-type">{config?.label||btn.type}</div><div className="btn-value">{btn.value}</div></div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <button className={`toggle ${btn.is_active?'on':'off'}`} onClick={()=>toggleButton(btn.id,!btn.is_active)}/>
                        <button className="btn-danger" onClick={()=>deleteButton(btn.id)}>Delete</button>
                      </div>
                    </div>
                  )
                })}
              </div>
              {buttons.length<8&&(
                <>
                  <button className="btn-outline" onClick={()=>setShowAddBtn(!showAddBtn)}>{showAddBtn?'✕ Cancel':'+ Add button'}</button>
                  {showAddBtn&&(
                    <div className="add-btn-form">
                      <div className="field"><label>Button type</label><select value={newBtn.type} onChange={e=>setNewBtn({...newBtn,type:e.target.value})}>{BUTTON_TYPES.map(b=><option key={b.type} value={b.type}>{b.icon} {b.label}</option>)}</select></div>
                      <div className="field"><label>Value</label><input type="text" value={newBtn.value} onChange={e=>setNewBtn({...newBtn,value:e.target.value})} placeholder={BUTTON_TYPES.find(b=>b.type===newBtn.type)?.placeholder}/></div>
                      <div className="field"><label>Custom label (optional)</label><input type="text" value={newBtn.label} onChange={e=>setNewBtn({...newBtn,label:e.target.value})} placeholder="e.g. Call me, My Instagram..."/></div>
                      <button className="btn-save" onClick={addButton}>Add button</button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ORDERS TAB */}
          {tab==='orders'&&(
            <>
              <div className="section-title">My orders</div>
              <p className="section-sub">Status of your SynqoTap cards.</p>
              <div className="card">
                {orders.length===0?(
                  <div style={{textAlign:'center',padding:'24px',color:'#6B6B80',fontSize:'14px'}}>No orders yet.</div>
                ):orders.map(order=>{
                  const status=STATUS_LABELS[order.status]||{label:order.status,color:'#6B6B80'}
                  return(
                    <div key={order.id} className="order-item">
                      <div>
                        <div className="order-type">SynqoTap {order.card_type==='pvc'?'PVC':'Metal'} × {order.quantity}</div>
                        <div className="order-date">{new Date(order.created_at).toLocaleDateString('en',{day:'numeric',month:'long',year:'numeric'})} · ${order.total_amount} USD</div>
                      </div>
                      <div className="status-badge" style={{color:status.color,borderColor:status.color+'40',background:status.color+'15'}}>{status.label}</div>
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