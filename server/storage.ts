import {
  users, 
  categories, 
  assets, 
  type User, 
  type InsertUser, 
  type Category,
  type InsertCategory,
  type Asset,
  type InsertAsset,
  type AssetWithDetails
} from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import postgres from "postgres";
import { log } from "./vite";

// Initialize Postgres client
const connectionString = process.env.DATABASE_URL;
const client = connectionString ? postgres(connectionString) : null;
const db = client ? drizzle(client) : null;

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCreators(limit?: number): Promise<User[]>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Asset operations
  getAssets(options?: {
    limit?: number;
    categoryId?: number;
    creatorId?: number;
    featured?: boolean;
  }): Promise<AssetWithDetails[]>;
  getAssetById(id: number): Promise<AssetWithDetails | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  getFeaturedAssets(limit?: number): Promise<AssetWithDetails[]>;
  getRecentAssets(limit?: number): Promise<AssetWithDetails[]>;
  getTrendingAssets(limit?: number): Promise<AssetWithDetails[]>;
  searchAssets(query: string): Promise<AssetWithDetails[]>;
}

// Implementation using PostgreSQL
export class PostgresStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      log("Initializing PostgreSQL database...", "storage");
      
      // Check if we already have data
      const existingUsers = await db!.select().from(users).limit(1);
      
      if (existingUsers.length === 0) {
        log("Database is empty, seeding initial data...", "storage");
        await this.seedData();
        log("Database seeded successfully!", "storage");
      } else {
        log("Database already has data, skipping seed", "storage");
      }
    } catch (error) {
      log(`Database initialization error: ${error}`, "storage");
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db!.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db!.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db!.insert(users).values({
      ...insertUser,
      bio: insertUser.bio || null,
      avatarUrl: insertUser.avatarUrl || null,
      joinedAt: new Date(),
      isCreator: insertUser.isCreator || false,
    }).returning();
    
    return result[0];
  }

  async getCreators(limit: number = 10): Promise<User[]> {
    return db!.select().from(users).where(eq(users.isCreator, true)).limit(limit);
  }

  async getCategories(): Promise<Category[]> {
    return db!.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const result = await db!.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db!.insert(categories).values({
      ...insertCategory,
      description: insertCategory.description || null,
      assetCount: insertCategory.assetCount || 0,
    }).returning();
    
    return result[0];
  }

  async getAssets(options: {
    limit?: number;
    categoryId?: number;
    creatorId?: number;
    featured?: boolean;
  } = {}): Promise<AssetWithDetails[]> {
    let query = db!.select().from(assets);
    
    // Add WHERE conditions based on options
    const conditions = [];
    
    if (options.categoryId !== undefined) {
      conditions.push(eq(assets.categoryId, options.categoryId));
    }
    
    if (options.creatorId !== undefined) {
      conditions.push(eq(assets.creatorId, options.creatorId));
    }
    
    if (options.featured !== undefined) {
      conditions.push(eq(assets.featured, options.featured));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    const result = await query;
    return this.attachAssetsDetails(result);
  }

  async getAssetById(id: number): Promise<AssetWithDetails | undefined> {
    const result = await db!.select().from(assets).where(eq(assets.id, id)).limit(1);
    if (result.length === 0) return undefined;
    
    const assetsWithDetails = await this.attachAssetsDetails(result);
    return assetsWithDetails[0];
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const result = await db!.insert(assets).values({
      ...insertAsset,
      description: insertAsset.description || null,
      featured: insertAsset.featured || false,
      tags: insertAsset.tags || [],
      thumbnails: insertAsset.thumbnails || [],
      createdAt: new Date(),
      downloadCount: 0,
      rating: 0,
    }).returning();
    
    // Update the category's asset count
    await this.incrementCategoryAssetCount(insertAsset.categoryId);
    
    return result[0];
  }

  private async incrementCategoryAssetCount(categoryId: number) {
    const category = await this.getCategoryById(categoryId);
    if (category) {
      await db!.update(categories)
        .set({ assetCount: (category.assetCount || 0) + 1 })
        .where(eq(categories.id, categoryId));
    }
  }

  async getFeaturedAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const result = await db!.select()
      .from(assets)
      .where(eq(assets.featured, true))
      .limit(limit);
    
    return this.attachAssetsDetails(result);
  }

  async getRecentAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const result = await db!.select()
      .from(assets)
      .orderBy(desc(assets.createdAt))
      .limit(limit);
    
    return this.attachAssetsDetails(result);
  }

  async getTrendingAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const result = await db!.select()
      .from(assets)
      .orderBy(desc(assets.downloadCount))
      .limit(limit);
    
    return this.attachAssetsDetails(result);
  }

  async searchAssets(query: string): Promise<AssetWithDetails[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    
    const result = await db!.select()
      .from(assets)
      .where(
        or(
          ilike(assets.title, searchQuery),
          ilike(assets.description || '', searchQuery)
        )
      );
    
    return this.attachAssetsDetails(result);
  }

  private async attachAssetsDetails(assetsList: Asset[]): Promise<AssetWithDetails[]> {
    if (assetsList.length === 0) return [];
    
    const result: AssetWithDetails[] = [];
    
    for (const asset of assetsList) {
      // Get the creator
      const creator = await this.getUser(asset.creatorId);
      if (!creator) {
        throw new Error(`Failed to find creator for asset ${asset.id}`);
      }
      
      // Get the category
      const category = await this.getCategoryById(asset.categoryId);
      if (!category) {
        throw new Error(`Failed to find category for asset ${asset.id}`);
      }
      
      result.push({
        ...asset,
        creator: {
          id: creator.id,
          displayName: creator.displayName,
          username: creator.username,
          avatarUrl: creator.avatarUrl,
        },
        category: {
          id: category.id,
          name: category.name,
          iconName: category.iconName,
        },
      });
    }
    
    return result;
  }

  private async seedData() {
    // Create categories
    const categories: InsertCategory[] = [
      { name: "Graphics & Design", description: "Illustrations, UI kits, icons, and more", iconName: "ri-image-line", assetCount: 0 },
      { name: "Code & Scripts", description: "Templates, plugins, and components", iconName: "ri-code-s-slash-line", assetCount: 0 },
      { name: "Video Templates", description: "Intros, transitions, and effects", iconName: "ri-video-line", assetCount: 0 },
      { name: "Fonts", description: "Typography for all your projects", iconName: "ri-font-size-2", assetCount: 0 },
      { name: "Audio & Music", description: "Sound effects, music tracks, and more", iconName: "ri-music-2-line", assetCount: 0 },
      { name: "Game Assets", description: "Sprites, models, and textures", iconName: "ri-gamepad-line", assetCount: 0 }
    ];

    // Create categories and store them with their assigned IDs
    const createdCategories = [];
    for (const category of categories) {
      const createdCategory = await this.createCategory(category);
      createdCategories.push(createdCategory);
    }

    // Create users/creators
    const users: InsertUser[] = [
      { 
        username: "designpro", 
        password: "password123", 
        displayName: "Sarah Johnson", 
        bio: "UI/UX Designer specializing in clean, modern interfaces.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        isCreator: true
      },
      { 
        username: "codemaster", 
        password: "password123", 
        displayName: "Alex Thompson", 
        bio: "Full-Stack Developer with a passion for clean code.",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
        isCreator: true
      },
      { 
        username: "3dlab", 
        password: "password123", 
        displayName: "Maya Rodriguez", 
        bio: "3D Artist creating stunning assets for games and applications.",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        isCreator: true
      },
      { 
        username: "videowizard", 
        password: "password123", 
        displayName: "Daniel Kim", 
        bio: "Motion Designer with 10+ years of experience.",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        isCreator: true
      },
      { 
        username: "sounddesigner", 
        password: "password123", 
        displayName: "James Wilson", 
        bio: "Audio engineer and composer for multimedia projects.",
        avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        isCreator: true
      },
      { 
        username: "typefoundry", 
        password: "password123", 
        displayName: "Emily Chen", 
        bio: "Typography designer creating functional and beautiful typefaces.",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        isCreator: true
      }
    ];

    // Create users and store them with their assigned IDs
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await this.createUser(user);
      createdUsers.push(createdUser);
    }

    // Now create assets using the IDs of the created categories and users
    const assetTemplates = [
      {
        title: "Ultimate UI Component Library",
        description: "400+ components, dark/light themes & Figma files included",
        previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
        price: 49,
        categoryIndex: 0, // Graphics & Design
        creatorIndex: 0, // designpro
        tags: ["ui", "design", "components", "figma"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
          "https://images.unsplash.com/photo-1559028012-481c04fa702d",
          "https://images.unsplash.com/photo-1618788372246-79faff0c3742"
        ]
      },
      {
        title: "React Dashboard Starter",
        description: "Clean architecture, Redux integration & API services",
        previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        price: 29,
        categoryIndex: 1, // Code & Scripts
        creatorIndex: 1, // codemaster
        tags: ["react", "redux", "dashboard", "template"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
        ]
      },
      {
        title: "3D Icon Collection",
        description: "150+ 3D icons in multiple formats with source files",
        previewUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
        price: 39,
        categoryIndex: 0, // Graphics & Design
        creatorIndex: 2, // 3dlab
        tags: ["3d", "icons", "design"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2"
        ]
      },
      {
        title: "Cinematic FX Pack",
        description: "Premiere & After Effects templates with 4K resolution",
        previewUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279",
        price: 59,
        categoryIndex: 2, // Video Templates
        creatorIndex: 3, // videowizard
        tags: ["video", "effects", "premiere", "after effects"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1536240478700-b869070f9279"
        ]
      },
      {
        title: "Cinematic Sound FX Pack",
        description: "200+ high-quality sound effects for videos & games",
        previewUrl: "https://images.unsplash.com/photo-1539278670307-a69d04dc8a75",
        price: 35,
        categoryIndex: 4, // Audio & Music
        creatorIndex: 4, // sounddesigner
        tags: ["audio", "sound effects", "cinematic"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1539278670307-a69d04dc8a75"
        ]
      },
      {
        title: "Neo Sans Font Family",
        description: "Clean, modern typeface with 12 weights & multilingual support",
        previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
        price: 79,
        categoryIndex: 3, // Fonts
        creatorIndex: 5, // typefoundry
        tags: ["font", "typography", "sans-serif"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5"
        ]
      }
    ];

    // Create assets
    for (const template of assetTemplates) {
      const asset: InsertAsset = {
        title: template.title,
        description: template.description,
        previewUrl: template.previewUrl,
        price: template.price,
        categoryId: createdCategories[template.categoryIndex].id,
        creatorId: createdUsers[template.creatorIndex].id,
        tags: template.tags,
        featured: template.featured,
        thumbnails: template.thumbnails
      };
      await this.createAsset(asset);
    }
  }
}

