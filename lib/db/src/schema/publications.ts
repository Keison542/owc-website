import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const publicationsTable = pgTable("publications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: text("type").notNull().default("report"),
  fileUrl: text("file_url"),
  coverImageUrl: text("cover_image_url"),
  year: integer("year"),
  status: text("status").notNull().default("draft"),
  authorId: integer("author_id"),
  authorName: text("author_name"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPublicationSchema = createInsertSchema(publicationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Publication = typeof publicationsTable.$inferSelect;
