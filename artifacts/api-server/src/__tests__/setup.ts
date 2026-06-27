import { beforeAll, afterAll, afterEach } from 'vitest';
import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

// ─── SET ALL REQUIRED ENVIRONMENT VARIABLES ───
process.env.PORT = '5178';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
// ✅ Use environment variable with fallback
process.env.DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:kt@localhost:5432/owc_test';
process.env.BASE_PATH = '/';
process.env.CLIENT_URL = 'http://localhost:5173';

console.log('🧪 Test environment initialized');
console.log(`📦 PORT: ${process.env.PORT}`);
console.log(`📦 Database: ${process.env.DATABASE_URL}`);

// ─── BEFORE ALL TESTS ───
beforeAll(async () => {
  console.log('🧪 Setting up test database...');
  try {
    // Truncate all tables
    await db.execute(sql`TRUNCATE TABLE staff_users CASCADE`);
    await db.execute(sql`TRUNCATE TABLE news CASCADE`);
    await db.execute(sql`TRUNCATE TABLE publications CASCADE`);
    await db.execute(sql`TRUNCATE TABLE tenders CASCADE`);
    await db.execute(sql`TRUNCATE TABLE contact_submissions CASCADE`);
    console.log('✅ Test database ready');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
  }
});

// ─── AFTER ALL TESTS ───
afterAll(async () => {
  console.log('🧪 Test database cleanup complete');
});