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
    STRIPE: {
        STRIPE_SECRET_KEY: string;
        STRIPE_WEBHOOK_SECRET: string;
    };
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=index.d.ts.map