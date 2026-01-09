import type {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync.js';
import {sendResponse} from '../../utils/sendResponse.js';
import {EventService} from './event.service.js';
import type {JwtPayload} from 'jsonwebtoken';
import pick from '../../utils/pick.js';
import {eventFilterableFields} from './event.constants.js';

const createEvent = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await EventService.createEvent(user, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Event created successfully',
        data: result,
    });
});

const getEvents = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, eventFilterableFields);
    const {from, to, date} = req.query;

    const result = await EventService.getEvents(filters, options, {
        from: from as string,
        to: to as string,
        date: date as string,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Events retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.params;

    const result = await EventService.getEventById(id!);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event fetched successfully',
        data: result,
    });
});

const joinEvent = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload;
    const eventId = req.body.eventId;

    const result = await EventService.joinEvent(user, eventId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Joined event successfully',
        data: result,
    });
});

const getMyHostedEvents = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload & {id: string};

    const result = await EventService.getMyHostedEvents(user);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Hosted events fetched successfully',
        data: result,
    });
});

const updateMyEvent = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload & {id: string};
    const {eventId} = req.params;

    const result = await EventService.updateMyEvent(
        user,
        eventId as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Event updated successfully',
        data: result,
    });
});

export const EventController = {
    createEvent,
    getEvents,
    getEventById,
    joinEvent,
    getMyHostedEvents,
    updateMyEvent,
};
