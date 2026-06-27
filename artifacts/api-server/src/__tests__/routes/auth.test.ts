import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../app'; // ✅ Import from app.ts (not index.ts)
import { createTestUser, getTokenForUser } from '../helpers/db';

describe('🔐 Auth API Tests', () => {
  let testUser: any;
  let token: string;

  beforeAll(async () => {
    testUser = await createTestUser({
      email: 'auth@example.com',
    });
    token = await getTokenForUser(testUser);
  });

  describe('POST /api/staff/login', () => {
    it('✅ should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          email: 'auth@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('❌ should return 401 with invalid password', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          email: 'auth@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
    });

    it('❌ should return 401 with non-existent email', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
    });

    it('❌ should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/staff/login')
        .send({
          email: 'auth@example.com',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/staff/me', () => {
    let authToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/staff/login')
        .send({
          email: 'auth@example.com',
          password: 'password123',
        });
      authToken = loginResponse.body.token;
    });

    it('✅ should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/staff/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBe('auth@example.com');
    });

    it('❌ should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/staff/me');

      expect(response.status).toBe(401);
    });

    it('❌ should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/staff/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});