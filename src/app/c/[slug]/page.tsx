import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUTTON_CONFIG: Record<string, { label: string; icon: string; bg: string; href: (v: string) => string }> = {
  phone:     { label: 'Llamar',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z"/></svg>`, bg: 'rgba(34,197,94,0.15)', href: v => `tel:${v}` },
  whatsapp:  { label: 'WhatsApp',  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.613l6.058-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.382l-.36-.214-3.732.903.918-3.636-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>`, bg: 'rgba(37,211,102,0.15)', href: v => `https://wa.me/${v.replace(/\D/g,'')}` },
  email:     { label: 'Email',     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`, bg: 'rgba(99,179,237,0.15)', href: v => `mailto:${v}` },
  instagram: { label: 'Instagram', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`, bg: 'rgba(225,48,108,0.15)', href: v => `https://instagram.com/${v.replace('@','')}` },
  linkedin:  { label: 'LinkedIn',  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`, bg: 'rgba(10,102,194,0.15)', href: v => `https://linkedin.com/in/${v}` },
  facebook:  { label: 'Facebook',  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>`, bg: 'rgba(24,119,242,0.15)', href: v => `https://facebook.com/${v}` },
  website:   { label: 'Sitio web', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`, bg: 'rgba(139,92,246,0.15)', href: v => v.startsWith('http') ? v : `https://${v}` },
  tiktok:    { label: 'TikTok',    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>`, bg: 'rgba(255,0,80,0.15)', href: v => `https://tiktok.com/@${v.replace('@','')}` },
  calendly:  { label: 'Agendar cita', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, bg: 'rgba(0,107,255,0.15)', href: v => v.startsWith('http') ? v : `https://calendly.com/${v}` },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, company_name, job_title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!profile) return { title: 'Perfil no encontrado' }
  const title = profile.display_name || 'SynqoTap Profile'
  const description = [profile.job_title, profile.company_name].filter(Boolean).join(' · ')
  return { title, description: description || 'Perfil SynqoTap', openGraph: { title, description } }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: profile } = await supabase
    .from('profiles')
    .select(`id, slug, display_name, company_name, job_title, bio, logo_url, avatar_url, cover_url, accent_color, template, profile_buttons ( type, label, value, position, is_active )`)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  await supabase.rpc('increment_view', { profile_slug: slug })

  const accent = profile.accent_color || '#00E5FF'
  const initials = (profile.display_name || 'ST').split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
  const buttons = ((profile.profile_buttons || []) as Array<{ type: string; label: string | null; value: string; position: number; is_active: boolean }>)
    .filter(b => b.is_active).sort((a, b) => a.position - b.position)

  // Generate vCard for Save Contact
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.display_name || ''}`,
    profile.job_title ? `TITLE:${profile.job_title}` : '',
    profile.company_name ? `ORG:${profile.company_name}` : '',
    ...buttons.filter(b => b.type === 'phone').map(b => `TEL:${b.value}`),
    ...buttons.filter(b => b.type === 'email').map(b => `EMAIL:${b.value}`),
    ...buttons.filter(b => b.type === 'website').map(b => `URL:${b.value}`),
    'END:VCARD'
  ].filter(Boolean).join('\n')

  const vcardDataUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard)}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#07070C;--bg2:#0E0E16;--bg3:#13131F;
          --accent:${accent};--white:#F2F2F4;--muted:#6B6B80;--border:#1C1C2E;
        }
        body{background:var(--bg);color:var(--white);font-family:'DM Sans',system-ui,sans-serif;min-height:100vh;padding-bottom:60px}
        
        /* COVER */
        .cover{width:100%;height:180px;background:linear-gradient(135deg,#0E0E16,#1A1A38);position:relative;overflow:hidden}
        .cover-img{width:100%;height:100%;object-fit:cover}
        .cover-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(7,7,12,0.8))}
        
        /* PROFILE HEADER */
        .profile-header{max-width:480px;margin:0 auto;padding:0 20px;position:relative}
        .avatar-wrap{margin-top:-48px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-end}
        .avatar{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#7B61FF);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:32px;color:#fff;border:4px solid var(--bg);flex-shrink:0}
        .avatar img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:4px solid var(--bg)}
        
        /* SAVE CONTACT BTN */
        .save-btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:10px 18px;border-radius:50px;text-decoration:none;transition:opacity 0.2s;white-space:nowrap}
        .save-btn:hover{opacity:0.85}
        .save-btn svg{width:16px;height:16px;flex-shrink:0}
        
        /* INFO */
        .profile-info{max-width:480px;margin:0 auto;padding:0 20px 24px}
        .name{font-family:'Syne',sans-serif;font-weight:800;font-size:26px;letter-spacing:-0.5px;margin-bottom:4px}
        .role{font-size:15px;color:var(--accent);font-weight:500;margin-bottom:2px}
        .company{font-size:14px;color:var(--muted);margin-bottom:12px}
        .bio{font-size:14px;color:var(--muted);line-height:1.7;max-width:380px}
        
        /* BUTTONS */
        .btns-wrap{max-width:480px;margin:0 auto;padding:0 20px}
        .divider{border:none;border-top:1px solid var(--border);margin:20px 0}
        .btns{display:flex;flex-direction:column;gap:10px}
        .btn{display:flex;align-items:center;gap:14px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px 18px;text-decoration:none;color:var(--white);font-size:15px;transition:border-color 0.2s,transform 0.15s;position:relative;overflow:hidden}
        .btn:hover{border-color:color-mix(in srgb, var(--accent) 40%, transparent);transform:translateX(4px)}
        .btn:active{transform:scale(0.98)}
        .btn-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .btn-icon svg{width:20px;height:20px}
        .btn-label{flex:1;font-size:15px;font-weight:500}
        .btn-arrow{color:var(--muted);font-size:20px;transition:transform 0.2s,color 0.2s}
        .btn:hover .btn-arrow{transform:translateX(4px);color:var(--accent)}
        
        /* POWERED */
        .powered{text-align:center;margin-top:40px;font-size:12px;color:var(--muted)}
        .powered a{color:var(--accent);text-decoration:none;font-weight:500}
        
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeUp 0.4s ease both}
      `}</style>

      {/* COVER */}
      <div className="cover">
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover" className="cover-img"/>
        ) : (
          <div style={{
            position:'absolute',inset:0,
            background:`linear-gradient(135deg, color-mix(in srgb, ${accent} 20%, #07070C), #0E0E16 60%, #07070C)`
          }}/>
        )}
        <div className="cover-overlay"/>
      </div>

      {/* AVATAR + SAVE CONTACT */}
      <div className="profile-header">
        <div className="avatar-wrap">
          <div className="avatar fade-in">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name || ''}/>
            ) : initials}
          </div>
          <a href={vcardDataUrl} download={`${profile.display_name || 'contact'}.vcf`} className="save-btn fade-in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="12" y1="14" x2="12" y2="20"/>
              <line x1="9" y1="17" x2="15" y2="17"/>
            </svg>
            Guardar contacto
          </a>
        </div>
      </div>

      {/* INFO */}
      <div className="profile-info fade-in">
        {profile.display_name && <div className="name">{profile.display_name}</div>}
        {profile.job_title && <div className="role">{profile.job_title}</div>}
        {profile.company_name && <div className="company">{profile.company_name}</div>}
        {profile.bio && <div className="bio">{profile.bio}</div>}
      </div>

      {/* BUTTONS */}
      {buttons.length > 0 && (
        <div className="btns-wrap fade-in">
          <hr className="divider"/>
          <div className="btns">
            {buttons.map((btn, i) => {
              const config = BUTTON_CONFIG[btn.type]
              if (!config) return null
              return (
                <a
                  key={i}
                  href={config.href(btn.value)}
                  className="btn"
                  target={['website','instagram','linkedin','facebook','tiktok','calendly'].includes(btn.type) ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{animationDelay:`${0.1 + i * 0.05}s`}}
                >
                  <div className="btn-icon" style={{background:config.bg}} dangerouslySetInnerHTML={{__html:config.icon}}/>
                  <div className="btn-label">{btn.label || config.label}</div>
                  <span className="btn-arrow">›</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      <div className="powered">
        Creado con <a href="/">SynqoTap</a>
      </div>
    </>
  )
}