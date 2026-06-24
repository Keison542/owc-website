import { Router, type IRouter } from "express";
import { eq, gte, and, count } from "drizzle-orm";
import { db, newsTable, publicationsTable, legislationTable, tendersTable, formsTable, servicesTable, contactSubmissionsTable } from "@workspace/db";
import { GetSiteStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [[newsCount], [pubCount], [legCount], [tenderCount], [formCount], [serviceCount], [pendingNews], [pendingPubs], [recentContactCount]] =
    await Promise.all([
      db.select({ value: count() }).from(newsTable).where(eq(newsTable.status, "published")),
      db.select({ value: count() }).from(publicationsTable).where(eq(publicationsTable.status, "published")),
      db.select({ value: count() }).from(legislationTable),
      db.select({ value: count() }).from(tendersTable).where(and(eq(tendersTable.status, "open"), gte(tendersTable.closingDate, now))),
      db.select({ value: count() }).from(formsTable).where(eq(formsTable.status, "active")),
      db.select({ value: count() }).from(servicesTable).where(eq(servicesTable.status, "active")),
      db.select({ value: count() }).from(newsTable).where(eq(newsTable.status, "draft")),
      db.select({ value: count() }).from(publicationsTable).where(eq(publicationsTable.status, "draft")),
      db.select({ value: count() }).from(contactSubmissionsTable).where(gte(contactSubmissionsTable.createdAt, sevenDaysAgo)),
    ]);

  const pendingApprovals = Number(pendingNews.value) + Number(pendingPubs.value);

  res.json(
    GetSiteStatsResponse.parse({
      totalNews: Number(newsCount.value),
      totalPublications: Number(pubCount.value),
      totalLegislation: Number(legCount.value),
      activeTenders: Number(tenderCount.value),
      totalForms: Number(formCount.value),
      totalServices: Number(serviceCount.value),
      pendingApprovals,
      recentContactSubmissions: Number(recentContactCount.value),
    })
  );
});

export default router;
