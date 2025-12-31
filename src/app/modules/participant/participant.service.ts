import type {JwtPayload} from 'jsonwebtoken';
import {Role} from '../../../generated/enums.js';
import {prisma} from '../../../lib/prisma.js';

const getEventParticipants = async (
    user: JwtPayload & {id: string},
    eventId: string,
) => {
    if (user.role !== Role.HOST) {
        throw new Error('Only hosts can view participants');
    }

    const event = await prisma.event.findUnique({
        where: {id: eventId},
        select: {
            id: true,
            name: true,
            hostId: true,
            participants: {
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            location: true,
                        },
                    },
                },
            },
            _count: {
                select: {participants: true},
            },
        },
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.hostId !== user.id) {
        throw new Error('You are not the owner of this event');
    }

    return {
        eventId: event.id,
        eventName: event.name,
        totalParticipants: event._count.participants,
        participants: event.participants.map((p) => ({
            ...p.user,
        })),
    };
};

export const ParticipantService = {
    getEventParticipants,
};
