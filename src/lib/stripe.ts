import Stripe from 'stripe';
import {envVars} from '../config/index.js';

export const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);
