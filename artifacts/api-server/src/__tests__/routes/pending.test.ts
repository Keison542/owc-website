import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { 
  createTestUser, 
  createAdminUser, 
  getTokenForUser 
} from '../helpers/db';

describe('📋 Pending Approvals API Tests', () => {
  let adminUser: any;
  let approverUser: any;
  let editorUser: any;
  let adminToken: string;
  let approverToken: string;
  let editorToken: string;

  beforeAll(async () => {
    adminUser = await createAdminUser();
    approverUser = await createTestUser({ 
      email: 'approver@example.com', 
      role: 'approver' 
    });
    editorUser = await createTestUser({ 
      email: 'editor@example.com', 
      role: 'editor' 
    });
    
    adminToken = await getTokenForUser(adminUser);
    approverToken = await getTokenForUser(approverUser);
    editorToken = await getTokenForUser(editorUser);
  });

  describe('GET /api/pending', () => {
    it('✅ should allow admin to view pending', async () => {
      const response = await request(app)
        .get('/api/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('✅ should allow approver to view pending', async () => {
      const response = await request(app)
        .get('/api/pending')
        .set('Authorization', `Bearer ${approverToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
    });

    it('❌ should return 403 when editor tries to view pending', async () => {
      const response = await request(app)
        .get('/api/pending')
        .set('Authorization', `Bearer ${editorToken}`);

      expect(response.status).toBe(403);
    });

    it('❌ should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/pending');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/approve', () => {
    let newsId: number;

    beforeAll(async () => {
      // Create a news article in pending state
      const createResponse = await request(app)
        .post('/api/news')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          title: 'Approval Test Article',
          content: 'Content for approval test.',
          status: 'pending',
        });
      newsId = createResponse.body.id;
    });

    it('✅ should allow admin to approve', async () => {
      const response = await request(app)
        .post('/api/approve')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          contentType: 'news',
          contentId: newsId,
          action: 'approve',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('❌ should return 403 when editor tries to approve', async () => {
      const response = await request(app)
        .post('/api/approve')
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          contentType: 'news',
          contentId: newsId,
          action: 'approve',
        });

      expect(response.status).toBe(403);
    });
  });
});