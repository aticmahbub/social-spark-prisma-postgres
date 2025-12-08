import type {NextFunction, Request, Response} from 'express';
import {AuthService} from './auth.service.js';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body);
    const {accessToken, refreshToken} = result;
    res.cookie('accessToken', accessToken, {
        secure: true,
        sameSite: true,
        httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
        secure: true,
        sameSite: true,
        httpOnly: true,
    });

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User logged in successfully',
        data: 'user',
    });
});

export const AuthController = {loginUser};
