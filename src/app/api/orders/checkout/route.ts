import { NextRequest, NextResponse } from 'next/server';
import { QuoteOrder, CartItem } from '@/lib/types';
import { addOrder } from '@/lib/catalog-store';
import { sendOrderReceiptNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      contactPerson,
      phone,
      email,
      gstin,
      address,
      city,
      pincode,
      items
    } = body;

    if (!contactPerson || !email || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required checkout parameters.' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = (items as CartItem[]).reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    // Create Order Record with unique Order Number
    const orderData: Partial<QuoteOrder> = {
      businessName: businessName || contactPerson,
      contactPerson,
      phone,
      email,
      gstin: gstin || '',
      address: address || '',
      city: city || 'Delhi',
      pincode: pincode || '110001',
      items,
      subtotal,
      status: 'New'
    };

    const createdOrder = await addOrder(orderData);

    // Trigger Notification Webhooks (Email & WhatsApp)
    await sendOrderReceiptNotification(createdOrder);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully.',
      order: createdOrder,
      orderNumber: createdOrder.orderNumber
    });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during checkout.' },
      { status: 500 }
    );
  }
}
