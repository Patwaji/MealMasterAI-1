import { pgTable, text, serial, integer, boolean, json, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Meal planner schemas
export const mealPreferences = z.object({
  cuisineType: z.enum(["italian", "asian", "mexican", "american", "mediterranean", "indian", "any"]),
  dietaryRestrictions: z.enum(["none", "vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo"]),
  dislikedIngredients: z.string().optional()
});

export const healthGoals = z.object({
  primaryGoal: z.enum(["weight-loss", "muscle-gain", "maintenance"]),
  calorieTarget: z.number().min(1200).max(3500).optional(),
  healthConditions: z.enum(["none", "diabetes", "heart", "low-sodium", "ibs"]).optional()
});

export const budgetConstraints = z.object({
  dailyBudget: z.number().min(10).max(50),
  budgetPriority: z.enum(["strict", "balanced", "nutrition"]),
  mealBudget: z.object({
    breakfast: z.number().optional(),
    lunch: z.number().optional(),
    snack: z.number().optional(),
    dinner: z.number().optional()
  }).optional()
});

export const mealPlanRequest = z.object({
  preferences: mealPreferences,
  goals: healthGoals,
  budget: budgetConstraints
});

export type MealPreferences = z.infer<typeof mealPreferences>;
export type HealthGoals = z.infer<typeof healthGoals>;
export type BudgetConstraints = z.infer<typeof budgetConstraints>;
export type MealPlanRequest = z.infer<typeof mealPlanRequest>;

// Nutrition information
export const nutritionInfo = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number().optional(),
  sugar: z.number().optional()
});

export type NutritionInfo = z.infer<typeof nutritionInfo>;

// Individual meal
export const meal = z.object({
  name: z.string(),
  type: z.enum(["breakfast", "lunch", "snack", "dinner"]),
  cost: z.number(),
  nutrition: nutritionInfo,
  ingredients: z.array(z.string())
});

export type Meal = z.infer<typeof meal>;

// Complete meal plan
export const mealPlan = z.object({
  breakfast: meal,
  lunch: meal,
  snack: meal,
  dinner: meal,
  totalNutrition: nutritionInfo,
  totalCost: z.number()
});

export type MealPlan = z.infer<typeof mealPlan>;
