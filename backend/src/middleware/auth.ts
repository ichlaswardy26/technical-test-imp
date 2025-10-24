import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';
import 'dotenv/config';

export const verifySupabaseJWT = async (c: any) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Missing or invalid Authorization header' });
    }

    const jwt = authHeader.substring(7);

    try {
        const { payload } = await jwtVerify(jwt, new TextEncoder().encode(process.env.SUPABASE_ANON_KEY));
        return payload.sub as string;
    } catch (e) {
        throw new HTTPException(401, { message: 'Invalid or expired token' });
    }
};