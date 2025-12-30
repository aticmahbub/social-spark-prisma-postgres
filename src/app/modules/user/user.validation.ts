import z from 'zod';

const createUserValidationSchema = z.object({
    name: z.string({error: 'Name must be string'}),
    email: z.email({error: 'Invalid email format'}),
    password: z.string({error: 'Password must be string'}),
    role: z.enum(['USER', 'HOST']).optional(),
    bio: z.string({error: 'Bio must be string'}).optional(),
    image: z.string({error: 'Image must be string'}).optional(),
    location: z.string({error: 'Location must be string'}).optional(),
});

export const UserValidation = {createUserValidationSchema};
