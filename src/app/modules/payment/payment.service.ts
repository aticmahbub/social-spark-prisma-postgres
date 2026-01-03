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
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;

            const participantId = session.metadata?.participantId;
            const paymentId = session.metadata?.paymentId;

            if (!participantId || !paymentId) {
                console.error('Missing metadata', session.metadata);
                return;
            }

            await prisma.$transaction([
                prisma.participant.update({
                    where: {id: participantId},
                    data: {status: UserEventStatus.JOINED},
                }),
                prisma.payment.update({
                    where: {id: paymentId},
                    data: {
                        status: PaymentStatus.SUCCESS,
                        transactionId: session.id,
                        paymentGatewayData: {
                            amount_total: session.amount_total,
                            currency: session.currency,
                            payment_status: session.payment_status,
                            customer_email: session.customer_email,
                        },
                    },
                }),
            ]);

            console.log('✅ Payment completed');
            break;
        }

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
