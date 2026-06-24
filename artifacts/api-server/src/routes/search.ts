import { Router, type IRouter } from "express";
import { ilike, or, eq } from "drizzle-orm";
import { db, newsTable, publicationsTable, legislationTable, tendersTable, faqsTable, formsTable, servicesTable } from "@workspace/db";
import { SearchQueryParams, SearchResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/search", async (req, res): Promise<void> => {
  const params = SearchQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { q, type, page = 1, limit = 10 } = params.data;
  const offset = (page - 1) * limit;

  const results: Array<{
    id: number;
    type: string;
    title: string;
    excerpt: string | null;
    url: string;
    publishedAt: string | null;
  }> = [];

  const searchTerm = `%${q}%`;

  if (!type || type === "news") {
    const items = await db
      .select()
      .from(newsTable)
      .where(or(ilike(newsTable.title, searchTerm), ilike(newsTable.summary, searchTerm), ilike(newsTable.content, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "news",
        title: item.title,
        excerpt: item.summary ?? null,
        url: `/news/${item.id}`,
        publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
      });
    });
  }

  if (!type || type === "publications") {
    const items = await db
      .select()
      .from(publicationsTable)
      .where(or(ilike(publicationsTable.title, searchTerm), ilike(publicationsTable.description, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "publications",
        title: item.title,
        excerpt: item.description ?? null,
        url: `/publications/${item.id}`,
        publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
      });
    });
  }

  if (!type || type === "legislation") {
    const items = await db
      .select()
      .from(legislationTable)
      .where(or(ilike(legislationTable.title, searchTerm), ilike(legislationTable.description, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "legislation",
        title: item.title,
        excerpt: item.description ?? null,
        url: `/legislation/${item.id}`,
        publishedAt: null,
      });
    });
  }

  if (!type || type === "tenders") {
    const items = await db
      .select()
      .from(tendersTable)
      .where(or(ilike(tendersTable.title, searchTerm), ilike(tendersTable.description, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "tenders",
        title: item.title,
        excerpt: item.description ?? null,
        url: `/tenders/${item.id}`,
        publishedAt: item.publishedDate ? item.publishedDate.toISOString() : null,
      });
    });
  }

  if (!type || type === "faqs") {
    const items = await db
      .select()
      .from(faqsTable)
      .where(or(ilike(faqsTable.question, searchTerm), ilike(faqsTable.answer, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "faqs",
        title: item.question,
        excerpt: item.answer.substring(0, 200),
        url: `/faqs#faq-${item.id}`,
        publishedAt: null,
      });
    });
  }

  if (!type || type === "forms") {
    const items = await db
      .select()
      .from(formsTable)
      .where(or(ilike(formsTable.title, searchTerm), ilike(formsTable.description, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "forms",
        title: item.title,
        excerpt: item.description ?? null,
        url: `/forms/${item.id}`,
        publishedAt: null,
      });
    });
  }

  if (!type || type === "services") {
    const items = await db
      .select()
      .from(servicesTable)
      .where(or(ilike(servicesTable.title, searchTerm), ilike(servicesTable.description, searchTerm)))
      .limit(20);
    items.forEach((item) => {
      results.push({
        id: item.id,
        type: "services",
        title: item.title,
        excerpt: item.description ?? null,
        url: `/services/${item.id}`,
        publishedAt: null,
      });
    });
  }

  const total = results.length;
  const paged = results.slice(offset, offset + limit);

  res.json(SearchResponse.parse({ results: paged, total, query: q }));
});

export default router;
