import type {Response} from 'express';

export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
    if (tokenInfo.accessToken) {
        res.cookie('accessToken', tokenInfo.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie('refreshToken', tokenInfo.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            path: '/',
        });
    }
};
