import type Stripe from 'stripe';
import {prisma} from '../../../lib/prisma.js';
import {
    EventStatus,
    PaymentStatus,
    UserEventStatus,
} from '../../../generated/enums.js';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    console.log('🔔 Stripe webhook received:', event.type);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            const participantId = session?.metadata?.participantId;
            const paymentId = session?.metadata?.paymentId;
            const transactionId = session?.metadata?.paymentSessionId;
            const email = session.customer_email;

            if (!participantId || !paymentId) {
                console.error('Missing metadata', session.metadata);
                return;
            }

            await prisma.participant.update({
                where: {id: participantId},
                data: {
                    status: UserEventStatus.JOINED,
                },
            });

            await prisma.payment.update({
                where: {id: paymentId},
                data: {
                    status: PaymentStatus.SUCCESS,
                    paymentGatewayData: session,
                },
            });
            console.log('payment success');
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
