import { Router, type IRouter, type Request } from "express";
import { eq, desc, and, count } from "drizzle-orm";
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
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

// ─── PUBLIC ROUTES ───

router.get("/news", async (req, res): Promise<void> => {
  const params = ListNewsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 10;
  const offset = (page - 1) * limit;

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

  res.json(ListNewsResponse.parse({ items: items.map(serializeDates), total: Number(total), page, limit }));
});

router.get("/news/featured", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(newsTable)
    .where(and(eq(newsTable.featured, true), eq(newsTable.status, "published")))
    .orderBy(desc(newsTable.publishedAt))
    .limit(5);
  res.json(GetFeaturedNewsResponse.parse(items.map(serializeDates)));
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
  res.json(GetNewsByIdResponse.parse(serializeDates(item)));
});

// ─── PROTECTED ROUTES ───

router.post("/news", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreateNewsBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  
  const data = parsed.data;
  const staffReq = req as Request & {
    staffUser?: { userId: number; role: string };
  };

  // ✅ Editor cannot publish directly
  if (data.status === "published" && staffReq.staffUser?.role !== "admin") {
    res.status(403).json({
      error: "Editors cannot publish directly",
    });
    return;
  }

  if (!data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Date.now();
  }
  
  // ✅ Add author ID
  const insertData = { 
    ...data,
    authorId: staffReq.staffUser?.userId 
  } as Record<string, unknown>;
  
  if (insertData.publishedAt) insertData.publishedAt = new Date(insertData.publishedAt as string);
  
  const [item] = await db.insert(newsTable).values(insertData as typeof newsTable.$inferInsert).returning();
  res.status(201).json(GetNewsByIdResponse.parse(serializeDates(item)));
});

router.patch("/news/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  // ✅ Get existing article first
  const [existing] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "News article not found" });
    return;
  }

  // ✅ Check ownership: admin OR owner can edit
  const staffReq = req as Request & {
    staffUser?: { userId: number; role: string };
  };

  if (
    staffReq.staffUser?.role !== "admin" &&
    existing.authorId !== staffReq.staffUser?.userId
  ) {
    res.status(403).json({ error: "You can only edit your own content" });
    return;
  }

  const parsed = UpdateNewsBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.publishedAt !== undefined) {
    updates.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
  }
  
  const [item] = await db
    .update(newsTable)
    .set(updates)
    .where(eq(newsTable.id, params.data.id))
    .returning();
  
  if (!item) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.json(UpdateNewsResponse.parse(serializeDates(item)));
});

router.delete("/news/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeleteNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  // ✅ Get existing article first
  const [existing] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));

  if (!existing) {
    res.status(404).json({ error: "News article not found" });
    return;
  }

  // ✅ Only admin can delete
  const staffReq = req as Request & {
    staffUser?: { userId: number; role: string };
  };

  if (staffReq.staffUser?.role !== "admin") {
    res.status(403).json({ error: "Only admin can delete content" });
    return;
  }

  const [item] = await db
    .delete(newsTable)
    .where(eq(newsTable.id, params.data.id))
    .returning();
  
  if (!item) {
    res.status(404).json({ error: "News article not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;