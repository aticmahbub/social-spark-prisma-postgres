import z from 'zod';

export const createEventSchema = z.object({
    name: z.string({error: 'Event name is required'}),
    type: z.string({error: 'Event type is required'}),
    description: z.string({error: 'Description is required'}),
    date: z.string({error: 'Event date is required'}), // string for FormData, parse to Date in controller
    location: z.string({error: 'Location is required'}),
    minParticipants: z
        .number({error: 'minParticipants must be a number'})
        .int()
        .min(1, {message: 'Minimum participants must be at least 1'}),
    maxParticipants: z
        .number({error: 'maxParticipants must be a number'})
        .int()
        .min(1, {message: 'Maximum participants must be at least 1'}),
    joiningFee: z
        .number({error: 'Joining fee must be a number'})
        .nonnegative({message: 'Joining fee cannot be negative'}),
    status: z.enum(['OPEN', 'CLOSED']).optional(), // defaults to OPEN
    image: z.string().url().optional(), // optional URL for event image
});

export const EventValidation = {createEventSchema};
