import { Router, type IRouter } from "express";
import { eq, desc, and, count, sql } from "drizzle-orm";  // ← Added sql here
import { db, newsTable, publicationsTable, legislationTable } from "@workspace/db";
import { requireStaffAuth } from "./staff";
import { serializeDates, stripNulls } from "../lib/routeUtils";

const router: IRouter = Router();

// ─── GET /api/pending ───
router.get("/pending", requireStaffAuth, async (req, res): Promise<void> => {
  try {
    // Get pending news
    const pendingNews = await db
      .select({
        id: newsTable.id,
        type: sql<string>`'news'`.as('type'),
        title: newsTable.title,
        status: newsTable.status,
        createdAt: newsTable.createdAt,
      })
      .from(newsTable)
      .where(eq(newsTable.status, "pending"))
      .orderBy(desc(newsTable.createdAt));

    // Get pending publications
    const pendingPublications = await db
      .select({
        id: publicationsTable.id,
        type: sql<string>`'publication'`.as('type'),
        title: publicationsTable.title,
        status: publicationsTable.status,
        createdAt: publicationsTable.createdAt,
      })
      .from(publicationsTable)
      .where(eq(publicationsTable.status, "pending"))
      .orderBy(desc(publicationsTable.createdAt));

    // Get pending legislation
    const pendingLegislation = await db
      .select({
        id: legislationTable.id,
        type: sql<string>`'legislation'`.as('type'),
        title: legislationTable.title,
        status: legislationTable.status,
        createdAt: legislationTable.createdAt,
      })
      .from(legislationTable)
      .where(eq(legislationTable.status, "pending"))
      .orderBy(desc(legislationTable.createdAt));

    const allPending = [...pendingNews, ...pendingPublications, ...pendingLegislation]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      items: allPending.map(serializeDates),
      total: allPending.length,
    });
  } catch (error) {
    console.error("Error fetching pending content:", error);
    res.status(500).json({ error: "Failed to fetch pending content" });
  }
});

// ─── POST /api/approve ───
router.post("/approve", requireStaffAuth, async (req, res): Promise<void> => {
  const { contentType, contentId, action } = req.body;

  if (!contentType || !contentId || !action) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!["approve", "reject"].includes(action)) {
    res.status(400).json({ error: "Invalid action. Must be 'approve' or 'reject'" });
    return;
  }

  try {
    let table;
    let idField;
    let typeName;

    switch (contentType) {
      case "news":
        table = newsTable;
        idField = newsTable.id;
        typeName = "News";
        break;
      case "publication":
        table = publicationsTable;
        idField = publicationsTable.id;
        typeName = "Publication";
        break;
      case "legislation":
        table = legislationTable;
        idField = legislationTable.id;
        typeName = "Legislation";
        break;
      default:
        res.status(400).json({ error: "Invalid content type" });
        return;
    }

    const [item] = await db.select().from(table).where(eq(idField, contentId));
    if (!item) {
      res.status(404).json({ error: `${typeName} not found` });
      return;
    }

    if (item.status !== "pending") {
      res.status(400).json({ 
        error: `Content is not pending. Current status: ${item.status}` 
      });
      return;
    }

    const newStatus = action === "approve" ? "published" : "rejected";
    const publishedAt = action === "approve" ? new Date() : null;

    const updates: Record<string, unknown> = {
      status: newStatus,
      updatedAt: new Date(),
    };

    if (publishedAt) {
      updates.publishedAt = publishedAt;
    }

    const [updated] = await db
      .update(table)
      .set(updates)
      .where(eq(idField, contentId))
      .returning();

    res.json({
      success: true,
      message: `${typeName} ${action}d successfully`,
      item: serializeDates(updated),
    });
  } catch (error) {
    console.error("Error approving content:", error);
    res.status(500).json({ error: "Failed to process approval" });
  }
});

export default router;