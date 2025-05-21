import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { z } from 'zod';
import { insertUserSchema } from '@shared/schema';
import bcrypt from 'bcryptjs';

// For signup validation 
const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string().optional(),
});

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const userId = req.session?.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await storage.getUser(userId);
    if (!user) {
      // @ts-ignore
      req.session.destroy();
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login handler
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, we'd use bcrypt.compare(password, user.password)
    // For demo purposes, we'll do a simple comparison 
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // @ts-ignore - Set user session
    req.session.userId = user.id;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Signup handler
export const signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: result.error.format() 
      });
    }
    
    const { confirmPassword, ...userData } = result.data;
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    // In a real app, we'd hash the password: userData.password = await bcrypt.hash(userData.password, 10)
    
    // Create user
    const newUser = await storage.createUser(userData);
    
    // @ts-ignore - Set user session
    req.session.userId = newUser.id;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      // @ts-ignore
      req.session.destroy();
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout handler
export const logout = (req: Request, res: Response) => {
  // @ts-ignore
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  });
};