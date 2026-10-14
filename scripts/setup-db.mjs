process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use non-pooling direct connection from environment variables
const rawUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (!rawUrl) {
  console.error('Error: POSTGRES_URL_NON_POOLING or DATABASE_URL environment variable is required.');
  process.exit(1);
}

const parsed = new URL(rawUrl);
parsed.search = ''; // Strip search query parameters

console.log(`Connecting to Supabase PostgreSQL at ${parsed.host}...`);

const client = new pg.Client({
  connectionString: parsed.toString(),
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to Supabase PostgreSQL database!');

    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying database schema (users, sites, payments, subscribers, contact_messages)...');
    await client.query(sql);
    console.log('Database tables, indexes, and RLS policies successfully applied!');

    // Check tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log('\nActive public tables in Supabase:');
    res.rows.forEach(r => console.log('  [TABLE] ' + r.table_name));

    console.log('\nSupabase backend is ready for production and GSOC/NSOC evaluation!');
  } catch (err) {
    console.error('Error setting up Supabase database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
