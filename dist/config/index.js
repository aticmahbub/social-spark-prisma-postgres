import dotenv from 'dotenv';
dotenv.config();
const loadEnvVariables = () => {
    const requiredVariables = [
        'NODE_ENVIRONMENT',
        'PORT',
        'DATABASE_URL',
        'BCRYPTJS_SALT_ROUND',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
        'JWT_ACCESS_SECRET',
        'JWT_ACCESS_EXPIRES',
        'JWT_REFRESH_SECRET',
        'JWT_REFRESH_EXPIRES',
        'STRIPE_SECRET_KEY',
        'CLIENT_URL',
        'STRIPE_WEBHOOK_SECRET',
    ];
    requiredVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        BCRYPTJS_SALT_ROUND: process.env.BCRYPTJS_SALT_ROUND,
        CLIENT_URL: process.env.CLIENT_URL,
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        },
        STRIPE: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        },
    };
};
export const envVars = loadEnvVariables();
//# sourceMappingURL=index.js.map