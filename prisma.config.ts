import path from 'node:path';
import { defineConfig } from 'prisma/config';

const dbPath = path.join(process.cwd(), 'prisma/dev.db');
const url = process.env.DATABASE_URL ?? `file:${dbPath}`;

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url,
  },
});
