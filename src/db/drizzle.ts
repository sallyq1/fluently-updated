import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const sql = neon("postgresql://fluentlydb_owner:a7u4pqTDHRfE@ep-weathered-glitter-a5w3yyp1.us-east-2.aws.neon.tech/fluentlydb?sslmode=require");
const db = drizzle(sql, { schema });

export default db;
