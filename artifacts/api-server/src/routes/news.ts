import { Router, type IRouter } from "express";
import { eq, desc, and, like, count, sql } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  ListNewsQueryParams,
  ListNewsResponse,
  CreateNewsBody,
  GetFeaturedNewsResponse,
  GetNewsByIdParams,
  GetNewsByIdResponse,
  UpdateNewsParams,
  UpdateNewsBody,
  UpdateNewsResponse,
  DeleteNewsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const params = ListNewsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 10;
  const offset = (page - 1) * limit;

  let query = db.select().from(newsTable).orderBy(desc(newsTable.createdAt));

  const conditions = [];
  if (params.data.category) conditions.push(eq(newsTable.category, params.data.category));
  if (params.data.status) conditions.push(eq(newsTable.status, params.data.status));

  const items = await db
    .select()
    .from(newsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(newsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(newsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(ListNewsResponse.parse({ items, total: Number(total), page, limit }));
});

router.get("/news/featured", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(newsTable)
    .where(and(eq(newsTable.featured, true), eq(newsTable.status, "published")))
    .orderBy(desc(newsTable.publishedAt))
    .limit(5);
  res.json(GetFeaturedNewsResponse.parse(items));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(GetNewsByIdResponse.parse(item));
});

router.post("/news", async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(req.body);
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
  const [item] = await db.insert(newsTable).values(data as typeof newsTable.$inferInsert).returning();
  res.status(201).json(GetNewsByIdResponse.parse(item));
});

router.patch("/news/:id", async (req, res): Promise<void> => {
  const params = UpdateNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNewsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Record<string, unknown> = {};
  const body = parsed.data;
  if (body.title !== undefined) updates.title = body.title;
  if (body.slug !== undefined) updates.slug = body.slug;
  if (body.summary !== undefined) updates.summary = body.summary;
  if (body.content !== undefined) updates.content = body.content;
  if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
  if (body.category !== undefined) updates.category = body.category;
  if (body.status !== undefined) updates.status = body.status;
  if (body.featured !== undefined) updates.featured = body.featured;
  if (body.publishedAt !== undefined) updates.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;

  const [item] = await db.update(newsTable).set(updates).where(eq(newsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(UpdateNewsResponse.parse(item));
});

router.delete("/news/:id", async (req, res): Promise<void> => {
  const params = DeleteNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(newsTable).where(eq(newsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
