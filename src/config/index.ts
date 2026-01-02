import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    NODE_ENVIRONMENT: 'production' | 'development';
    PORT: string;
    DATABASE_URL: string;
    BCRYPTJS_SALT_ROUND: string;
    CLIENT_URL: string;
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    JWT: {
        JWT_ACCESS_SECRET: string;
        JWT_ACCESS_EXPIRES: string;
        JWT_REFRESH_SECRET: string;
        JWT_REFRESH_EXPIRES: string;
    };
    STRIPE: {STRIPE_SECRET_KEY: string; STRIPE_WEBHOOK_SECRET: string};
}

const loadEnvVariables = (): EnvConfig => {
    const requiredVariables: string[] = [
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
        NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT as
            | 'production'
            | 'development',
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BCRYPTJS_SALT_ROUND: process.env.BCRYPTJS_SALT_ROUND as string,
        CLIENT_URL: process.env.CLIENT_URL as string,

        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        },

        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        },
        STRIPE: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
        },
    };
};

export const envVars = loadEnvVariables();
