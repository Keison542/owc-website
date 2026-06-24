import { Router, type IRouter } from "express";
import { eq, desc, count, and } from "drizzle-orm";
import { db, staffUsersTable, newsTable, publicationsTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  StaffLoginBody,
  StaffLoginResponse,
  GetStaffMeResponse,
  ListStaffUsersResponse,
  CreateStaffUserBody,
  UpdateStaffUserParams,
  UpdateStaffUserBody,
  UpdateStaffUserResponse,
  DeleteStaffUserParams,
  ListPendingContentResponse,
  ApproveContentBody,
  ApproveContentResponse,
} from "@workspace/api-zod";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET ?? "owc-staff-secret-key-change-in-prod";

export function requireStaffAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as Request & { staffUser?: { userId: number; role: string } }).staffUser = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/staff/login", async (req, res): Promise<void> => {
  const parsed = StaffLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(staffUsersTable).where(eq(staffUsersTable.email, email));
  if (!user || !user.isActive) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  await db.update(staffUsersTable).set({ lastLoginAt: new Date() }).where(eq(staffUsersTable.id, user.id));
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  const { passwordHash: _, ...safeUser } = user;
  res.json(StaffLoginResponse.parse({ user: safeUser, token }));
});

router.post("/staff/logout", (_req, res): void => {
  res.sendStatus(204);
});

router.get("/staff/me", requireStaffAuth, async (req, res): Promise<void> => {
  const staffReq = req as Request & { staffUser?: { userId: number } };
  if (!staffReq.staffUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(staffUsersTable).where(eq(staffUsersTable.id, staffReq.staffUser.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json(GetStaffMeResponse.parse(safeUser));
});

router.get("/staff/users", requireStaffAuth, async (_req, res): Promise<void> => {
  const users = await db.select().from(staffUsersTable).orderBy(desc(staffUsersTable.createdAt));
  const safeUsers = users.map(({ passwordHash: _, ...u }) => u);
  res.json(ListStaffUsersResponse.parse(safeUsers));
});

router.post("/staff/users", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = CreateStaffUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const [user] = await db
    .insert(staffUsersTable)
    .values({ name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, passwordHash })
    .returning();
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json(safeUser);
});

router.patch("/staff/users/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = UpdateStaffUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateStaffUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.password) {
    updates.passwordHash = await bcrypt.hash(parsed.data.password, 12);
    delete updates.password;
  }
  const [user] = await db
    .update(staffUsersTable)
    .set(updates)
    .where(eq(staffUsersTable.id, params.data.id))
    .returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json(UpdateStaffUserResponse.parse(safeUser));
});

router.delete("/staff/users/:id", requireStaffAuth, async (req, res): Promise<void> => {
  const params = DeleteStaffUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [user] = await db.delete(staffUsersTable).where(eq(staffUsersTable.id, params.data.id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.sendStatus(204);
});

router.get("/staff/pending", requireStaffAuth, async (_req, res): Promise<void> => {
  const pendingNews = await db
    .select({ id: newsTable.id, title: newsTable.title, createdAt: newsTable.createdAt })
    .from(newsTable)
    .where(eq(newsTable.status, "draft"))
    .limit(50);

  const pendingPubs = await db
    .select({ id: publicationsTable.id, title: publicationsTable.title, createdAt: publicationsTable.createdAt })
    .from(publicationsTable)
    .where(eq(publicationsTable.status, "draft"))
    .limit(50);

  const items = [
    ...pendingNews.map((n) => ({ id: n.id, type: "news", title: n.title, submittedBy: null, createdAt: n.createdAt.toISOString() })),
    ...pendingPubs.map((p) => ({ id: p.id, type: "publication", title: p.title, submittedBy: null, createdAt: p.createdAt.toISOString() })),
  ];

  res.json(ListPendingContentResponse.parse({ items, total: items.length }));
});

router.post("/staff/approve", requireStaffAuth, async (req, res): Promise<void> => {
  const parsed = ApproveContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { contentType, contentId, action } = parsed.data;
  const newStatus = action === "approve" ? "published" : "rejected";

  try {
    if (contentType === "news") {
      await db
        .update(newsTable)
        .set({ status: newStatus, publishedAt: action === "approve" ? new Date() : undefined })
        .where(eq(newsTable.id, contentId));
    } else if (contentType === "publication") {
      await db
        .update(publicationsTable)
        .set({ status: newStatus, publishedAt: action === "approve" ? new Date() : undefined })
        .where(eq(publicationsTable.id, contentId));
    }
    res.json(ApproveContentResponse.parse({ success: true, message: `Content ${action}d successfully` }));
  } catch (err) {
    logger.error({ err }, "Failed to process approval");
    res.status(500).json({ error: "Failed to process approval" });
  }
});

export default router;
