import type {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {UserService} from './user.service.js';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req);
    console.log(req.file);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User Created Successfully',
        data: user,
    });
});

export const UserController = {createUser};
