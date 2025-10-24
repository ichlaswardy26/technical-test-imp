import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { supabaseClient } from '../lib/supabase.js';
import { prisma } from '../lib/prisma.js';
import 'dotenv/config';

const auth = new Hono();

auth.post('/signup', async (c) => {
    const { email, password } = await c.req.json();

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return c.json({ error: error.message }, 400);

    const supabaseUserId = data.user?.id;
    if (!supabaseUserId) {
        return c.json({ error: 'User creation failed' }, 500);
    }

    try {
        await prisma.user.create({
            data: {
                id: supabaseUserId,
                email: email,
            },
        });
    } catch (dbError) {
        console.error('Failed to sync user to DB:', dbError);
    }

    return c.json({ message: 'User created', userId: supabaseUserId });
});

auth.post('/signin', async (c) => {
    const { email, password } = await c.req.json();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return c.json({ error: error.message }, 401);
    }

    const token = await sign({ sub: data.user.id, email }, process.env.JWT_SECRET || 'secret');

    return c.json({ token });
});

auth.post('/signout', async (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) return c.json({ error: 'Unauthorized' }, 401);

    return c.json({ message: 'Signed out' });
});

export default auth;