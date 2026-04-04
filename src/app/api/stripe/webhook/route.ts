import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Helper to get period end from subscription
// In newer Stripe API versions, current_period_end moved to subscription items
function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): Date {
  // Try items first (newer API), fallback to top-level (older API)
  const item = subscription.items?.data?.[0];
  const periodEnd = item?.current_period_end
    ?? (subscription as unknown as Record<string, unknown>)["current_period_end"];
  return periodEnd ? new Date((periodEnd as number) * 1000) : new Date();
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.client_reference_id && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await prisma.user.update({
          where: { id: session.client_reference_id },
          data: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
          },
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const invoiceSubscription = (invoice as unknown as Record<string, unknown>)["subscription"];
      if (invoiceSubscription) {
        const subscription = await stripe.subscriptions.retrieve(
          invoiceSubscription as string
        );
        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: getSubscriptionPeriodEnd(subscription),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return new Response(null, { status: 200 });
}
