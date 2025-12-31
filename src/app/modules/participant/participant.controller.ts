import type {Request, Response} from 'express';
import {catchAsync} from '../../utils/catchAsync.js';
import type {JwtPayload} from 'jsonwebtoken';
import {sendResponse} from '../../utils/sendResponse.js';
import {ParticipantService} from './participant.service.js';

const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as JwtPayload & {id: string};
    const {eventId} = req.params;

    const result = await ParticipantService.getEventParticipants(
        user,
        eventId as string,
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Participants fetched successfully',
        data: result,
    });
});

export const ParticipantController = {
    getEventParticipants,
};
