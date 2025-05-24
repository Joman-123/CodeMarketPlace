import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAssetSchema, insertCategorySchema, insertUserSchema } from "@shared/schema";
import { login, signup, getCurrentUser, logout, authMiddleware } from "./auth";
import session from "express-session";
import { log } from "./vite";
import { registerUploadRoute } from "./upload";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "creatorhub-marketplace-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);
  app.get("/api/auth/me", getCurrentUser);
  app.post("/api/auth/logout", logout);

  // API Routes

  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't send password to client
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.get("/api/creators", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const creators = await storage.getCreators(limit);
    
    // Don't send passwords to client
    const creatorsWithoutPasswords = creators.map(creator => {
      const { password, ...creatorWithoutPassword } = creator;
      return creatorWithoutPassword;
    });
    
    res.json(creatorsWithoutPasswords);
  });

  // Category routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const category = await storage.getCategoryById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });
  
  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Asset routes
  app.get("/api/assets", async (req: Request, res: Response) => {
    const {
      limit,
      categoryId,
      creatorId,
      featured
    } = req.query;
    
    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      creatorId: creatorId ? parseInt(creatorId as string) : undefined,
      featured: featured ? featured === 'true' : undefined
    };
    
    const assets = await storage.getAssets(options);
    res.json(assets);
  });
  
  app.get("/api/assets/featured", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const featuredAssets = await storage.getFeaturedAssets(limit);
    res.json(featuredAssets);
  });
  
  app.get("/api/assets/recent", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const recentAssets = await storage.getRecentAssets(limit);
    res.json(recentAssets);
  });
  
  app.get("/api/assets/trending", async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const trendingAssets = await storage.getTrendingAssets(limit);
    res.json(trendingAssets);
  });
  
  app.get("/api/assets/search", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const searchResults = await storage.searchAssets(query);
    res.json(searchResults);
  });
  
  app.get("/api/assets/download/:id", authMiddleware, async (req: Request, res: Response) => {
  const assetId = parseInt(req.params.id);
  // @ts-ignore - user is set by authMiddleware
  const userId = req.user.id;
  
  // Check if user has purchased the asset
  const hasPurchased = await storage.checkPurchase(userId, assetId);
  if (!hasPurchased) {
    return res.status(403).json({ error: 'Asset not purchased' });
  }
  
  // Generate temporary download URL
  const downloadUrl = await storage.generateDownloadUrl(assetId);
  res.json({ downloadUrl });
    const assetId = parseInt(req.params.id);
    
    if (isNaN(assetId)) {
      return res.status(400).json({ message: "Invalid asset ID" });
    }
    
    const asset = await storage.getAssetById(assetId);
    
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    
    res.json(asset);
  });
  
  app.post("/api/assets", authMiddleware, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - user is set by authMiddleware
      const user = req.user;
      
      // Check if user is a creator
      if (!user.isCreator) {
        return res.status(403).json({ 
          message: "Only creators can publish assets" 
        });
      }
      
      const assetData = insertAssetSchema.parse(req.body);
      
      // Set creatorId to current user's ID
      const assetWithCreator = {
        ...assetData,
        creatorId: user.id
      };
      
      const asset = await storage.createAsset(assetWithCreator);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      log(`Error creating asset: ${error}`, "routes");
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  registerUploadRoute(app);

  const httpServer = createServer(app);

  return httpServer;
}
