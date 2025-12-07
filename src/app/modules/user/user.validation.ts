import z from 'zod';

const createUserValidationSchema = z.object({
    name: z.string({error: 'Name must be string'}),
    email: z.email({error: 'Invalid email format'}),
    password: z.string({error: 'Password must be string'}),
});

export const UserValidation = {createUserValidationSchema};
