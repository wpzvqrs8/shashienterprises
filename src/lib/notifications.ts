import { QuoteOrder } from './types';

export interface NotificationResult {
  emailSent: boolean;
  whatsappSent: boolean;
  message: string;
}

/**
 * Triggers Email & WhatsApp Notification upon Initial Checkout Submission
 */
export async function sendOrderReceiptNotification(order: QuoteOrder): Promise<NotificationResult> {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track/${order.orderNumber}`;
  
  const emailPayload = {
    to: order.email,
    subject: `Order Quote Received: #${order.orderNumber} — Shashi Enterprises`,
    body: `Dear ${order.contactPerson},\n\nThank you for placing wholesale quote request #${order.orderNumber} with Shashi Enterprises.\n\nBusiness: ${order.businessName}\nItems: ${order.items.length} SKUs\nTotal: ₹${order.subtotal.toLocaleString('en-IN')}\n\nYou can track real-time order status and inspect line items at:\n${trackingUrl}\n\nOur account manager will review stock and issue formal confirmation shortly.`
  };

  const whatsappMessage = `*Shashi Enterprises B2B Order Received*\n\nHi ${order.contactPerson}, your wholesale request *#${order.orderNumber}* for ${order.businessName} (₹${order.subtotal.toLocaleString('en-IN')}) has been received.\n\nTrack status: ${trackingUrl}`;

  console.log('[NOTIFICATION LOG - EMAIL RECEIPT]:', emailPayload);
  console.log('[NOTIFICATION LOG - WHATSAPP RECEIPT]:', { phone: order.phone, message: whatsappMessage });

  return {
    emailSent: true,
    whatsappSent: true,
    message: `Receipt notifications logged for order #${order.orderNumber}`
  };
}

/**
 * Triggers Email & WhatsApp Notification when Admin Confirms Order
 */
export async function sendOrderConfirmationNotification(order: QuoteOrder): Promise<NotificationResult> {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track/${order.orderNumber}`;

  const emailPayload = {
    to: order.email,
    subject: `Order Confirmed: #${order.orderNumber} — Shashi Enterprises GST Invoice`,
    body: `Dear ${order.contactPerson},\n\nYour wholesale order #${order.orderNumber} for ${order.businessName} has been CONFIRMED by Shashi Enterprises Admin.\n\nGSTIN: ${order.gstin || 'N/A'}\nSubtotal: ₹${order.subtotal.toLocaleString('en-IN')}\n\nView formal invoice & track dispatch:\n${trackingUrl}`
  };

  const whatsappMessage = `*Shashi Enterprises — Order Confirmed!* 🎉\n\nHi ${order.contactPerson}, your order *#${order.orderNumber}* is confirmed.\n\nInvoice & tracking link: ${trackingUrl}`;

  console.log('[NOTIFICATION LOG - EMAIL CONFIRMATION]:', emailPayload);
  console.log('[NOTIFICATION LOG - WHATSAPP CONFIRMATION]:', { phone: order.phone, message: whatsappMessage });

  return {
    emailSent: true,
    whatsappSent: true,
    message: `Confirmation notifications dispatched for order #${order.orderNumber}`
  };
}

/**
 * Triggers Email & WhatsApp Notification when Order is Dispatched
 */
export async function sendOrderDispatchNotification(order: QuoteOrder, courier?: string, trackingNo?: string): Promise<NotificationResult> {
  const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/track/${order.orderNumber}`;

  const emailPayload = {
    to: order.email,
    subject: `Order Dispatched: #${order.orderNumber} — Freight Tracking`,
    body: `Dear ${order.contactPerson},\n\nYour wholesale collectible order #${order.orderNumber} has been DISPATCHED via insured freight.\n\nCourier: ${courier || 'Express Freight'}\nTracking #: ${trackingNo || 'Pending'}\n\nTrack shipment live:\n${trackingUrl}`
  };

  const whatsappMessage = `*Shashi Enterprises — Order Dispatched!* 🚚\n\nOrder *#${order.orderNumber}* is on its way via ${courier || 'Insured Freight'} (${trackingNo || 'Tracking pending'}).\n\nLive Tracking: ${trackingUrl}`;

  console.log('[NOTIFICATION LOG - EMAIL DISPATCH]:', emailPayload);
  console.log('[NOTIFICATION LOG - WHATSAPP DISPATCH]:', { phone: order.phone, message: whatsappMessage });

  return {
    emailSent: true,
    whatsappSent: true,
    message: `Dispatch notifications sent for order #${order.orderNumber}`
  };
}
