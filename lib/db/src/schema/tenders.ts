import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tendersTable = pgTable("tenders", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  referenceNumber: text("reference_number").notNull().unique(),
  description: text("description"),
  status: text("status").notNull().default("open"),
  category: text("category"),
  closingDate: timestamp("closing_date", { withTimezone: true }),
  publishedDate: timestamp("published_date", { withTimezone: true }),
  fileUrl: text("file_url"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTenderSchema = createInsertSchema(tendersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tendersTable.$inferSelect;
