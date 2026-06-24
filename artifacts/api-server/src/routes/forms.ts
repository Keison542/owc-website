import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, formsTable } from "@workspace/db";
import {
  ListFormsQueryParams,
  ListFormsResponse,
  CreateFormBody,
  GetFormByIdParams,
  GetFormByIdResponse,
  UpdateFormParams,
  UpdateFormBody,
  UpdateFormResponse,
  DeleteFormParams,
} from "@workspace/api-zod";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

router.get("/forms", async (req, res): Promise<void> => {
  const params = ListFormsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.category) conditions.push(eq(formsTable.category, params.data.category));
  if (params.data.status) conditions.push(eq(formsTable.status, params.data.status));

  const items = await db
    .select()
    .from(formsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(formsTable.createdAt));

  res.json(ListFormsResponse.parse(items.map(serializeDates)));
});

router.get("/forms/:id", async (req, res): Promise<void> => {
  const params = GetFormByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.select().from(formsTable).where(eq(formsTable.id, params.data.id));
  if (!item) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  res.json(GetFormByIdResponse.parse(serializeDates(item)));
});

router.post("/forms", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreateFormBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(formsTable).values(parsed.data).returning();
  res.status(201).json(GetFormByIdResponse.parse(serializeDates(item)));
});

router.patch("/forms/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateFormBody.safeParse(stripNulls(req.body));
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.update(formsTable).set(parsed.data).where(eq(formsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  res.json(UpdateFormResponse.parse(serializeDates(item)));
});

router.delete("/forms/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeleteFormParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db.delete(formsTable).where(eq(formsTable.id, params.data.id)).returning();
  if (!item) {
    res.status(404).json({ error: "Form not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
