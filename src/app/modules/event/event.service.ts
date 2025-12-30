import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';
import type {CreateEventInput} from './event.types.js';
import {Role} from '../../../generated/enums.js';

const createEvent = async (user: JwtPayload, data: CreateEventInput) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can create events');
    }

    const event = await prisma.event.create({
        data: {
            ...data,
            host: {
                connect: {id: user.id},
            },
        },
    });

    return event;
};

const getEvents = async () => {
    const events = await prisma.event.findMany({
        include: {
            host: true,
        },
    });
    return events;
};
export const EventService = {createEvent, getEvents};
