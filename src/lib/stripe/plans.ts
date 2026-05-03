export const STRIPE_PLANS = {
  start: {
    name: "Start",
    priceId: process.env.STRIPE_PRICE_ID_START ?? "price_start_placeholder",
    price: 4700,
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_ID_PRO ?? "price_pro_placeholder",
    price: 9700,
  },
  ultra: {
    name: "Ultra",
    priceId: process.env.STRIPE_PRICE_ID_ULTRA ?? "price_ultra_placeholder",
    price: 19700,
  },
} as const;

export type PlanSlug = keyof typeof STRIPE_PLANS;

export async function createCheckoutSession(priceId: string, userId: string, successUrl: string, cancelUrl: string) {
  const { stripe } = await import("./client");
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
    subscription_data: { trial_period_days: 7 },
  });
  return session;
}
