import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';

const sqlite = new Database('./accessibility.db');
const db = drizzle(sqlite);

// Create tables if they don't exist
db.run(sql`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    parent_url TEXT,
    domain TEXT NOT NULL,
    processed INTEGER DEFAULT 0,
    created_at INTEGER DEFAULT (unixepoch())
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    created_at INTEGER DEFAULT (unixepoch())
  )
`);

console.log('Database schema initialized successfully');
sqlite.close();