// In-memory storage implementation (backup option)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private assets: Map<number, Asset>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentAssetId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.assets = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentAssetId = 1;

    // Initialize with sample data
    this.seedData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      joinedAt: new Date(), 
      isCreator: insertUser.isCreator || false,
      bio: insertUser.bio || null,
      avatarUrl: insertUser.avatarUrl || null  
    };
    this.users.set(id, user);
    return user;
  }

  async getCreators(limit?: number): Promise<User[]> {
    const creators = Array.from(this.users.values()).filter(user => user.isCreator);
    return limit ? creators.slice(0, limit) : creators;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id, 
      assetCount: insertCategory.assetCount || 0,
      description: insertCategory.description || null 
    };
    this.categories.set(id, category);
    return category;
  }

  async getAssets(options: {
    limit?: number;
    categoryId?: number;
    creatorId?: number;
    featured?: boolean;
  } = {}): Promise<AssetWithDetails[]> {
    let assets = Array.from(this.assets.values());

    if (options.categoryId !== undefined) {
      assets = assets.filter(asset => asset.categoryId === options.categoryId);
    }

    if (options.creatorId !== undefined) {
      assets = assets.filter(asset => asset.creatorId === options.creatorId);
    }

    if (options.featured !== undefined) {
      assets = assets.filter(asset => asset.featured === options.featured);
    }

    if (options.limit !== undefined) {
      assets = assets.slice(0, options.limit);
    }

    return this.attachAssetsDetails(assets);
  }

  async getAssetById(id: number): Promise<AssetWithDetails | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;

    const assets = await this.attachAssetsDetails([asset]);
    return assets[0];
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentAssetId++;
    const asset: Asset = {
      ...insertAsset,
      id,
      createdAt: new Date(),
      downloadCount: 0,
      rating: 0,
      description: insertAsset.description || null,
      featured: insertAsset.featured || false,
      tags: insertAsset.tags || [],
      thumbnails: insertAsset.thumbnails || []
    };
    this.assets.set(id, asset);

    // Update category asset count
    const category = this.categories.get(asset.categoryId);
    if (category) {
      this.categories.set(category.id, {
        ...category,
        assetCount: (category.assetCount || 0) + 1
      });
    }

    return asset;
  }

  async getFeaturedAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const featuredAssets = Array.from(this.assets.values())
      .filter(asset => asset.featured)
      .slice(0, limit);
      
    return this.attachAssetsDetails(featuredAssets);
  }

  async getRecentAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const recentAssets = Array.from(this.assets.values())
      .sort((a, b) => {
        const aTime = a.createdAt ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt ? b.createdAt.getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, limit);
      
    return this.attachAssetsDetails(recentAssets);
  }

  async getTrendingAssets(limit: number = 4): Promise<AssetWithDetails[]> {
    const trendingAssets = Array.from(this.assets.values())
      .sort((a, b) => {
        const aCount = a.downloadCount || 0;
        const bCount = b.downloadCount || 0;
        return bCount - aCount;
      })
      .slice(0, limit);
      
    return this.attachAssetsDetails(trendingAssets);
  }

  async searchAssets(query: string): Promise<AssetWithDetails[]> {
    const lowerQuery = query.toLowerCase();
    const matchingAssets = Array.from(this.assets.values())
      .filter(asset => 
        asset.title.toLowerCase().includes(lowerQuery) || 
        (asset.description && asset.description.toLowerCase().includes(lowerQuery)) ||
        (asset.tags && asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
      
    return this.attachAssetsDetails(matchingAssets);
  }

  private async attachAssetsDetails(assets: Asset[]): Promise<AssetWithDetails[]> {
    return assets.map(asset => {
      const creator = this.users.get(asset.creatorId);
      const category = this.categories.get(asset.categoryId);

      if (!creator || !category) {
        throw new Error(`Missing creator or category for asset ${asset.id}`);
      }

      return {
        ...asset,
        creator: {
          id: creator.id,
          displayName: creator.displayName,
          username: creator.username,
          avatarUrl: creator.avatarUrl
        },
        category: {
          id: category.id,
          name: category.name,
          iconName: category.iconName
        }
      };
    });
  }

  private seedData() {
    // Create categories
    const categories: InsertCategory[] = [
      { name: "Graphics & Design", description: "Illustrations, UI kits, icons, and more", iconName: "ri-image-line", assetCount: 0 },
      { name: "Code & Scripts", description: "Templates, plugins, and components", iconName: "ri-code-s-slash-line", assetCount: 0 },
      { name: "Video Templates", description: "Intros, transitions, and effects", iconName: "ri-video-line", assetCount: 0 },
      { name: "Fonts", description: "Typography for all your projects", iconName: "ri-font-size-2", assetCount: 0 },
      { name: "Audio & Music", description: "Sound effects, music tracks, and more", iconName: "ri-music-2-line", assetCount: 0 },
      { name: "Game Assets", description: "Sprites, models, and textures", iconName: "ri-gamepad-line", assetCount: 0 }
    ];

    categories.forEach(category => {
      this.createCategory(category);
    });

    // Create users/creators
    const users: InsertUser[] = [
      { 
        username: "designpro", 
        password: "password123", 
        displayName: "Sarah Johnson", 
        bio: "UI/UX Designer specializing in clean, modern interfaces.",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        isCreator: true
      },
      { 
        username: "codemaster", 
        password: "password123", 
        displayName: "Alex Thompson", 
        bio: "Full-Stack Developer with a passion for clean code.",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
        isCreator: true
      },
      { 
        username: "3dlab", 
        password: "password123", 
        displayName: "Maya Rodriguez", 
        bio: "3D Artist creating stunning assets for games and applications.",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        isCreator: true
      },
      { 
        username: "videowizard", 
        password: "password123", 
        displayName: "Daniel Kim", 
        bio: "Motion Designer with 10+ years of experience.",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        isCreator: true
      },
      { 
        username: "sounddesigner", 
        password: "password123", 
        displayName: "James Wilson", 
        bio: "Audio engineer and composer for multimedia projects.",
        avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        isCreator: true
      },
      { 
        username: "typefoundry", 
        password: "password123", 
        displayName: "Emily Chen", 
        bio: "Typography designer creating functional and beautiful typefaces.",
        avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
        isCreator: true
      }
    ];

    users.forEach(user => {
      this.createUser(user);
    });

    // Create assets
    const sampleAssets: InsertAsset[] = [
      {
        title: "Ultimate UI Component Library",
        description: "400+ components, dark/light themes & Figma files included",
        previewUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
        price: 49,
        categoryId: 1,
        creatorId: 1,
        tags: ["ui", "design", "components", "figma"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb",
          "https://images.unsplash.com/photo-1559028012-481c04fa702d",
          "https://images.unsplash.com/photo-1618788372246-79faff0c3742"
        ]
      },
      {
        title: "React Dashboard Starter",
        description: "Clean architecture, Redux integration & API services",
        previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        price: 29,
        categoryId: 2,
        creatorId: 2,
        tags: ["react", "redux", "dashboard", "template"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
        ]
      },
      {
        title: "3D Icon Collection",
        description: "150+ 3D icons in multiple formats with source files",
        previewUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
        price: 39,
        categoryId: 1,
        creatorId: 3,
        tags: ["3d", "icons", "design"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2"
        ]
      },
      {
        title: "Cinematic FX Pack",
        description: "Premiere & After Effects templates with 4K resolution",
        previewUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279",
        price: 59,
        categoryId: 3,
        creatorId: 4,
        tags: ["video", "effects", "premiere", "after effects"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1536240478700-b869070f9279"
        ]
      },
      {
        title: "Cinematic Sound FX Pack",
        description: "200+ high-quality sound effects for videos & games",
        previewUrl: "https://images.unsplash.com/photo-1539278670307-a69d04dc8a75",
        price: 35,
        categoryId: 5,
        creatorId: 5,
        tags: ["audio", "sound effects", "cinematic"],
        featured: false,
        thumbnails: [
          "https://images.unsplash.com/photo-1539278670307-a69d04dc8a75"
        ]
      },
      {
        title: "Neo Sans Font Family",
        description: "Clean, modern typeface with 12 weights & multilingual support",
        previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
        price: 79,
        categoryId: 4,
        creatorId: 6,
        tags: ["font", "typography", "sans-serif"],
        featured: true,
        thumbnails: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5"
        ]
      }
    ];

    sampleAssets.forEach(asset => {
      this.createAsset(asset);
    });
  }
}

// Choose which storage implementation to use based on the environment
export const storage = db ? new PostgresStorage() : new MemStorage();
