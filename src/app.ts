import express, {type Application, type Request, type Response} from 'express';
import cors from 'cors';
import {envVars} from './config/index.js';
import cookieParser from 'cookie-parser';
import notFound from './app/middlewares/notFound.js';
import {router} from './app/routes/index.js';

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Server is running..',
        environment: envVars.NODE_ENVIRONMENT,
        uptime: process.uptime().toFixed(2) + ' sec',
        timeStamp: new Date().toISOString(),
    });
});
app.use('/api/v1', router);

app.use(notFound);

export default app;
