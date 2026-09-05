import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/catalog-store';
import { sendOrderConfirmationNotification, sendOrderDispatchNotification } from '@/lib/notifications';
import { QuoteOrder } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { orderId, status, courier, trackingNo } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status.' }, { status: 400 });
    }

    const updatedOrder = await updateOrderStatus(orderId, status as QuoteOrder['status']);

    // Trigger notification based on new status
    if (status === 'Confirmed') {
      await sendOrderConfirmationNotification(updatedOrder);
    } else if (status === 'Dispatched') {
      await sendOrderDispatchNotification(updatedOrder, courier, trackingNo);
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}. Notifications dispatched.`,
      order: updatedOrder
    });
  } catch (error: any) {
    console.error('Update Status API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while updating order status.' },
      { status: 500 }
    );
  }
}
