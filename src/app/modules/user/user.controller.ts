import type {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {UserService} from './user.service.js';
import pick from '../../utils/pick.js';
import {userFilterableFields} from './user.constants.js';

const createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.createUser(req);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: 'User Created Successfully',
        data: user,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields); // searching , filtering
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); // pagination and sorting

    const result = await UserService.getAllUsers(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'User retrive successfully!',
        meta: result.meta,
        data: result.data,
    });
});

export const UserController = {createUser, getAllUsers};
