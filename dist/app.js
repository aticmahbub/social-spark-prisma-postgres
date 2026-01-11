import express, {} from 'express';
import cors from 'cors';
import { envVars } from './config/index.js';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound.js';
import { router } from './app/routes/index.js';
import { PaymentController } from './app/modules/payment/payment.controller.js';
import globalErrorHandler from './app/middlewares/globalErrorHandler.js';
const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'https://social-spark-nextjs.vercel.app',
    /^https:\/\/.*\.vercel\.app$/,
];
export const corsConfig = cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const isAllowed = allowedOrigins.some((allowed) => typeof allowed === 'string'
            ? allowed === origin
            : allowed.test(origin));
        if (isAllowed) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});
app.post('/api/v1/payment/webhook', express.raw({ type: 'application/json' }), PaymentController.handleStripeWebhookEvent);
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send({
        message: 'Server is running..',
        environment: envVars.NODE_ENVIRONMENT,
        uptime: process.uptime().toFixed(2) + ' sec',
        timeStamp: new Date().toISOString(),
    });
});
app.use('/api/v1', router);
app.use(notFound);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map