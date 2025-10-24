import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import auth from './routes/auth.ts';
import posts from './routes/posts.ts';
import { Scalar } from '@scalar/hono-api-reference';
import { serveStatic } from '@hono/node-server/serve-static';
import { HTTPException } from 'hono/http-exception';
import { cors } from 'hono/cors';
import 'dotenv/config';

type Env = {
  Variables: {};
};

const app = new Hono<Env>();

app.onError((err, c) => {
    console.error('❌ Global error:', err);

    if (err instanceof HTTPException) {
        return c.json(
            {
                success: false,
                error: {
                    code: `ERR_${err.status}`,
                    message: err.message || 'An error occurred',
                    details: err.cause ? String(err.cause) : null,
                },
            },
            err.status
        );
    }

    if (err?.name === 'ZodError') {
        return c.json(
            {
                success: false,
                error: {
                    code: 'ERR_VALIDATION',
                    message: 'Validation failed',
                    details: (err as any).flatten().fieldErrors,
                },
            },
            400
        );
    }

    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'ERR_INVALID_JSON',
                    message: 'Invalid JSON in request body',
                    details: 'Ensure your request has valid JSON and Content-Type: application/json',
                },
            },
            400
        );
    }

    if (typeof err === 'object' && err !== null && 'code' in err && typeof (err as any).code === 'string' && (err as any).code.startsWith('P')) {
        let message = 'Database error';
        if ((err as any).code === 'P2002') {
            message = 'Unique constraint failed (e.g., email already exists)';
        }
        return c.json(
            {
                success: false,
                error: {
                    code: `ERR_PRISMA_${(err as any).code}`,
                    message,
                    details: process.env.NODE_ENV === 'development' ? (err as any).message : null,
                },
            },
            500
        );
    }

    if (err?.name === 'AuthApiError' || err?.message?.includes('supabase')) {
        return c.json(
            {
                success: false,
                error: {
                    code: 'ERR_SUPABASE',
                    message: err.message || 'Authentication failed',
                    details: process.env.NODE_ENV === 'development' ? err : null,
                },
            },
            401
        );
    }

    return c.json(
        {
            success: false,
            error: {
                code: 'ERR_INTERNAL',
                message: process.env.NODE_ENV === 'production'
                    ? 'Something went wrong'
                    : err.message || 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? {
                    name: err.name,
                    message: err.message,
                    stack: err.stack?.split('\n').slice(0, 5),
                } : null,
            },
        },
        500
    );
});

app.get(
  '/docs',
  Scalar({
    url: '/openapi.json',
    pageTitle: 'Restful API Documentation',
  })
);

app.get('/openapi.json', serveStatic({ path: './public/openapi.json' }));

app.use(
    '*',
    cors({
        origin: (origin) =>
            origin === 'https://technical-test-imp-production.up.railway.app' ? origin : '*',
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

app.route('/auth', auth);
app.route('/posts', posts);

app.get('/', (c) => c.text('API is running!'));

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 Server running on http://localhost:${port}`);
console.log(`📚 Docs: http://localhost:${port}/docs`);

serve(app);