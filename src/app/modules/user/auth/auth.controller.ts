import type {NextFunction, Request, Response} from 'express';
import {catchAsync} from '../../../utils/catchAsync.js';
import {sendResponse} from '../../../utils/sendResponse.js';
import {UserService} from '../user.service.js';
import {AuthService} from './auth.service.js';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const user = await AuthService.loginUser(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User logged in successfully',
        data: user,
    });
});

export const AuthController = {loginUser};
