import { Router, type IRouter } from "express";
import { eq, desc, count, and } from "drizzle-orm";
import { db, contactSubmissionsTable } from "@workspace/db";
import {
  SubmitContactBody,
  ListContactSubmissionsQueryParams,
  ListContactSubmissionsResponse,
  GetContactSubmissionParams,
  GetContactSubmissionResponse,
  UpdateContactSubmissionParams,
  UpdateContactSubmissionBody,
  UpdateContactSubmissionResponse,
} from "@workspace/api-zod";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(contactSubmissionsTable).values(parsed.data).returning();
  res.status(201).json(GetContactSubmissionResponse.parse(serializeDates(item)));
});

router.get("/contact/submissions", requireStaffAuth, async (req, res): Promise<void> => {
  const params = ListContactSubmissionsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const page = params.data.page ?? 1;
  const limit = params.data.limit ?? 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (params.data.status) conditions.push(eq(contactSubmissionsTable.status, params.data.status));

  const items = await db
    .select()
    .from(contactSubmissionsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(contactSubmissionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(contactSubmissionsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(ListContactSubmissionsResponse.parse({ items: items.map(serializeDates), total: Number(total), page, limit }));
});

router.get("/contact/submissions/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = GetContactSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(contactSubmissionsTable).where(eq(contactSubmissionsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json(GetContactSubmissionResponse.parse(serializeDates(item)));
});

router.patch("/contact/submissions/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateContactSubmissionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateContactSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "responded") {
    updates.respondedAt = new Date();
  }
  const [item] = await db
    .update(contactSubmissionsTable)
    .set(updates)
    .where(eq(contactSubmissionsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json(UpdateContactSubmissionResponse.parse(serializeDates(item)));
});

export default router;
