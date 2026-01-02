import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {PaymentService} from './payment.service.js';
import {stripe} from '../../../lib/stripe.js';
import {envVars} from '../../../config/index.js';
import type {Request, Response} from 'express';

const handleStripeWebhookEvent = catchAsync(
    async (req: Request, res: Response) => {
        const sign = req.headers['stripe-signature'] as string;
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sign,
                envVars.STRIPE.STRIPE_WEBHOOK_SECRET,
            );
        } catch (err) {
            console.error('Error verifying webhook signature:', err);
            return res.status(400).send(`Webhook Error: ${err}`);
        }

        const result = await PaymentService.handleStripeWebhookEvent(event);

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: 'Webhook event handled successfully',
            data: result,
        });
    },
);

export const PaymentController = {handleStripeWebhookEvent};
