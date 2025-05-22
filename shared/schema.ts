import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  joinedAt: timestamp("joined_at").defaultNow(),
  isCreator: boolean("is_creator").default(false),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  iconName: text("icon_name").notNull(), // Refers to Remix icon class names
  assetCount: integer("asset_count").default(0),
});
// Assets table
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  previewUrl: text("preview_url").notNull(),
  price: real("price").notNull(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  creatorId: integer("creator_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  thumbnails: text("thumbnails").array(),
  downloadCount: integer("download_count").default(0),
  rating: real("rating").default(0),
});

// Define insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinedAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true, downloadCount: true, rating: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Extended asset type with creator and category info for frontend
export type AssetWithDetails = Asset & {
  creator: {
    id: number;
    displayName: string;
    username: string;
    avatarUrl: string | null;
  };
  category: {
    id: number;
    name: string;
    iconName: string;
  };
};
