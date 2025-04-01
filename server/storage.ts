import { 
  users, 
  savedMealPlans, 
  type User, 
  type InsertUser, 
  type MealPlan, 
  type SavedMealPlan, 
  type InsertMealPlan, 
  type MealPlanRequest 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Meal plan operations
  saveMealPlan(mealPlan: InsertMealPlan): Promise<SavedMealPlan>;
  getUserMealPlans(userId: number): Promise<SavedMealPlan[]>;
  getMealPlan(id: number): Promise<SavedMealPlan | undefined>;
  deleteMealPlan(id: number): Promise<boolean>;
}

export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Meal plan operations
  async saveMealPlan(mealPlan: InsertMealPlan): Promise<SavedMealPlan> {
    const result = await db.insert(savedMealPlans).values(mealPlan).returning();
    return result[0];
  }

  async getUserMealPlans(userId: number): Promise<SavedMealPlan[]> {
    return await db.select().from(savedMealPlans).where(eq(savedMealPlans.user_id, userId));
  }

  async getMealPlan(id: number): Promise<SavedMealPlan | undefined> {
    const result = await db.select().from(savedMealPlans).where(eq(savedMealPlans.id, id));
    return result[0];
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    const result = await db.delete(savedMealPlans).where(eq(savedMealPlans.id, id)).returning({ id: savedMealPlans.id });
    return result.length > 0;
  }
}

export const storage = new PostgresStorage();
