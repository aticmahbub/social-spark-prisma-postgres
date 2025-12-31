import type {JwtPayload} from 'jsonwebtoken';
import {catchAsync} from '../../utils/catchAsync.js';
import type {Request, Response} from 'express';
import {ReviewService} from './review.service.js';
import {sendResponse} from '../../utils/sendResponse.js';

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload & {id: string};

    const result = await ReviewService.createReview(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
});

export const ReviewController = {
    createReview,
};
