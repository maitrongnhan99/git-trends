# Using Prisma with Supabase

This guide explains how to use Prisma as your ORM with Supabase as your PostgreSQL database provider.

## Setup Guide

### 1. Configure Connection URL

In your `.env` file, update the `DATABASE_URL` and `DIRECT_URL` variables:

```env
# For connection pooling (use this as your primary connection)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# For direct connection (used for migrations)
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 2. Configure Prisma Schema

Your `prisma/schema.prisma` should include both URLs:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")  // Connection pooling URL
  directUrl = env("DIRECT_URL")    // Direct connection URL for migrations
}
```

## Database Migrations

### Creating Your Initial Schema

1. **Create your models in schema.prisma**:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

2. **Generate and apply migration**:

```bash
yarn prisma:migrate:dev --name init
```

This creates a migration in `prisma/migrations` and applies it to your database.

### Deploying Migrations to Production

When deploying to production, use:

```bash
yarn prisma:migrate:deploy
```

This applies all pending migrations without generating new ones.

## Database Synchronization

### Push Schema Changes Without Migrations

For quick updates during development:

```bash
yarn prisma:push
```

This synchronizes your schema with the database without creating migration files.

### Pull Database Schema

To synchronize your Prisma schema with the current database schema:

```bash
yarn prisma:pull
```

## Working with Prisma Client

### Generate Prisma Client

After schema changes, generate the Prisma client:

```bash
yarn prisma:generate
```

### Using Prisma Client in Your Code

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a user
async function createUser(email: string, name: string) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return user;
}

// Query users
async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}
```

## Database Administration

### Prisma Studio

Launch Prisma Studio to visually manage your database:

```bash
yarn prisma:studio
```

This opens a browser interface at http://localhost:5555.

## Troubleshooting

### Connection Issues

If you encounter connection problems:

1. **Check your credentials** in `.env`
2. **Verify IP restrictions** in Supabase Dashboard
3. **Test connection** with:
   ```bash
   yarn db:check
   ```

### Schema Conflicts

If you get schema conflicts:

1. **Reset the database** in development:
   ```bash
   yarn prisma migrate reset
   ```
2. **Introspect the database**:
   ```bash
   yarn prisma:pull
   ```

## Notes on Supabase Row Level Security (RLS)

Supabase uses PostgreSQL's Row Level Security for data access control. When using Prisma:

1. **Direct Prisma access bypasses RLS** - be careful with direct Prisma queries in client-side code
2. **Consider creating a service role** in Supabase for your backend API
3. **Use Supabase SDK** for client-side queries that should respect RLS policies

## Available Scripts

We've added these scripts to package.json for convenience:

```json
"scripts": {
  "prisma:studio": "prisma studio",
  "prisma:generate": "prisma generate",
  "prisma:migrate:dev": "prisma migrate dev",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "prisma:push": "prisma db push",
  "prisma:pull": "prisma db pull"
}
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
