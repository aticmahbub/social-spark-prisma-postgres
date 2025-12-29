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
        statusCode: 201,
        message: 'User logged in successfully',
        data: result,
    });
});

export const AuthController = {loginUser};
