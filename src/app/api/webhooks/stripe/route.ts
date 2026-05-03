import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // In production, verify with: stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
    const event = JSON.parse(body);

    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful checkout
        console.log("Checkout completed:", event.data.object.id);
        break;
      case "invoice.payment_succeeded":
        // Handle successful subscription payment
        console.log("Payment succeeded:", event.data.object.id);
        break;
      case "customer.subscription.deleted":
        // Handle subscription cancellation
        console.log("Subscription deleted:", event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
