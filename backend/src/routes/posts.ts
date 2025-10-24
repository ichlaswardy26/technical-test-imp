import { Hono } from 'hono';
import { prisma } from '../lib/prisma.ts';
import { supabaseAdmin } from '../lib/supabase.ts';
import { HTTPException } from 'hono/http-exception';
import { verify } from 'hono/jwt';
import 'dotenv/config';

const posts = new Hono();

const getUserFromToken = async (c: any): Promise<string> => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) throw new HTTPException(401, { message: 'Unauthorized' });
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = (await verify(token, process.env.JWT_SECRET || 'secret')) as { sub?: unknown };
        if (!payload || typeof payload.sub !== 'string') {
            throw new HTTPException(401, { message: 'Invalid token' });
        }
        return payload.sub;
    } catch {
        throw new HTTPException(401, { message: 'Invalid token' });
    }
};

posts.get('/', async (c) => {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const skip = (page - 1) * limit;

    const result = await Promise.all([
        prisma.post.findMany({
            skip,
            take: limit,
            include: { user: { select: { email: true } } },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.post.count(),
    ]);
    const posts = result[0];
    const total = result[1];

    return c.json({
        posts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
});

posts.get('/:id', async (c) => {
    const id = c.req.param('id');
    const post = await prisma.post.findUnique({
        where: { id },
        include: { user: { select: { email: true } } },
    });
    if (!post) throw new HTTPException(404, { message: 'Post not found' });
    return c.json(post);
});

posts.post('/', async (c) => {
    const userId = await getUserFromToken(c);
    const body = await c.req.parseBody();
    const title = String(body.title);
    const content = String(body.content);
    const thumbnailFile = body.thumbnailFile;

    let thumbnailUrl = null;
    if (thumbnailFile instanceof File) {
        const file = thumbnailFile;
        const fileName = `${userId}/${Date.now()}-${file.name}`;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new HTTPException(400, {
                message: 'Invalid file type. Only JPG, PNG, GIF, WEBP allowed.',
            });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data, error } = await supabaseAdmin.storage
            .from('post-thumbnails')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new HTTPException(500, {
                message: 'Failed to upload image to storage',
                cause: error.message,
            });
        }

        thumbnailUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/post-thumbnails/${data.path}`;
    }

    const post = await prisma.post.create({
        data: {
            title,
            content,
            thumbnail: thumbnailUrl,
            userId,
        },
    });

    return c.json(post, 201);
});

posts.put('/:id', async (c) => {
    const userId = await getUserFromToken(c);
    const id = c.req.param('id');
    const { title, content } = await c.req.json();

    const post = await prisma.post.update({
        where: { id, userId },
        data: { title, content, updatedAt: new Date() },
    });

    return c.json(post);
});

posts.delete('/:id', async (c) => {
    const userId = await getUserFromToken(c);
    const id = c.req.param('id');

    await prisma.post.delete({
        where: { id, userId },
    });

    return c.json({ message: 'Post deleted' });
});

export default posts;