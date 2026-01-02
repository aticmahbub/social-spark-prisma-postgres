import type Stripe from 'stripe';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;

            const eventId = session?.metadata?.eventId;
            const paymentId = session.payment_intent;
            const email = session.customer_email;

            break;

        case 'payment_intent.payment_failed':
            const intent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment failed');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
};

export const PaymentService = {
    handleStripeWebhookEvent,
};
