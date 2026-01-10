import type {JwtPayload} from 'jsonwebtoken';
import {prisma} from '../../../lib/prisma.js';
import type {CreateEventInput} from './event.types.js';
import {EventStatus, Role} from '../../../generated/enums.js';
import {calculatePagination, type IOptions} from '../../utils/pagination.js';
import type {Prisma} from '../../../generated/client.js';
import {eventFilterableFields} from './event.constants.js';
import {v4 as uuid} from 'uuid';
import {stripe} from '../../../lib/stripe.js';
import {envVars} from '../../../config/index.js';
import AppError from '../../errorHelpers/appError.js';
import {fileUploader} from '../../utils/fileUploader.js';
import type {Request} from 'express';

const createEvent = async (req: Request) => {
    const user = req.user;
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can create events');
    }

    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult?.secure_url;
    }

    const data = req.body;

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

const getEvents = async (
    filters: any,
    options: IOptions,
    dateFilters?: {
        from?: string;
        to?: string;
        date?: string;
    },
) => {
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

    /**
🔹 Upcoming events
GET /api/events

🔹 Events from a date
GET /api/events?from=2025-02-01

🔹 Events between date & time
GET /api/events?from=2025-02-01T10:00&to=2025-02-01T18:00

🔹 Events on a specific day
GET /api/events?date=2025-02-01

🔹 Sorted by event time
GET /api/events?sortBy=date&sortOrder=asc */

    if (dateFilters?.from || dateFilters?.to) {
        const dateFilter: Prisma.DateTimeFilter = {};

        if (dateFilters.from) {
            dateFilter.gte = new Date(dateFilters.from);
        }

        if (dateFilters.to) {
            dateFilter.lte = new Date(dateFilters.to);
        }

        andConditions.push({
            date: dateFilter,
        });
    }

    if (dateFilters?.date) {
        const start = new Date(dateFilters.date);
        const end = new Date(dateFilters.date);
        end.setHours(23, 59, 59, 999);

        andConditions.push({
            date: {
                gte: start,
                lte: end,
            },
        });
    }
    // ✅ Default visibility
    // andConditions.push({status: 'OPEN'}, {date: {gte: new Date()}});

    const whereConditions: Prisma.EventWhereInput =
        andConditions.length > 0 ? {AND: andConditions} : {};

    const result = await prisma.event.findMany({
        skip,
        take: limit,
        where: {AND: andConditions},
        orderBy: {[sortBy]: sortOrder},
        include: {
            _count: {
                select: {
                    participants: true,
                },
            },
            participants: true,
        },
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

const getEventById = async (eventId: string) => {
    const event = await prisma.event.findUnique({
        where: {id: eventId},
        include: {
            host: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            participants: {
                select: {
                    id: true,
                    userId: true,
                },
            },
            _count: {
                select: {
                    participants: true,
                    reviews: true,
                },
            },
        },
    });

    console.log(event);

    if (!event) {
        throw new AppError(404, 'Event not found');
    }

    return {
        event,
        // participantCount: event._count.participants,
        // reviewCount: event._count.reviews,
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

    const result = await prisma.$transaction(async (prisma) => {
        const participant = await prisma.participant.create({
            data: {
                userId: user.id,
                eventId,
            },
        });

        const uuidSession = uuid();

        const payment = await prisma.payment.create({
            data: {
                amount: event.joiningFee,
                userId: user.id,
                eventId: event.id,
                transactionId: uuidSession,
                status: 'PENDING',
            },
        });
        //         // Increment participant count atomically
        //         // Using raw SQL for atomic increment
        //         // Alternatively, you can use a separate field to track count

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {name: event?.name},
                        unit_amount: event?.joiningFee * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                participantId: participant.id,
                paymentId: payment.id,
                paymentSessionId: uuidSession,
            },
            success_url: `${envVars.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${envVars.CLIENT_URL}/payment-cancel`,
        });
        return {paymentUrl: session.url};
    });
    return result;
};

const getMyHostedEvents = async (user: JwtPayload) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can access hosted events');
    }

    const events = await prisma.event.findMany({
        where: {
            hostId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            participants: {
                select: {
                    id: true,
                },
            },
        },
    });

    return events.map((event) => ({
        ...event,
        participantCount: event.participants.length,
    }));
};

const updateMyEvent = async (
    user: JwtPayload & {id: string},
    eventId: string,
    payload: Partial<Prisma.EventUpdateInput>,
) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can update events');
    }

    const event = await prisma.event.findUnique({
        where: {id: eventId},
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.hostId !== user.id) {
        throw new Error('You are not the owner of this event');
    }

    const forbiddenFields = ['hostId', 'createdAt', 'updatedAt'];

    forbiddenFields.forEach((field) => delete (payload as any)[field]);

    const updatedEvent = await prisma.event.update({
        where: {id: eventId},
        data: payload,
    });

    return updatedEvent;
};

const deleteHostedEvent = async (user: JwtPayload, eventId: string) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can delete events');
    }
    const event = await prisma.event.findUnique({
        where: {id: eventId},
    });
    console.log(event);
    if (!event) {
        throw new Error('Event not found');
    }

    if (event.hostId !== user.id) {
        throw new Error('You are not the owner of this event');
    }

    await prisma.event.delete({
        where: {id: eventId},
    });

    return {id: eventId};
};

export const EventService = {
    createEvent,
    getEvents,
    getEventById,
    joinEvent,
    getMyHostedEvents,
    updateMyEvent,
    deleteHostedEvent,
};
