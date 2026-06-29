// Prisma 7 config - kun brugt til `prisma generate`
// Database-forbindelsen i runtime håndteres af better-sqlite3 i lib/db.ts
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
});
