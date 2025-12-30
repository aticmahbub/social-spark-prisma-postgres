import type {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {EventService} from './event.service.js';
import type {JwtPayload} from 'jsonwebtoken';

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await EventService.createEvent(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Booking created successfully',
        data: result,
    });
});

const getEvents = catchAsync(async (req: Request, res: Response) => {
    const result = await EventService.getEvents();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Events retrieved successfully',
        data: result,
    });
});

export const EventController = {createEvent, getEvents};
