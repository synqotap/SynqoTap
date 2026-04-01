import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendPurchaseConfirmation({ email, name, cardType, slug, tempPassword }: {
  email: string; name: string; cardType: string; slug: string; tempPassword: string
}) {
  const profileUrl = `${APP_URL}/c/${slug}`
  const loginUrl = `${APP_URL}/login`
  const cardName = cardType === 'pvc' ? 'PVC Card' : 'Metal Card'
  const firstName = name.split(' ')[0]

  await resend.emails.send({
    from: `SynqoTap <${FROM}>`,
    to: email,
    subject: '🎉 Your SynqoTap is on its way! Here are your login details',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070C;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">

  <div style="text-align:center;margin-bottom:40px">
    <span style="font-size:26px;font-weight:800;color:#F2F2F4">Synqo<span style="color:#00E5FF">Tap</span></span>
  </div>

  <div style="background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px;margin-bottom:20px">
    <div style="font-size:40px;margin-bottom:16px;text-align:center">🎉</div>
    <h1 style="color:#F2F2F4;font-size:22px;font-weight:800;margin:0 0 8px;text-align:center">
      Purchase confirmed, ${firstName}!
    </h1>
    <p style="color:#6B6B80;font-size:15px;line-height:1.6;margin:0 0 28px;text-align:center">
      Your <strong style="color:#F2F2F4">SynqoTap ${cardName}</strong> is being programmed and will ship soon.
    </p>

    <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:20px">
      <p style="color:#6B6B80;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Your digital profile is already live</p>
      <a href="${profileUrl}" style="color:#00E5FF;font-family:monospace;font-size:14px;word-break:break-all">${profileUrl}</a>
    </div>

    <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#6B6B80;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px">Your login credentials</p>
      <p style="color:#F2F2F4;font-size:14px;margin:0 0 10px">📧 Email: <strong>${email}</strong></p>
      <p style="color:#FF9F43;font-size:12px;font-weight:bold;margin:0 0 8px">⚠️ Copy this password before clicking the button below:</p>
      <div style="background:#07070C;border:1px solid rgba(0,229,255,0.3);border-radius:8px;padding:16px;text-align:center">
        <code style="color:#00E5FF;font-size:24px;font-weight:bold;letter-spacing:4px;font-family:monospace">${tempPassword}</code>
      </div>
      <p style="color:#3A3A50;font-size:12px;margin:10px 0 0">You'll be asked to change this when you first login.</p>
    </div>

    <a href="${loginUrl}" style="display:block;background:#00E5FF;color:#07070C;font-weight:800;font-size:15px;text-align:center;padding:14px;border-radius:50px;text-decoration:none">
      Login to my portal →
    </a>
  </div>

  <div style="background:#0E0E16;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:20px">
    <p style="color:#6B6B80;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px">What happens next?</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${['Login and customize your profile — name, buttons, logo.', 'We program your NFC card within 1-3 business days.', 'You receive your card ready to use. Start sharing your contact!'].map((s, i, arr) => `
      <tr>
        <td style="width:28px;min-width:28px;padding:10px 10px 10px 0;color:#00E5FF;font-size:14px;font-weight:bold;vertical-align:top;${i < arr.length - 1 ? 'border-bottom:1px solid #1C1C2E;' : ''}">${i + 1}.</td>
        <td style="color:#F2F2F4;font-size:14px;padding:10px 0;vertical-align:top;${i < arr.length - 1 ? 'border-bottom:1px solid #1C1C2E;' : ''}">${s}</td>
      </tr>`).join('')}
    </table>
  </div>

  <p style="text-align:center;color:#3A3A50;font-size:12px">
    © 2025 SynqoTap · <a href="${APP_URL}" style="color:#3A3A50">synqotap.com</a>
  </p>
</div>
</body>
</html>
    `,
  })
}

export async function sendShippingNotification({ email, name, trackingNumber, carrier, slug }: {
  email: string; name: string; trackingNumber: string; carrier: string; slug: string
}) {
  const profileUrl = `${APP_URL}/c/${slug}`
  const firstName = name.split(' ')[0]

  await resend.emails.send({
    from: `SynqoTap <${FROM}>`,
    to: email,
    subject: '📦 Your SynqoTap is on its way!',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#07070C;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
  <div style="text-align:center;margin-bottom:40px">
    <span style="font-size:26px;font-weight:800;color:#F2F2F4">Synqo<span style="color:#00E5FF">Tap</span></span>
  </div>
  <div style="background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px">
    <div style="font-size:40px;margin-bottom:16px;text-align:center">📦</div>
    <h1 style="color:#F2F2F4;font-size:22px;font-weight:800;margin:0 0 8px;text-align:center">Your card is on its way!</h1>
    <p style="color:#6B6B80;font-size:15px;line-height:1.6;margin:0 0 24px;text-align:center">Hey ${firstName}, your SynqoTap was shipped and will arrive soon.</p>
    <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#6B6B80;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Shipping info</p>
      <p style="color:#F2F2F4;font-size:14px;margin:0 0 6px">🚚 Carrier: <strong>${carrier}</strong></p>
      <p style="color:#F2F2F4;font-size:14px;margin:0">📋 Tracking: <strong style="color:#00E5FF;font-family:monospace">${trackingNumber}</strong></p>
    </div>
    <div style="background:#13131F;border:1px solid rgba(29,158,117,0.3);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="color:#6B6B80;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Your profile is live</p>
      <a href="${profileUrl}" style="color:#00E5FF;font-family:monospace;font-size:13px">${profileUrl}</a>
    </div>
    <a href="${APP_URL}/portal" style="display:block;background:#00E5FF;color:#07070C;font-weight:800;font-size:15px;text-align:center;padding:14px;border-radius:50px;text-decoration:none">View my portal →</a>
  </div>
  <p style="text-align:center;color:#3A3A50;font-size:12px;margin-top:24px">© 2025 SynqoTap</p>
</div>
</body>
</html>
    `,
  })
}