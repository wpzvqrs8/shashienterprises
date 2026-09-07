import { Resend } from 'resend';
import { QuoteOrder } from './types';

const resendApiKey = process.env.RESEND_API_KEY || 're_UwTng35u_CrFrviEeT2gqvNYTZCArzuj9';
const resend = new Resend(resendApiKey);

const SITE_URL = 'https://shashienterprises.store';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Shashi Enterprises <orders@shashienterprises.store>';
const SUPPORT_PHONE = '+91-8796138389';
const SUPPORT_EMAIL = 'enterprisesshashi95@gmail.com';
const INSTAGRAM_URL = 'https://www.instagram.com/shashienterprises5';

/**
 * Common HTML Header and Container Styles matching Shashi Enterprises Theme
 * Theme: Dark Ink #141218, Ember #E2632B, Gold #C79A2E, Light BG #FAF8F3
 */
function getEmailLayout(title: string, contentHtml: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141218;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f1ea; padding: 20px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e5dfd3; max-width: 95%;">
            
            <!-- HEADER BANNER -->
            <tr>
              <td style="background-color: #141218; padding: 28px 32px; text-align: center; border-bottom: 3px solid #E2632B;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                  SHASHI <span style="color: #E2632B;">ENTERPRISES</span>
                </h1>
                <p style="color: #C79A2E; margin: 6px 0 0 0; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">
                  PREMIUM ANIME & POP CULTURE COLLECTIBLES B2B
                </p>
              </td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding: 32px;">
                ${contentHtml}
              </td>
            </tr>

            <!-- CONTACT & SOCIAL LINKS FOOTER -->
            <tr>
              <td style="background-color: #141218; padding: 24px 32px; text-align: center; color: #a19d96; font-size: 13px;">
                <p style="color: #ffffff; font-weight: 700; font-size: 14px; margin: 0 0 12px 0;">Need Support or Have Questions?</p>
                <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto;">
                  <tr>
                    <td style="padding: 0 10px;">
                      <a href="tel:${SUPPORT_PHONE.replace(/\s+/g, '')}" style="color: #E2632B; text-decoration: none; font-weight: 600;">
                        📞 ${SUPPORT_PHONE}
                      </a>
                    </td>
                    <td style="color: #4a4640;">•</td>
                    <td style="padding: 0 10px;">
                      <a href="mailto:${SUPPORT_EMAIL}" style="color: #E2632B; text-decoration: none; font-weight: 600;">
                        ✉️ ${SUPPORT_EMAIL}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin: 0 0 16px 0;">
                  <a href="${INSTAGRAM_URL}" target="_blank" style="display: inline-block; background-color: #E2632B; color: #ffffff; text-decoration: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; font-size: 12px;">
                    📷 Follow on Instagram
                  </a>
                </p>
                <div style="border-top: 1px solid #2a2630; margin-top: 16px; padding-top: 16px; font-size: 11px; color: #78746c;">
                  © ${new Date().getFullYear()} Shashi Enterprises. All rights reserved. • Trade Wholesale Specialist
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

/**
 * Helper to dispatch emails via Resend with automatic fallback
 * Primary sender: orders@shashienterprises.store
 * Fallback sender: onboarding@resend.dev (for unverified domains during domain setup)
 */
async function sendEmailWithResend(toEmail: string, subject: string, htmlContent: string): Promise<boolean> {
  const fromPrimary = process.env.RESEND_FROM_EMAIL || 'Shashi Enterprises <orders@shashienterprises.store>';
  const fromFallback = 'Shashi Enterprises <onboarding@resend.dev>';
  const recipient = (toEmail && toEmail.includes('@')) ? toEmail.trim() : SUPPORT_EMAIL;

  // Attempt 1: Primary domain sender to recipient
  try {
    const res1 = await resend.emails.send({
      from: fromPrimary,
      to: [recipient],
      subject,
      html: htmlContent
    });
    if (!res1.error) {
      console.log('[RESEND SUCCESS (Primary Domain)]:', res1);
      return true;
    }
    console.warn('[RESEND NOTICE (Primary Domain Error)]:', res1.error);
  } catch (e1) {
    console.warn('[RESEND CATCH (Primary Domain Error)]:', e1);
  }

  // Attempt 2: Fallback onboarding sender to recipient
  try {
    const res2 = await resend.emails.send({
      from: fromFallback,
      to: [recipient],
      subject,
      html: htmlContent
    });
    if (!res2.error) {
      console.log('[RESEND SUCCESS (Fallback Onboarding Domain)]:', res2);
      return true;
    }
    console.warn('[RESEND NOTICE (Fallback Domain Error)]:', res2.error);
  } catch (e2) {
    console.warn('[RESEND CATCH (Fallback Domain Error)]:', e2);
  }

  // Attempt 3: Deliver to owner account enterprisesshashi95@gmail.com
  if (recipient !== SUPPORT_EMAIL) {
    try {
      const res3 = await resend.emails.send({
        from: fromFallback,
        to: [SUPPORT_EMAIL],
        subject: `[For: ${recipient}] ${subject}`,
        html: htmlContent
      });
      if (!res3.error) {
        console.log('[RESEND SUCCESS (Owner Account Fallback)]:', res3);
        return true;
      }
    } catch (e3) {
      console.error('[RESEND ERROR (Owner Account Fallback Error)]:', e3);
    }
  }

  return false;
}

/**
 * Send Email #1: Order Created / Received Email
 */
export async function sendOrderCreatedEmail(order: QuoteOrder): Promise<boolean> {
  const trackingUrl = `${SITE_URL}/track/${order.orderNumber}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #fff4ee; color: #E2632B; border: 1px solid #ffd0b8; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        ⌛ Email 1 of 2: Order Received (Awaiting Confirmation)
      </span>
    </div>

    <h2 style="color: #141218; margin: 0 0 12px 0; font-size: 20px; font-weight: 700; text-align: center;">
      Order Received: <span style="color: #E2632B;">#${order.orderNumber}</span>
    </h2>

    <p style="font-size: 15px; line-height: 1.6; color: #3d3933; margin: 0 0 16px 0;">
      Dear <strong>${order.contactPerson}</strong>,
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #3d3933; margin: 0 0 20px 0;">
      Thank you for placing your order with <strong>Shashi Enterprises</strong>. Your order is currently undergoing review by our stock allocation team.
    </p>

    <!-- 2 EMAILS EXPLANATION NOTICE BOX -->
    <div style="background-color: #eef6ff; border-left: 4px solid #0066cc; padding: 16px 20px; border-radius: 6px; margin: 0 0 24px 0;">
      <p style="margin: 0 0 8px 0; color: #004085; font-size: 14px; line-height: 1.5; font-weight: 700;">
        📬 You will receive 2 emails for this wholesale request:
      </p>
      <ul style="margin: 0; padding-left: 20px; color: #004085; font-size: 13px; line-height: 1.6;">
        <li><strong>Email 1 (This Email):</strong> Confirms your order request has been received.</li>
        <li><strong>Email 2 (Order Confirmed):</strong> Will be sent once our team approves your request and confirms stock allocation.</li>
      </ul>
    </div>

    <!-- ORDER OVERVIEW CARD -->
    <div style="background-color: #faf8f3; border: 1px solid #e6e0d3; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #78746c; letter-spacing: 0.5px;">Order Overview</h3>
      <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 14px; color: #141218;">
        <tr>
          <td style="color: #666; padding-bottom: 6px;">Order ID:</td>
          <td style="text-align: right; font-weight: 700; padding-bottom: 6px;">#${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #666; padding-bottom: 6px;">Business Name:</td>
          <td style="text-align: right; font-weight: 600; padding-bottom: 6px;">${order.businessName}</td>
        </tr>
        <tr>
          <td style="color: #666; padding-bottom: 6px;">Items Count:</td>
          <td style="text-align: right; font-weight: 600; padding-bottom: 6px;">${order.items.length} SKUs</td>
        </tr>
        <tr>
          <td style="color: #666; padding-top: 8px; border-top: 1px solid #e0d9cc;">Estimated Subtotal:</td>
          <td style="text-align: right; font-weight: 800; font-size: 16px; color: #E2632B; padding-top: 8px; border-top: 1px solid #e0d9cc;">
            ₹${order.subtotal.toLocaleString('en-IN')}
          </td>
        </tr>
      </table>
    </div>

    <!-- ACTION BUTTON -->
    <div style="text-align: center; margin: 28px 0 24px 0;">
      <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #141218; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; border: 1px solid #333;">
        🔍 Track Your Order Live
      </a>
    </div>

    <p style="font-size: 13px; color: #888; text-align: center; margin: 0;">
      Or copy this link to your browser: <br>
      <a href="${trackingUrl}" style="color: #E2632B; word-break: break-all;">${trackingUrl}</a>
    </p>
  `;

  const htmlContent = getEmailLayout(`Order #${order.orderNumber} Received`, content);
  return await sendEmailWithResend(
    order.email,
    `Order Received: #${order.orderNumber} — Shashi Enterprises`,
    htmlContent
  );
}

/**
 * Send Email #2: Order Confirmed Email
 */
export async function sendOrderConfirmedEmail(order: QuoteOrder): Promise<boolean> {
  const trackingUrl = `${SITE_URL}/track/${order.orderNumber}`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; color: #141218;">
          ${item.product.name}
          <div style="font-size: 11px; color: #777; font-weight: normal;">SKU: ${item.product.sku}</div>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: center; color: #333;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right; color: #333;">
          ₹${item.selectedTierPrice.toLocaleString('en-IN')}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right; font-weight: 700; color: #141218;">
          ₹${item.lineTotal.toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="display: inline-block; background-color: #e6f4ea; color: #137333; border: 1px solid #ceead6; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        🎉 Email 2 of 2: Order Confirmed!
      </span>
    </div>

    <h2 style="color: #141218; margin: 0 0 12px 0; font-size: 22px; font-weight: 800; text-align: center;">
      Your Order <span style="color: #E2632B;">#${order.orderNumber}</span> Has Been Confirmed!
    </h2>

    <p style="font-size: 15px; line-height: 1.6; color: #3d3933; margin: 0 0 16px 0;">
      Dear <strong>${order.contactPerson}</strong>,
    </p>

    <p style="font-size: 15px; line-height: 1.6; color: #3d3933; margin: 0 0 20px 0;">
      We are pleased to inform you that your wholesale order <strong>#${order.orderNumber}</strong> for <strong>${order.businessName}</strong> has been officially <strong>CONFIRMED</strong>.
    </p>

    <!-- MOBILE UPDATE & BILLING ALERT BOX (USER MANDATE) -->
    <div style="background-color: #fff4ee; border: 2px dashed #E2632B; padding: 18px 20px; border-radius: 8px; margin: 0 0 24px 0; text-align: center;">
      <p style="margin: 0; color: #141218; font-size: 15px; line-height: 1.5; font-weight: 700;">
        📲 You are going to get a message on <span style="color: #E2632B; font-size: 16px;">${order.phone}</span> about the further update and billing.
      </p>
    </div>

    <!-- ORDER ITEMS TABLE -->
    <h3 style="margin: 24px 0 12px 0; font-size: 15px; font-weight: 700; color: #141218; text-transform: uppercase; letter-spacing: 0.5px;">
      📦 Confirmed Order Details
    </h3>

    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px; border: 1px solid #e0d9cc; border-radius: 6px; overflow: hidden;">
      <thead>
        <tr style="background-color: #141218; color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          <th style="padding: 10px 12px; text-align: left;">Product</th>
          <th style="padding: 10px 12px; text-align: center;">Qty</th>
          <th style="padding: 10px 12px; text-align: right;">Unit Price</th>
          <th style="padding: 10px 12px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr style="background-color: #faf8f3;">
          <td colspan="3" style="padding: 12px; text-align: right; font-weight: 700; font-size: 14px; color: #141218; border-top: 2px solid #e0d9cc;">
            Total Confirmed Amount:
          </td>
          <td style="padding: 12px; text-align: right; font-weight: 800; font-size: 16px; color: #E2632B; border-top: 2px solid #e0d9cc;">
            ₹${order.subtotal.toLocaleString('en-IN')}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- SHIPPING & BILLING ADDRESS CARD -->
    <div style="background-color: #faf8f3; border: 1px solid #e6e0d3; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #333;">
      <h4 style="margin: 0 0 8px 0; color: #141218; font-size: 13px; text-transform: uppercase;">Delivery Address</h4>
      <p style="margin: 0; line-height: 1.5;">
        <strong>${order.businessName}</strong> (${order.contactPerson})<br>
        ${order.address}, ${order.city} - ${order.pincode}<br>
        Phone: ${order.phone} ${order.gstin ? `| GSTIN: ${order.gstin}` : ''}
      </p>
    </div>

    <!-- ACTION BUTTON -->
    <div style="text-align: center; margin: 28px 0 20px 0;">
      <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #E2632B; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(226,99,43,0.3);">
        🚀 View Invoice & Order Status
      </a>
    </div>
  `;

  const htmlContent = getEmailLayout(`Order #${order.orderNumber} Confirmed`, content);
  return await sendEmailWithResend(
    order.email,
    `Order Confirmed: #${order.orderNumber} — Shashi Enterprises`,
    htmlContent
  );
}
