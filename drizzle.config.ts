import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://sehatjiwa:sehatjiwa@localhost:5432/sehatjiwa",
  },
  verbose: true,
  strict: true,
});