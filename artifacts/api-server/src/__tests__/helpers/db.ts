import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ─── CREATE TEST USERS (Using Raw SQL) ───
export async function createTestUser(overrides: any = {}) {
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  const name = overrides.name || 'Test User';
  const email = overrides.email || 'test@example.com';
  const role = overrides.role || 'editor';
  
  // ✅ Use raw SQL to insert user
  const result = await db.execute(sql`
    INSERT INTO staff_users (name, email, password_hash, role, is_active, created_at, updated_at)
    VALUES (${name}, ${email}, ${passwordHash}, ${role}, true, NOW(), NOW())
    RETURNING id, name, email, password_hash, role, is_active, last_login_at, created_at, updated_at
  `);
  
  const user = result.rows[0];
  return user;
}

export async function createAdminUser() {
  return createTestUser({
    email: 'admin@example.com',
    role: 'admin',
  });
}

export async function createApproverUser() {
  return createTestUser({
    email: 'approver@example.com',
    role: 'approver',
  });
}

export async function createViewerUser() {
  return createTestUser({
    email: 'viewer@example.com',
    role: 'viewer',
  });
}

// ─── GET JWT TOKEN ───
export async function getTokenForUser(user: any) {
  return jwt.sign(
    {
      userId: user.id,   // ✅ Match staff.ts which expects 'userId'
      role: user.role,
    },
    process.env.SESSION_SECRET || 'owc-staff-secret-key-change-in-prod',  // ✅ Match staff.ts
    {
      expiresIn: '8h',   // ✅ Match staff.ts
    }
  );
}

// ─── GET AUTH HEADERS ───
export async function getAuthHeaders(user: any) {
  const token = await getTokenForUser(user);
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}