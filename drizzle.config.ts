import "dotenv/config";
// import type { Config } from "drizzle-kit";

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql', // Specifies PostgreSQL as the database type
  dbCredentials: {
    url:"postgresql://fluentlydb_owner:a7u4pqTDHRfE@ep-weathered-glitter-a5w3yyp1.us-east-2.aws.neon.tech/fluentlydb?sslmode=require",
  },
});


