import { Router, type IRouter } from "express";
import { eq, and, asc } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";
import {
  ListFaqsQueryParams,
  ListFaqsResponse,
  CreateFaqBody,
  GetFaqByIdParams,
  GetFaqByIdResponse,
  UpdateFaqParams,
  UpdateFaqBody,
  UpdateFaqResponse,
  DeleteFaqParams,
} from "@workspace/api-zod";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

router.get("/faqs", async (req, res): Promise<void> => {
  const params = ListFaqsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.category) conditions.push(eq(faqsTable.category, params.data.category));
  if (params.data.status) conditions.push(eq(faqsTable.status, params.data.status));

  const items = await db
    .select()
    .from(faqsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(faqsTable.order));

  res.json(ListFaqsResponse.parse(items.map(serializeDates)));
});

router.get("/faqs/:id", async (req, res): Promise<void> => {
  const params = GetFaqByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(faqsTable).where(eq(faqsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "FAQ not found" });
    return;
  }
  res.json(GetFaqByIdResponse.parse(serializeDates(item)));
});

router.post("/faqs", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreateFaqBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(faqsTable).values(parsed.data).returning();
  res.status(201).json(GetFaqByIdResponse.parse(serializeDates(item)));
});

router.patch("/faqs/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateFaqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateFaqBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(faqsTable).set(parsed.data).where(eq(faqsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "FAQ not found" });
    return;
  }
  res.json(UpdateFaqResponse.parse(serializeDates(item)));
});

router.delete("/faqs/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeleteFaqParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(faqsTable).where(eq(faqsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "FAQ not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
