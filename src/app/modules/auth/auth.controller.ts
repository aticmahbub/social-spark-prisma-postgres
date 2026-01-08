import type {NextFunction, Request, Response} from 'express';
import {AuthService} from './auth.service.js';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {setAuthCookie} from '../../utils/setAuthCookie.js';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);

    setAuthCookie(res, result);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'User logged in successfully',
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken} = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    setAuthCookie(res, result.accessToken);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: 'Set access token successfully',
        data: null,
    });
});

export const AuthController = {loginUser, refreshToken};
