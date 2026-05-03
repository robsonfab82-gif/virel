export interface StripePlan {
  id: string;
  name: string;
  priceId: string;
  price: number;
  currency: string;
  interval: "month" | "year";
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface StripeWebhookEvent {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}
