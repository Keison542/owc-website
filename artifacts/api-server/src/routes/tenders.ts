import { Router, type IRouter } from "express";
import { eq, desc, and, count, gte } from "drizzle-orm";
import { db, tendersTable } from "@workspace/db";
import {
  ListTendersQueryParams,
  ListTendersResponse,
  CreateTenderBody,
  GetActiveTendersResponse,
  GetTenderByIdParams,
  GetTenderByIdResponse,
  UpdateTenderParams,
  UpdateTenderBody,
  UpdateTenderResponse,
  DeleteTenderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tenders", async (req, res): Promise<void> => {
  const params = ListTendersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (params.data.status) conditions.push(eq(tendersTable.status, params.data.status));

  const items = await db
    .select()
    .from(tendersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(tendersTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(tendersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(ListTendersResponse.parse({ items, total: Number(total), page, limit }));
});

router.get("/tenders/active", async (_req, res): Promise<void> => {
  const now = new Date();
  const items = await db
    .select()
    .from(tendersTable)
    .where(and(eq(tendersTable.status, "open"), gte(tendersTable.closingDate, now)))
    .orderBy(desc(tendersTable.publishedDate))
    .limit(10);
  res.json(GetActiveTendersResponse.parse(items));
});

router.get("/tenders/:id", async (req, res): Promise<void> => {
  const params = GetTenderByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(tendersTable).where(eq(tendersTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Tender not found" });
    return;
  }
  res.json(GetTenderByIdResponse.parse(item));
});

router.post("/tenders", async (req, res): Promise<void> => {
  const parsed = CreateTenderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data as Record<string, unknown>;
  if (data.closingDate) data.closingDate = new Date(data.closingDate as string);
  if (data.publishedDate) data.publishedDate = new Date(data.publishedDate as string);
  const [item] = await db.insert(tendersTable).values(data as typeof tendersTable.$inferInsert).returning();
  res.status(201).json(GetTenderByIdResponse.parse(item));
});

router.patch("/tenders/:id", async (req, res): Promise<void> => {
  const params = UpdateTenderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTenderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates = parsed.data as Record<string, unknown>;
  if (updates.closingDate) updates.closingDate = new Date(updates.closingDate as string);
  if (updates.publishedDate) updates.publishedDate = new Date(updates.publishedDate as string);
  const [item] = await db.update(tendersTable).set(updates).where(eq(tendersTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Tender not found" });
    return;
  }
  res.json(UpdateTenderResponse.parse(item));
});

router.delete("/tenders/:id", async (req, res): Promise<void> => {
  const params = DeleteTenderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(tendersTable).where(eq(tendersTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Tender not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
