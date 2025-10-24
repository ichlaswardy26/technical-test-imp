# 🚀 Restful API with Hono.js, Supabase, Prisma & Scalar

A production-ready **RESTful API** built with modern tools:
- **Hono.js** – Ultra-fast web framework
- **Supabase** – Auth + Database + Storage
- **Prisma ORM** – Type-safe database access
- **Scalar** – Beautiful, interactive API documentation

Implements core features: **Authentication** and **Post Management with Image Thumbnails**.

---

## ✨ Features

### 🔐 Authentication
- ✅ Sign Up – Create new account
- ✅ Sign In – Log in with credentials
- ✅ Sign Out – End current session

### 📝 Post Management (CRUD + Pagination)
- ✅ List all posts (with pagination)
- ✅ View post details
- ✅ Create new post (with image thumbnail upload to Supabase Storage)
- ✅ Edit existing post
- ✅ Delete post

### 🛡️ Developer Experience
- ✅ Global structured error handling
- ✅ Interactive API docs with **Scalar**
- ✅ Type-safe with TypeScript & Zod (optional)
- ✅ Environment-based config (`.env`)
- ✅ Production-ready error responses

---

## 📦 Tech Stack

| Layer | Technology |
|------|------------|
| **Runtime** | Node.js |
| **Framework** | [Hono.js](https://hono.dev/) |
| **Database** | Supabase PostgreSQL |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Auth & Storage** | [Supabase](https://supabase.com/) |
| **API Docs** | [Scalar](https://scalar.com/) |
| **Validation** | Zod (optional) |
| **Error Handling** | Custom global middleware |

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [Supabase account](https://supabase.com/)
- Git

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/your-username/technical-test-imp.git
cd technical-test-imp/backend
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Get your credentials from **Settings → API**:
   - `Project URL`
   - `anon public` key
   - `service_role` key

### 4. Configure environment

Create a `.env` file:

```env
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret (change in production!)
JWT_SECRET=super-secret-change-me-in-production

# Prisma (get DB password from Supabase → Settings → Database)
DATABASE_URL=postgresql://postgres:your-db-password@db.your-project-ref.supabase.co:5432/postgres

# Node
NODE_ENV=development
PORT=3000
```

> 🔒 **Never commit `.env` to Git!** It’s already in `.gitignore`.

### 5. Set up Supabase Storage

1. In Supabase Dashboard → **Storage**
2. Create a new bucket named: `post-thumbnails`
3. Set it to **Public**

### 6. Push Prisma schema

```bash
npx prisma db push
```

### 7. Start the server

```bash
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:3000
📚 Docs: http://localhost:3000/docs
```

---

## 📚 API Documentation

Visit **[http://localhost:3000/docs](http://localhost:3000/docs)** to explore interactive API docs powered by **Scalar**.

![Scalar Docs Preview](https://scalar.com/og.png)

All endpoints, request/response schemas, and examples are documented.

---

## 🧪 Testing Endpoints

### Sign Up
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'
```

### Sign In
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'
```

### Create Post (with image)
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Post" \
  -F "content=Hello world!" \
  -F "thumbnailFile=@/path/to/image.jpg"
```

### List Posts
```bash
curl "http://localhost:3000/posts?page=1&limit=5"
```

---

## 📁 Project Structure

```
/backend
├── src/
│   ├── index.ts              # Entry point
│   ├── middleware/
│   │   └── errorHandler.ts   # Global error handler
│   ├── routes/
│   │   ├── auth.ts           # Auth endpoints
│   │   └── posts.ts          # Post CRUD endpoints
│   └── lib/
│       ├── prisma.ts         # Prisma client
│       └── supabase.ts       # Supabase clients
├── public/
│   └── openapi.json          # OpenAPI spec for Scalar
├── prisma/
│   └── schema.prisma         # Database schema
├── .env                      # Environment variables (gitignored)
├── .gitignore
├── package.json
└── README.md
```

---

## 🔒 Security Notes

- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** in frontend or public repos
- Use **Row Level Security (RLS)** in Supabase for production
- Validate and sanitize all user inputs
- Use HTTPS in production
- Rotate `JWT_SECRET` regularly

---

## 🧩 Environment Variables

| Variable | Required | Description |
|---------|--------|-------------|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Public API key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | **Server-only** admin key |
| `JWT_SECRET` | ✅ | Secret for signing tokens |
| `DATABASE_URL` | ✅ | Prisma connection string |
| `NODE_ENV` | ❌ | `development` or `production` |
| `PORT` | ❌ | Server port (default: 3000) |

---

## 🧪 Error Responses

All errors follow a consistent structure:

```json
{
  "success": false,
  "error": {
    "code": "ERR_INVALID_JSON",
    "message": "Invalid JSON in request body",
    "details": "Ensure your request has valid JSON..."
  }
}
```

| Error Code | HTTP Status | When It Occurs |
|-----------|------------|----------------|
| `ERR_400` | 400 | Bad request |
| `ERR_401` | 401 | Unauthorized |
| `ERR_404` | 404 | Not found |
| `ERR_VALIDATION` | 400 | Zod validation failed |
| `ERR_INVALID_JSON` | 400 | Malformed JSON |
| `ERR_PRISMA_P2002` | 500 | Email already exists |
| `ERR_SUPABASE` | 401 | Supabase auth error |
| `ERR_INTERNAL` | 500 | Unexpected server error |

> 💡 In **development**, `details` includes stack traces. In **production**, they’re hidden.

---

## 📦 Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server with auto-reload |
| `npm run build` | Build for production (if using TS) |
| `npx prisma studio` | Open Prisma Studio GUI |
| `npx prisma generate` | Regenerate Prisma Client |

---

## 🌐 Deployment

### Vercel / Railway / Render
1. Set all `.env` variables in your hosting dashboard
2. Ensure `NODE_ENV=production`
3. Deploy!

### Docker (optional)
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

PRs welcome! Please:
1. Follow existing code style
2. Add/update tests if applicable
3. Update this README if needed

---

## 📜 License

MIT © [Your Name]

---

## 🙌 Acknowledgements

- [Hono.js](https://hono.dev/) – For the blazing-fast foundation
- [Supabase](https://supabase.com/) – Open-source Firebase alternative
- [Prisma](https://prisma.io/) – Next-gen Node.js & TypeScript ORM
- [Scalar](https://scalar.com/) – The most beautiful API reference

---

> ✨ **Happy coding!** If you have questions, open an issue or reach out.