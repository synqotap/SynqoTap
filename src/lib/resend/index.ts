import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// ── Email 1: Confirmación de compra + credenciales ──
export async function sendPurchaseConfirmation({
  email,
  name,
  cardType,
  slug,
  tempPassword,
}: {
  email: string
  name: string
  cardType: string
  slug: string
  tempPassword: string
}) {
  const profileUrl = `${APP_URL}/c/${slug}`
  const loginUrl = `${APP_URL}/login`
  const cardName = cardType === 'pvc' ? 'PVC Card' : 'Metal Card'

  await resend.emails.send({
    from: `SmartCard <${FROM}>`,
    to: email,
    subject: '¡Tu SmartCard está en camino! Aquí están tus accesos',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#07070C;font-family:'DM Sans',Arial,sans-serif">
        <div style="max-width:560px;margin:0 auto;padding:40px 24px">
          
          <div style="text-align:center;margin-bottom:40px">
            <span style="font-size:24px;font-weight:800;color:#F2F2F4;font-family:Arial,sans-serif">
              Smart<span style="color:#00E5FF">Card</span>
            </span>
          </div>

          <div style="background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px;margin-bottom:20px">
            <div style="font-size:32px;margin-bottom:16px">🎉</div>
            <h1 style="color:#F2F2F4;font-size:22px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px">
              ¡Compra confirmada, ${name.split(' ')[0]}!
            </h1>
            <p style="color:#6B6B80;font-size:15px;line-height:1.6;margin:0 0 24px">
              Tu <strong style="color:#F2F2F4">SmartCard ${cardName}</strong> está siendo programada y te la enviamos pronto.
            </p>

            <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#6B6B80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Tu perfil digital ya está activo</p>
              <a href="${profileUrl}" style="color:#00E5FF;font-family:monospace;font-size:14px;word-break:break-all">${profileUrl}</a>
            </div>

            <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#6B6B80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Tus credenciales de acceso</p>
              <p style="color:#F2F2F4;font-size:14px;margin:0 0 6px">📧 Email: <strong>${email}</strong></p>
              <p style="color:#F2F2F4;font-size:14px;margin:0">🔑 Contraseña temporal: <strong style="color:#00E5FF;font-family:monospace">${tempPassword}</strong></p>
            </div>

            <a href="${loginUrl}" style="display:block;background:#00E5FF;color:#07070C;font-weight:800;font-size:15px;text-align:center;padding:14px;border-radius:50px;text-decoration:none">
              Entrar a mi portal →
            </a>
          </div>

          <div style="background:#0E0E16;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:20px">
            <p style="color:#6B6B80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">¿Qué pasa ahora?</p>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${['Entra al portal y personaliza tu perfil','Programamos tu tarjeta NFC en 1-3 días hábiles','Recibes tu tarjeta y empiezas a compartir tu contacto'].map((s,i) => `
                <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #1C1C2E">
                  <span style="width:20px;height:20px;border-radius:50%;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);color:#00E5FF;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;min-width:20px;text-align:center;line-height:20px">${i+1}</span>
                  <span style="color:#F2F2F4;font-size:14px">${s}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <p style="text-align:center;color:#3A3A50;font-size:12px">
            © 2025 SmartCard · <a href="${APP_URL}" style="color:#3A3A50">smartcard.io</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}

// ── Email 2: Notificación de envío con tracking ──
export async function sendShippingNotification({
  email,
  name,
  trackingNumber,
  carrier,
  slug,
}: {
  email: string
  name: string
  trackingNumber: string
  carrier: string
  slug: string
}) {
  const profileUrl = `${APP_URL}/c/${slug}`

  await resend.emails.send({
    from: `SmartCard <${FROM}>`,
    to: email,
    subject: '📦 Tu SmartCard está en camino',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#07070C;font-family:Arial,sans-serif">
        <div style="max-width:560px;margin:0 auto;padding:40px 24px">
          
          <div style="text-align:center;margin-bottom:40px">
            <span style="font-size:24px;font-weight:800;color:#F2F2F4">
              Smart<span style="color:#00E5FF">Card</span>
            </span>
          </div>

          <div style="background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px">
            <div style="font-size:32px;margin-bottom:16px">📦</div>
            <h1 style="color:#F2F2F4;font-size:22px;font-weight:800;margin:0 0 8px">
              ¡Tu tarjeta está en camino!
            </h1>
            <p style="color:#6B6B80;font-size:15px;line-height:1.6;margin:0 0 24px">
              Hola ${name.split(' ')[0]}, tu SmartCard fue enviada y pronto llegará a tu puerta.
            </p>

            <div style="background:#13131F;border:1px solid #22223A;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#6B6B80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Información de envío</p>
              <p style="color:#F2F2F4;font-size:14px;margin:0 0 6px">🚚 Transportista: <strong>${carrier}</strong></p>
              <p style="color:#F2F2F4;font-size:14px;margin:0">📋 Tracking: <strong style="color:#00E5FF;font-family:monospace">${trackingNumber}</strong></p>
            </div>

            <div style="background:#13131F;border:1px solid rgba(29,158,117,0.3);border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="color:#6B6B80;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px">Tu perfil ya está activo</p>
              <a href="${profileUrl}" style="color:#00E5FF;font-family:monospace;font-size:13px">${profileUrl}</a>
              <p style="color:#6B6B80;font-size:12px;margin:8px 0 0">Puedes editarlo en cualquier momento desde tu portal</p>
            </div>

            <a href="${APP_URL}/portal" style="display:block;background:#00E5FF;color:#07070C;font-weight:800;font-size:15px;text-align:center;padding:14px;border-radius:50px;text-decoration:none">
              Ver mi portal →
            </a>
          </div>

          <p style="text-align:center;color:#3A3A50;font-size:12px;margin-top:24px">
            © 2025 SmartCard · <a href="${APP_URL}" style="color:#3A3A50">smartcard.io</a>
          </p>
        </div>
      </body>
      </html>
    `,
  })
}