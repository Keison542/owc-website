import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const legislationTable = pgTable("legislation", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: text("type").notNull().default("act"),
  year: integer("year"),
  fileUrl: text("file_url"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLegislationSchema = createInsertSchema(legislationTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLegislation = z.infer<typeof insertLegislationSchema>;
export type Legislation = typeof legislationTable.$inferSelect;
