"use client";

/**
 * Legacy export — web checkout is Stripe. Keep the old name so any remaining
 * imports continue to hit the same pricing buttons and loading states.
 */
export { useStripeCheckout as usePayPalCheckout } from "@/features/billing/useStripeCheckout";
