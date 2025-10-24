import { z } from 'zod';

export const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    thumbnail: z.string().url().nullable(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CreatePostInput = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
});

export const UpdatePostInput = CreatePostInput;

export const PostListResponse = z.object({
    posts: z.array(PostSchema),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        pages: z.number(),
    }),
});
