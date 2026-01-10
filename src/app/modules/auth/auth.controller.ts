import type {NextFunction, Request, Response} from 'express';
import {AuthService} from './auth.service.js';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {setAuthCookie} from '../../utils/setAuthCookie.js';
import {envVars} from '../../../config/index.js';

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//     const result = await AuthService.loginUser(req.body);

//     setAuthCookie(res, result);

//     sendResponse(res, {
//         success: true,
//         statusCode: 200,
//         message: 'User logged in successfully',
//         data: result,
//     });
// });
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const accessTokenExpiresIn = envVars.JWT.JWT_ACCESS_EXPIRES as string;
    const refreshTokenExpiresIn = envVars.JWT.JWT_REFRESH_EXPIRES as string;

    // convert accessTokenExpiresIn to milliseconds
    let accessTokenMaxAge = 0;
    const accessTokenUnit = accessTokenExpiresIn.slice(-1);
    const accessTokenValue = parseInt(accessTokenExpiresIn.slice(0, -1));
    if (accessTokenUnit === 'y') {
        accessTokenMaxAge = accessTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === 'M') {
        accessTokenMaxAge = accessTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === 'w') {
        accessTokenMaxAge = accessTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === 'd') {
        accessTokenMaxAge = accessTokenValue * 24 * 60 * 60 * 1000;
    } else if (accessTokenUnit === 'h') {
        accessTokenMaxAge = accessTokenValue * 60 * 60 * 1000;
    } else if (accessTokenUnit === 'm') {
        accessTokenMaxAge = accessTokenValue * 60 * 1000;
    } else if (accessTokenUnit === 's') {
        accessTokenMaxAge = accessTokenValue * 1000;
    } else {
        accessTokenMaxAge = 1000 * 60 * 60; // default 1 hour
    }

    // convert refreshTokenExpiresIn to milliseconds
    let refreshTokenMaxAge = 0;
    const refreshTokenUnit = refreshTokenExpiresIn.slice(-1);
    const refreshTokenValue = parseInt(refreshTokenExpiresIn.slice(0, -1));
    if (refreshTokenUnit === 'y') {
        refreshTokenMaxAge = refreshTokenValue * 365 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === 'M') {
        refreshTokenMaxAge = refreshTokenValue * 30 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === 'w') {
        refreshTokenMaxAge = refreshTokenValue * 7 * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === 'd') {
        refreshTokenMaxAge = refreshTokenValue * 24 * 60 * 60 * 1000;
    } else if (refreshTokenUnit === 'h') {
        refreshTokenMaxAge = refreshTokenValue * 60 * 60 * 1000;
    } else if (refreshTokenUnit === 'm') {
        refreshTokenMaxAge = refreshTokenValue * 60 * 1000;
    } else if (refreshTokenUnit === 's') {
        refreshTokenMaxAge = refreshTokenValue * 1000;
    } else {
        refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 30; // default 30 days
    }
    const result = await AuthService.loginUser(req.body);
    const {refreshToken, accessToken} = result;
    res.cookie('accessToken', accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: accessTokenMaxAge,
    });
    res.cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: refreshTokenMaxAge,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Logged in successfully!',
        data: {refreshToken, accessToken},
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
