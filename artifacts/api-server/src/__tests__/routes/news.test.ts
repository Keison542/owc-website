import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { 
  createTestUser, 
  createAdminUser, 
  getTokenForUser,
  getAuthHeaders,
  createTestNews 
} from '../helpers/db';

describe('📰 News API Tests', () => {
  let editorUser: any;
  let adminUser: any;
  let approverUser: any;
  let editorToken: string;
  let adminToken: string;
  let approverToken: string;

  beforeAll(async () => {
    editorUser = await createTestUser({ 
      email: 'editor@example.com', 
      role: 'editor' 
    });
    adminUser = await createAdminUser();
    approverUser = await createTestUser({ 
      email: 'approver@example.com', 
      role: 'approver' 
    });
    
    editorToken = await getTokenForUser(editorUser);
    adminToken = await getTokenForUser(adminUser);
    approverToken = await getTokenForUser(approverUser);
  });

  // ─── PUBLIC ROUTES ───
  describe('GET /api/news (Public)', () => {
    it('✅ should return list of news articles', async () => {
      const response = await request(app)
        .get('/api/news');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('✅ should filter by category', async () => {
      const response = await request(app)
        .get('/api/news?category=Announcements');

      expect(response.status).toBe(200);
      expect(response.body.items.every((item: any) => 
        item.category === 'Announcements' || !item.category
      )).toBe(true);
    });

    it('✅ should paginate results', async () => {
      const response = await request(app)
        .get('/api/news?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(5);
    });
  });

  // ─── PROTECTED ROUTES ───
  describe('POST /api/news (Protected)', () => {
    it('✅ should create news when authenticated', async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Test News Article',
          content: 'This is the content of the test article.',
          category: 'Announcements',
          status: 'draft',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test News Article');
      expect(response.body.status).toBe('draft');
    });

    it('❌ should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/news')
        .send({
          title: 'Test News Article',
          content: 'This is the content.',
        });

      expect(response.status).toBe(401);
    });

    it('❌ should return 403 when editor tries to publish directly', async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Test News Article',
          content: 'This is the content.',
          status: 'published',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('cannot publish directly');
    });

    it('❌ should return 400 with missing title', async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          content: 'This is the content.',
        });

      expect(response.status).toBe(400);
    });
  });

  // ─── UPDATE TESTS ───
  describe('PATCH /api/news/:id', () => {
    let newsId: number;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Update Test Article',
          content: 'Content for update test.',
          status: 'draft',
        });
      newsId = response.body.id;
    });

    it('✅ should update news when owner', async () => {
      const response = await request(app)
        .patch(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Updated Article Title',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Article Title');
    });

    it('❌ should return 403 when editing someone else\'s content', async () => {
      const otherUser = await createTestUser({ 
        email: 'other@example.com', 
        role: 'editor' 
      });
      const otherToken = await getTokenForUser(otherUser);

      const response = await request(app)
        .patch(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({
          title: 'Hacked Title',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('own content');
    });

    it('✅ should allow admin to update any content', async () => {
      const response = await request(app)
        .patch(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Admin Updated Title',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Admin Updated Title');
    });
  });

  // ─── DELETE TESTS ───
  describe('DELETE /api/news/:id', () => {
    let newsId: number;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Delete Test Article',
          content: 'Content for delete test.',
          status: 'draft',
        });
      newsId = response.body.id;
    });

    it('❌ should return 403 when editor tries to delete', async () => {
      const response = await request(app)
        .delete(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${editorToken}`);

      expect(response.status).toBe(403);
    });

    it('✅ should allow admin to delete', async () => {
      const response = await request(app)
        .delete(`/api/news/${newsId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });
  });
});