import dotenv from 'dotenv';
dotenv.config();
const loadEnvVariables = () => {
    const requiredVariables = [
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
        NODE_ENVIRONMENT: process.env.NODE_ENVIRONMENT,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
    };
};
export const envVars = loadEnvVariables();
//# sourceMappingURL=index.js.map