import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {PaymentService} from './payment.service.js';
import {stripe} from '../../../lib/stripe.js';
import {envVars} from '../../../config/index.js';
import type {NextFunction, Request, Response} from 'express';
import type Stripe from 'stripe';

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error: any) {
        console.error('Webhook signature failed', error.message);
        res.status(400).send(`Webhook error ${error.message}`);
        return;
    }

    await PaymentService.handleStripeWebhookEvent(event);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Received',
        data: {},
    });
};

export const PaymentController = {handleStripeWebhookEvent};
