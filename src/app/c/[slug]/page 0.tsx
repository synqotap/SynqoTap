import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUTTON_CONFIG: Record<string, { label: string; emoji: string; bg: string; href: (v: string) => string }> = {
  phone:     { label: 'Llamar',    emoji: '📞', bg: 'rgba(34,197,94,0.12)',   href: v => `tel:${v}` },
  whatsapp:  { label: 'WhatsApp',  emoji: '💬', bg: 'rgba(37,211,102,0.12)',  href: v => `https://wa.me/${v.replace(/\D/g,'')}` },
  email:     { label: 'Email',     emoji: '✉️', bg: 'rgba(99,179,237,0.12)',  href: v => `mailto:${v}` },
  instagram: { label: 'Instagram', emoji: '📷', bg: 'rgba(225,48,108,0.12)',  href: v => `https://instagram.com/${v.replace('@','')}` },
  linkedin:  { label: 'LinkedIn',  emoji: '💼', bg: 'rgba(10,102,194,0.12)', href: v => `https://linkedin.com/in/${v}` },
  facebook:  { label: 'Facebook',  emoji: '👥', bg: 'rgba(24,119,242,0.12)', href: v => `https://facebook.com/${v}` },
  website:   { label: 'Sitio web', emoji: '🌐', bg: 'rgba(139,92,246,0.12)', href: v => v.startsWith('http') ? v : `https://${v}` },
  tiktok:    { label: 'TikTok',    emoji: '🎵', bg: 'rgba(255,0,80,0.12)',   href: v => `https://tiktok.com/@${v.replace('@','')}` },
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

  const title = profile.display_name || 'SmartCard Profile'
  const description = [profile.job_title, profile.company_name].filter(Boolean).join(' · ')

  return {
    title,
    description: description || 'Perfil SmartCard',
    openGraph: { title, description },
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id, slug, display_name, company_name, job_title, bio,
      logo_url, avatar_url, template,
      profile_buttons ( type, label, value, position, is_active )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  await supabase.rpc('increment_view', { profile_slug: slug })

  const initials = (profile.display_name || 'SC')
    .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()

  const buttons = ((profile.profile_buttons || []) as Array<{
    type: string; label: string | null; value: string; position: number; is_active: boolean
  }>).filter(b => b.is_active).sort((a, b) => a.position - b.position)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--bg:#07070C;--bg2:#0E0E16;--cyan:#00E5FF;--white:#F2F2F4;--muted:#6B6B80;--border:#1C1C2E}
        body{background:var(--bg);color:var(--white);font-family:'DM Sans',system-ui,sans-serif;min-height:100vh}
        body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");opacity:0.02;pointer-events:none;z-index:0}
        .orb{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0}
        .orb-1{width:400px;height:400px;background:rgba(0,229,255,0.06);top:-100px;right:-100px}
        .orb-2{width:300px;height:300px;background:rgba(120,80,255,0.04);bottom:10%;left:-100px}
        .profile-wrap{max-width:420px;margin:0 auto;padding:40px 20px 60px;position:relative;z-index:1}
        .avatar-wrap{display:flex;justify-content:center;margin-bottom:20px}
        .avatar{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#00E5FF,#7B61FF);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:32px;color:#fff;border:3px solid rgba(0,229,255,0.2)}
        .avatar img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid rgba(0,229,255,0.2)}
        .name{text-align:center;font-family:'Syne',sans-serif;font-weight:800;font-size:26px;letter-spacing:-0.5px;margin-bottom:6px}
        .role{text-align:center;font-size:14px;color:var(--muted);margin-bottom:2px}
        .company{text-align:center;font-size:14px;color:var(--cyan);font-weight:500;margin-bottom:16px}
        .bio{text-align:center;font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:28px;max-width:320px;margin-left:auto;margin-right:auto}
        .divider{border:none;border-top:1px solid var(--border);margin:0 0 24px}
        .btns{display:flex;flex-direction:column;gap:10px}
        .btn{display:flex;align-items:center;gap:14px;background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px 18px;text-decoration:none;color:var(--white);font-size:15px;transition:border-color 0.2s,transform 0.15s}
        .btn:hover{border-color:rgba(0,229,255,0.3);transform:translateX(6px)}
        .btn:active{transform:scale(0.98)}
        .btn-icon{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
        .btn-label{flex:1;font-size:15px;font-weight:500}
        .btn-arrow{color:var(--muted);font-size:18px;transition:transform 0.2s,color 0.2s}
        .btn:hover .btn-arrow{transform:translateX(4px);color:var(--cyan)}
        .powered{text-align:center;margin-top:48px;font-size:12px;color:var(--muted)}
        .powered a{color:var(--cyan);text-decoration:none;font-weight:500}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .profile-wrap>*{animation:fadeUp 0.4s ease both}
      `}</style>

      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="profile-wrap">
        <div className="avatar-wrap">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name || ''} />
          ) : (
            <div className="avatar">{initials}</div>
          )}
        </div>

        {profile.display_name && <div className="name">{profile.display_name}</div>}
        {profile.job_title && <div className="role">{profile.job_title}</div>}
        {profile.company_name && <div className="company">{profile.company_name}</div>}
        {profile.bio && <div className="bio">{profile.bio}</div>}

        {buttons.length > 0 && (
          <>
            <hr className="divider" />
            <div className="btns">
              {buttons.map((btn, i) => {
                const config = BUTTON_CONFIG[btn.type]
                if (!config) return null
                return (
                  <a
                    key={i}
                    href={config.href(btn.value)}
                    className="btn"
                    target={['website','instagram','linkedin','facebook','tiktok'].includes(btn.type) ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{animationDelay:`${0.1 + i * 0.06}s`}}
                  >
                    <div className="btn-icon" style={{ background: config.bg }}>
                      {config.emoji}
                    </div>
                    <div className="btn-label">{btn.label || config.label}</div>
                    <span className="btn-arrow">›</span>
                  </a>
                )
              })}
            </div>
          </>
        )}

        <div className="powered">
          Creado con <a href="/">SmartCard</a>
        </div>
      </div>
    </>
  )
}