import { z } from 'zod';

export const SignupInput = z.object({
    email: z.email(),
    password: z.string().min(6),
});

export const SigninInput = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export const AuthResponse = z.object({
    token: z.string(),
    user: z.object({
        id: z.string(),
        email: z.string(),
    }),
});