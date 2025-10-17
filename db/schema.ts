import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const urls = sqliteTable("urls", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull().unique(), // Add unique constraint
  parentUrl: text("parent_url"),
  domain: text("domain").notNull(),
  processed: integer("processed", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const spaces = sqliteTable("spaces", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertUrlSchema = createInsertSchema(urls);
export const selectUrlSchema = createSelectSchema(urls);
export type InsertUrl = typeof urls.$inferInsert;
export type SelectUrl = typeof urls.$inferSelect;

export const insertSpaceSchema = createInsertSchema(spaces);
export const selectSpaceSchema = createSelectSchema(spaces);
export type InsertSpace = typeof spaces.$inferInsert;
export type SelectSpace = typeof spaces.$inferSelect;