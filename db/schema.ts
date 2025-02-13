import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  parentUrl: text("parent_url"),
  domain: text("domain").notNull(),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertUrlSchema = createInsertSchema(urls);
export const selectUrlSchema = createSelectSchema(urls);
export type InsertUrl = typeof urls.$inferInsert;
export type SelectUrl = typeof urls.$inferSelect;