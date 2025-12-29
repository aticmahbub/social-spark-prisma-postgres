import {Server} from 'http';
import app from './app.js';
import {envVars} from './config/index.js';

let server: Server;

process.on('uncaughtException', (err) => {
    console.log('Uncaught exception detected. Server shutting down...');
    console.log(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
});

async function bootstrap() {
    try {
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening on port: ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await bootstrap();
})();

process.on('unhandledRejection', (reason) => {
    console.log(
        'Unhandled rejection detected. Server shutting down...',
        reason,
    );
    if (server) {
        server.close(() => {
            console.log('Server closed due to unhandled rejection');
            process.exit(1);
        });
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    if (server) {
        server.close(() => {
            console.log('Process terminated.');
            process.exit(1);
        });
    }
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received. Server shutting down...');
    if (server) {
        server.close(() => process.exit(1));
    }
});
