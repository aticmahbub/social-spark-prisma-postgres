import type {Response} from 'express';

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    const isProduction = process.env.NODE_ENVIRONMENT === 'production';

    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? ('none' as const) : ('lax' as const),
        secure: isProduction, // true in production
        path: '/',
    };

    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60, // 1 hour
        });
    }

    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
        });
    }
};
