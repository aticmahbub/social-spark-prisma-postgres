import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    NODE_ENVIRONMENT: 'production' | 'development';
    PORT: string;
    DATABASE_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
    const requiredVariables: string[] = [
        'NODE_ENVIRONMENT',
        'PORT',
        'DATABASE_URL',
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
    };
};

export const envVars = loadEnvVariables();
