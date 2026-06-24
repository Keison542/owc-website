import { Router, type IRouter } from "express";
import { eq, desc, and, count } from "drizzle-orm";
import { db, publicationsTable } from "@workspace/db";
import {
  ListPublicationsQueryParams,
  ListPublicationsResponse,
  CreatePublicationBody,
  GetRecentPublicationsResponse,
  GetPublicationByIdParams,
  GetPublicationByIdResponse,
  UpdatePublicationParams,
  UpdatePublicationBody,
  UpdatePublicationResponse,
  DeletePublicationParams,
} from "@workspace/api-zod";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

router.get("/publications", async (req, res): Promise<void> => {
  const params = ListPublicationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (params.data.type) conditions.push(eq(publicationsTable.type, params.data.type));
  if (params.data.year) conditions.push(eq(publicationsTable.year, params.data.year));
  if (params.data.status) conditions.push(eq(publicationsTable.status, params.data.status));

  const items = await db
    .select()
    .from(publicationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(publicationsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(publicationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(ListPublicationsResponse.parse({ items: items.map(serializeDates), total: Number(total), page, limit }));
});

router.get("/publications/recent", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(publicationsTable)
    .where(eq(publicationsTable.status, "published"))
    .orderBy(desc(publicationsTable.publishedAt))
    .limit(6);
  res.json(GetRecentPublicationsResponse.parse(items.map(serializeDates)));
});

router.get("/publications/:id", async (req, res): Promise<void> => {
  const params = GetPublicationByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(publicationsTable).where(eq(publicationsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  res.json(GetPublicationByIdResponse.parse(serializeDates(item)));
});

router.post("/publications", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreatePublicationBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;
  if (!data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();
  }
  const insertData = { ...data } as Record<string, unknown>;
  if (insertData.publishedAt) insertData.publishedAt = new Date(insertData.publishedAt as string);
  const [item] = await db.insert(publicationsTable).values(insertData as typeof publicationsTable.$inferInsert).returning();
  res.status(201).json(GetPublicationByIdResponse.parse(serializeDates(item)));
});

router.patch("/publications/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdatePublicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePublicationBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.publishedAt !== undefined) {
    updates.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
  }
  const [item] = await db.update(publicationsTable).set(updates).where(eq(publicationsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  res.json(UpdatePublicationResponse.parse(serializeDates(item)));
});

router.delete("/publications/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeletePublicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(publicationsTable).where(eq(publicationsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Publication not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
