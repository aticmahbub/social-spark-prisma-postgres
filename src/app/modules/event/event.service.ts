import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';
import type {CreateEventInput} from './event.types.js';
import {EventStatus, Role} from '../../../generated/enums.js';
import {calculatePagination, type IOptions} from '../../utils/pagination.js';
import type {Prisma} from '../../../generated/client.js';
import {eventFilterableFields} from './event.constants.js';
import {fi} from 'zod/locales';
import type {equal} from 'assert';

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

const getEvents = async (filters: any, options: IOptions) => {
    const {page, limit, skip, sortBy, sortOrder} = calculatePagination(options);
    const {search, ...filterData} = filters;

    const andConditions: Prisma.EventWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: eventFilterableFields.map((field) => ({
                [field]: {contains: search, mode: 'insensitive'},
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {equals: (filterData as any)[key]},
            })),
        });
    }

    const whereConditions: Prisma.EventWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.event.findMany({
        skip,
        take: limit,
        where: {AND: andConditions},
        orderBy: {[sortBy]: sortOrder},
    });

    const total = await prisma.event.count({
        where: whereConditions,
    });

    return {
        data: result,
        meta: {
            page,
            limit,
            total,
        },
    };
};

const joinEvent = async (user: JwtPayload, eventId: string) => {
    if (user.role !== Role.USER) {
        throw new Error('Only users can join events');
    }

    const event = await prisma.event.findUnique({
        where: {id: eventId},
        include: {
            participants: true,
        },
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.status !== EventStatus.OPEN) {
        throw new Error('Event is not open for joining');
    }

    if (event.hostId === user.id) {
        throw new Error('Host cannot join their own event');
    }

    if (event.participants.length >= event.maxParticipants) {
        throw new Error('Event is full');
    }

    const alreadyJoined = await prisma.participant.findUnique({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId,
            },
        },
    });

    if (alreadyJoined) {
        throw new Error('You already joined this event');
    }

    const participant = await prisma.participant.create({
        data: {
            userId: user.id,
            eventId,
        },
    });

    return participant;
};

export const EventService = {createEvent, getEvents, joinEvent};
