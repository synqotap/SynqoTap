'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useButtons } from '@/hooks/useButtons'
import { useOrders } from '@/hooks/useOrders'
import { useImageUpload } from '@/hooks/useImageUpload'
import { createClient } from '@/lib/supabase/client'
import { PortalTopbar, PortalSidebar, PortalMobileNav } from '@/components/layout'
import { ProfileForm, ImageUpload, DesignPanel, ButtonsList, OrdersList, ProfilePreview } from '@/components/portal'
import { Card } from '@/components/ui'
import { ADMIN_EMAIL } from '@/types/app'

type Tab = 'profile' | 'design' | 'buttons' | 'orders'

export default function PortalPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [showPreview, setShowPreview] = useState(false)

  const { userId, email, isLoading: authLoading } = useAuth({ requireAuth: true })
  const { profile, setProfile, customer, loading, saving, saved, save } = useProfile(userId)
  const { buttons, add, toggle, remove } = useButtons(profile?.id ?? null)
  const { orders } = useOrders(customer?.id ?? null)
  const { upload, uploadingAvatar, uploadingCover } = useImageUpload(profile?.id ?? null)
  const supabase = createClient()

  const isAdmin = email === ADMIN_EMAIL
  const profileUrl = profile && typeof window !== 'undefined' ? `${window.location.origin}/c/${profile.slug}` : ''

  async function handleImageUpload(file: File, type: 'avatar' | 'cover') {
    const url = await upload(file, type)
    if (url && profile) {
      const field = type === 'avatar' ? 'avatar_url' : 'cover_url'
      await supabase.from('profiles').update({ [field]: url }).eq('id', profile.id)
      setProfile({ ...profile, [field]: url })
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center text-sm text-[#6B6B80] font-[family-name:var(--font-dm-sans)]">
        Loading your portal...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center text-sm text-[#6B6B80] font-[family-name:var(--font-dm-sans)]">
        Profile not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-[family-name:var(--font-dm-sans)]">
      <PortalTopbar
        onPreview={() => setShowPreview(true)}
        isAdmin={isAdmin}
      />
      <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <PortalSidebar
          activeTab={tab}
          onTabChange={setTab}
          profileSlug={profile.slug}
        />
        <main className="flex-1 p-5 sm:p-7 pb-24 md:pb-7 max-w-2xl">

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <>
              <h1 className="text-xl font-black tracking-tight mb-1 font-[family-name:var(--font-syne)]">My profile</h1>
              <p className="text-sm text-[#6B6B80] mb-6">Information that appears on your public card.</p>

              <Card className="mb-4">
                <div className="flex items-center justify-between bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 mb-4">
                  <span className="font-mono text-xs text-[#00E5FF] truncate">{profileUrl}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(profileUrl)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] ml-3 flex-shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#13131F] border border-[#22223A] rounded-xl p-4">
                    <div className="text-2xl font-black font-[family-name:var(--font-syne)]">{profile.view_count}</div>
                    <div className="text-xs text-[#6B6B80] mt-1">Total views</div>
                  </div>
                  <div className="bg-[#13131F] border border-[#22223A] rounded-xl p-4">
                    <div className="text-2xl font-black font-[family-name:var(--font-syne)]">{buttons.filter(b => b.is_active).length}</div>
                    <div className="text-xs text-[#6B6B80] mt-1">Active buttons</div>
                  </div>
                </div>
              </Card>

              <Card className="mb-4">
                <ImageUpload
                  profile={profile}
                  onUpload={handleImageUpload}
                  uploadingAvatar={uploadingAvatar}
                  uploadingCover={uploadingCover}
                />
              </Card>

              <Card>
                <ProfileForm
                  profile={profile}
                  onChange={updates => setProfile({ ...profile, ...updates })}
                  onSave={() => save({
                    display_name: profile.display_name,
                    company_name: profile.company_name,
                    job_title: profile.job_title,
                    bio: profile.bio,
                  })}
                  saving={saving}
                  saved={saved}
                />
              </Card>
            </>
          )}

          {/* DESIGN TAB */}
          {tab === 'design' && (
            <>
              <h1 className="text-xl font-black tracking-tight mb-1 font-[family-name:var(--font-syne)]">Design</h1>
              <p className="text-sm text-[#6B6B80] mb-6">Customize the colors of your public profile.</p>
              <Card>
                <DesignPanel
                  profile={profile}
                  onChange={updates => setProfile({ ...profile, ...updates })}
                  onSave={() => save({ accent_color: profile.accent_color })}
                  saving={saving}
                  saved={saved}
                />
              </Card>
            </>
          )}

          {/* BUTTONS TAB */}
          {tab === 'buttons' && (
            <>
              <h1 className="text-xl font-black tracking-tight mb-1 font-[family-name:var(--font-syne)]">My buttons</h1>
              <p className="text-sm text-[#6B6B80] mb-6">Buttons that appear on your public profile. Maximum 8.</p>
              <ButtonsList
                buttons={buttons}
                onAdd={add}
                onToggle={toggle}
                onDelete={remove}
              />
            </>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <>
              <h1 className="text-xl font-black tracking-tight mb-1 font-[family-name:var(--font-syne)]">My orders</h1>
              <p className="text-sm text-[#6B6B80] mb-6">Status of your SynqoTap cards.</p>
              <OrdersList orders={orders} />
            </>
          )}

        </main>
      </div>

      <PortalMobileNav activeTab={tab} onTabChange={setTab} />

      <ProfilePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        profile={profile}
        buttons={buttons}
      />
    </div>
  )
}
