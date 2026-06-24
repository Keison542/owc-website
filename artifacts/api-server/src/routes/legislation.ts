import { Router, type IRouter } from "express";
import { eq, desc, and, count } from "drizzle-orm";
import { db, legislationTable } from "@workspace/db";
import {
  ListLegislationQueryParams,
  ListLegislationResponse,
  CreateLegislationBody,
  GetLegislationByIdParams,
  GetLegislationByIdResponse,
  UpdateLegislationParams,
  UpdateLegislationBody,
  UpdateLegislationResponse,
  DeleteLegislationParams,
} from "@workspace/api-zod";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

router.get("/legislation", async (req, res): Promise<void> => {
  const params = ListLegislationQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 10;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (params.data.type) conditions.push(eq(legislationTable.type, params.data.type));
  if (params.data.status) conditions.push(eq(legislationTable.status, params.data.status));

  const items = await db
    .select()
    .from(legislationTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(legislationTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(legislationTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(ListLegislationResponse.parse({ items: items.map(serializeDates), total: Number(total), page, limit }));
});

router.get("/legislation/:id", async (req, res): Promise<void> => {
  const params = GetLegislationByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(legislationTable).where(eq(legislationTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Legislation not found" });
    return;
  }
  res.json(GetLegislationByIdResponse.parse(serializeDates(item)));
});

router.post("/legislation", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreateLegislationBody.safeParse(stripNulls(req.body));
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
  const [item] = await db.insert(legislationTable).values(data as typeof legislationTable.$inferInsert).returning();
  res.status(201).json(GetLegislationByIdResponse.parse(serializeDates(item)));
});

router.patch("/legislation/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateLegislationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateLegislationBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(legislationTable).set(parsed.data).where(eq(legislationTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Legislation not found" });
    return;
  }
  res.json(UpdateLegislationResponse.parse(serializeDates(item)));
});

router.delete("/legislation/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeleteLegislationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(legislationTable).where(eq(legislationTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Legislation not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
