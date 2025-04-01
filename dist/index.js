var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  budgetConstraints: () => budgetConstraints,
  healthGoals: () => healthGoals,
  insertMealPlanSchema: () => insertMealPlanSchema,
  insertUserSchema: () => insertUserSchema,
  meal: () => meal,
  mealPlan: () => mealPlan,
  mealPlanRequest: () => mealPlanRequest,
  mealPreferences: () => mealPreferences,
  nutritionInfo: () => nutritionInfo,
  savedMealPlans: () => savedMealPlans,
  users: () => users
});
import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  created_at: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});
var savedMealPlans = pgTable("saved_meal_plans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  plan_name: text("plan_name").notNull(),
  date_created: timestamp("date_created").defaultNow(),
  preferences: jsonb("preferences").notNull(),
  goals: jsonb("goals").notNull(),
  budget: jsonb("budget").notNull(),
  plan_data: jsonb("plan_data").notNull()
});
var insertMealPlanSchema = createInsertSchema(savedMealPlans).omit({
  id: true,
  date_created: true
});
var mealPreferences = z.object({
  cuisineType: z.enum(["italian", "asian", "mexican", "american", "mediterranean", "indian", "any"]),
  dietaryRestrictions: z.enum(["none", "vegetarian", "vegan", "gluten-free", "dairy-free", "keto", "paleo"]),
  dislikedIngredients: z.string().optional()
});
var healthGoals = z.object({
  primaryGoal: z.enum(["weight-loss", "muscle-gain", "maintenance"]),
  calorieTarget: z.number().min(1200).max(3500).optional(),
  healthConditions: z.enum(["none", "diabetes", "heart", "low-sodium", "ibs"]).optional()
});
var budgetConstraints = z.object({
  dailyBudget: z.number().min(10).max(50),
  budgetPriority: z.enum(["strict", "balanced", "nutrition"]),
  mealBudget: z.object({
    breakfast: z.number().optional(),
    lunch: z.number().optional(),
    snack: z.number().optional(),
    dinner: z.number().optional()
  }).optional()
});
var mealPlanRequest = z.object({
  preferences: mealPreferences,
  goals: healthGoals,
  budget: budgetConstraints
});
var nutritionInfo = z.object({
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  fiber: z.number().optional(),
  sugar: z.number().optional()
});
var meal = z.object({
  name: z.string(),
  type: z.enum(["breakfast", "lunch", "snack", "dinner"]),
  cost: z.number(),
  nutrition: nutritionInfo,
  ingredients: z.array(z.string())
});
var mealPlan = z.object({
  breakfast: meal,
  lunch: meal,
  snack: meal,
  dinner: meal,
  totalNutrition: nutritionInfo,
  totalCost: z.number()
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
var { Pool } = pkg;
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports });
async function initDB() {
  try {
    console.log("Initializing database...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS saved_meal_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        plan_name TEXT NOT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        preferences JSONB NOT NULL,
        goals JSONB NOT NULL,
        budget JSONB NOT NULL,
        plan_data JSONB NOT NULL
      );
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// server/storage.ts
import { eq } from "drizzle-orm";
var PostgresStorage = class {
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  // Meal plan operations
  async saveMealPlan(mealPlan2) {
    const result = await db.insert(savedMealPlans).values(mealPlan2).returning();
    return result[0];
  }
  async getUserMealPlans(userId) {
    return await db.select().from(savedMealPlans).where(eq(savedMealPlans.user_id, userId));
  }
  async getMealPlan(id) {
    const result = await db.select().from(savedMealPlans).where(eq(savedMealPlans.id, id));
    return result[0];
  }
  async deleteMealPlan(id) {
    const result = await db.delete(savedMealPlans).where(eq(savedMealPlans.id, id)).returning({ id: savedMealPlans.id });
    return result.length > 0;
  }
};
var storage = new PostgresStorage();

// server/nutrition-api.ts
import axios from "axios";
var API_KEY = process.env.SPOONACULAR_API_KEY || process.env.NUTRITION_API_KEY || process.env.API_KEY || "your_default_key";
var API_BASE_URL = "https://api.spoonacular.com";
async function getNutritionInfo(food) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/guessNutrition`, {
      params: {
        apiKey: API_KEY,
        title: food
      }
    });
    const data = response.data;
    return {
      calories: data.calories.value || 0,
      protein: data.protein.value || 0,
      carbs: data.carbs.value || 0,
      fat: data.fat.value || 0,
      fiber: data.fiber?.value || 0,
      sugar: data.sugar?.value || 0
    };
  } catch (error) {
    console.error("Error fetching nutrition info from Spoonacular:", error);
    throw new Error("Failed to fetch nutrition information");
  }
}
async function searchRecipes(query, cuisine, diet, excludeIngredients, maxCalories) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        cuisine,
        diet,
        excludeIngredients,
        maxCalories,
        addRecipeNutrition: true,
        number: 5
        // limit results
      }
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching recipes from Spoonacular:", error);
    throw new Error("Failed to search recipes");
  }
}
async function getRecipeInformation(recipeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe info from Spoonacular:", error);
    throw new Error("Failed to fetch recipe information");
  }
}
async function getRecipePriceBreakdown(recipeId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}/priceBreakdownWidget.json`, {
      params: {
        apiKey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe price from Spoonacular:", error);
    throw new Error("Failed to fetch recipe price information");
  }
}

// server/meal-generator.ts
var defaultMeals = {
  breakfast: [
    {
      name: "Greek Yogurt with Berry Compote & Granola",
      type: "breakfast",
      cost: 5.85,
      nutrition: {
        calories: 490,
        protein: 24,
        carbs: 65,
        fat: 14,
        fiber: 7,
        sugar: 28
      },
      ingredients: [
        "1 cup Greek yogurt",
        "1/2 cup mixed berries (fresh or frozen)",
        "1/4 cup granola",
        "1 tbsp honey",
        "1/2 tsp vanilla extract"
      ]
    },
    {
      name: "Vegetable Omelette with Whole Grain Toast",
      type: "breakfast",
      cost: 4.95,
      nutrition: {
        calories: 420,
        protein: 22,
        carbs: 38,
        fat: 18,
        fiber: 6,
        sugar: 8
      },
      ingredients: [
        "2 eggs",
        "1/4 cup diced bell peppers",
        "1/4 cup diced onions",
        "2 tbsp shredded cheese",
        "1 slice whole grain bread",
        "1 tsp butter",
        "Salt and pepper to taste"
      ]
    }
  ],
  lunch: [
    {
      name: "Mediterranean Quinoa Bowl with Grilled Chicken",
      type: "lunch",
      cost: 7.5,
      nutrition: {
        calories: 615,
        protein: 40,
        carbs: 55,
        fat: 25,
        fiber: 8,
        sugar: 4
      },
      ingredients: [
        "4 oz grilled chicken breast",
        "3/4 cup cooked quinoa",
        "1/4 cup cucumber, diced",
        "1/4 cup cherry tomatoes, halved",
        "2 tbsp feta cheese",
        "2 tbsp olive oil",
        "1 tbsp lemon juice",
        "1 tsp dried oregano",
        "5 kalamata olives"
      ]
    },
    {
      name: "Lentil Soup with Mixed Green Salad",
      type: "lunch",
      cost: 6.25,
      nutrition: {
        calories: 520,
        protein: 28,
        carbs: 65,
        fat: 18,
        fiber: 14,
        sugar: 10
      },
      ingredients: [
        "1 cup lentil soup",
        "2 cups mixed greens",
        "1/4 avocado, sliced",
        "2 tbsp vinaigrette dressing",
        "1 slice whole grain bread",
        "1 tbsp olive oil"
      ]
    }
  ],
  snack: [
    {
      name: "Apple Slices with Almond Butter",
      type: "snack",
      cost: 3,
      nutrition: {
        calories: 280,
        protein: 7,
        carbs: 30,
        fat: 16,
        fiber: 5,
        sugar: 19
      },
      ingredients: [
        "1 medium apple",
        "2 tbsp almond butter",
        "1/2 tsp cinnamon (optional)"
      ]
    },
    {
      name: "Hummus with Carrot and Celery Sticks",
      type: "snack",
      cost: 2.75,
      nutrition: {
        calories: 240,
        protein: 6,
        carbs: 25,
        fat: 14,
        fiber: 7,
        sugar: 6
      },
      ingredients: [
        "1/4 cup hummus",
        "1 medium carrot, sliced",
        "2 celery stalks, sliced",
        "1 tsp olive oil",
        "Dash of paprika"
      ]
    }
  ],
  dinner: [
    {
      name: "Baked Salmon with Roasted Vegetables",
      type: "dinner",
      cost: 7.5,
      nutrition: {
        calories: 720,
        protein: 39,
        carbs: 70,
        fat: 32,
        fiber: 10,
        sugar: 12
      },
      ingredients: [
        "5 oz salmon fillet",
        "1 cup sweet potato, cubed",
        "1 cup broccoli florets",
        "1/2 cup bell peppers, sliced",
        "2 tbsp olive oil",
        "1 clove garlic, minced",
        "1 tbsp lemon juice",
        "1 tsp dried herbs (thyme, rosemary)",
        "Salt and pepper to taste"
      ]
    },
    {
      name: "Chickpea and Vegetable Curry with Brown Rice",
      type: "dinner",
      cost: 6.8,
      nutrition: {
        calories: 650,
        protein: 22,
        carbs: 95,
        fat: 23,
        fiber: 16,
        sugar: 14
      },
      ingredients: [
        "1 cup chickpeas, cooked",
        "1/2 cup mixed vegetables (cauliflower, peas, carrots)",
        "3/4 cup brown rice, cooked",
        "1/4 cup coconut milk",
        "2 tbsp curry paste or powder",
        "1 tbsp vegetable oil",
        "1 small onion, diced",
        "1 clove garlic, minced",
        "1 tsp ginger, minced",
        "Fresh cilantro for garnish"
      ]
    }
  ]
};
function calculateTotalNutrition(mealPlan2) {
  const meals = [mealPlan2.breakfast, mealPlan2.lunch, mealPlan2.snack, mealPlan2.dinner];
  const totalNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0
  };
  for (const meal2 of meals) {
    totalNutrition.calories += meal2.nutrition.calories;
    totalNutrition.protein += meal2.nutrition.protein;
    totalNutrition.carbs += meal2.nutrition.carbs;
    totalNutrition.fat += meal2.nutrition.fat;
    if (meal2.nutrition.fiber !== void 0 && totalNutrition.fiber !== void 0) {
      totalNutrition.fiber += meal2.nutrition.fiber;
    }
    if (meal2.nutrition.sugar !== void 0 && totalNutrition.sugar !== void 0) {
      totalNutrition.sugar += meal2.nutrition.sugar;
    }
  }
  return totalNutrition;
}
async function generateMealPlan(request) {
  const { preferences, goals, budget } = request;
  try {
    const dietMap = {
      "vegetarian": "vegetarian",
      "vegan": "vegan",
      "gluten-free": "gluten free",
      "dairy-free": "dairy free",
      "keto": "ketogenic",
      "paleo": "paleo"
    };
    const diet = preferences.dietaryRestrictions !== "none" ? dietMap[preferences.dietaryRestrictions] : void 0;
    let targetCalories = goals.calorieTarget;
    if (!targetCalories) {
      switch (goals.primaryGoal) {
        case "weight-loss":
          targetCalories = 1800;
          break;
        case "muscle-gain":
          targetCalories = 2600;
          break;
        case "maintenance":
        default:
          targetCalories = 2100;
      }
    }
    const breakfastCalories = Math.round(targetCalories * 0.25);
    const lunchCalories = Math.round(targetCalories * 0.3);
    const snackCalories = Math.round(targetCalories * 0.15);
    const dinnerCalories = Math.round(targetCalories * 0.3);
    let breakfastMeal;
    let lunchMeal;
    let snackMeal;
    let dinnerMeal;
    try {
      const breakfastQuery = "breakfast " + (preferences.cuisineType !== "any" ? preferences.cuisineType : "");
      const breakfastResults = await searchRecipes(
        breakfastQuery,
        preferences.cuisineType !== "any" ? preferences.cuisineType : void 0,
        diet,
        preferences.dislikedIngredients,
        breakfastCalories + 100
        // Allow some flexibility
      );
      if (breakfastResults && breakfastResults.length > 0) {
        const recipe = breakfastResults[0];
        const recipeInfo = await getRecipeInformation(recipe.id);
        const priceInfo = await getRecipePriceBreakdown(recipe.id);
        const ingredients = recipeInfo.extendedIngredients.map(
          (ing) => `${ing.amount} ${ing.unit} ${ing.name}`
        );
        breakfastMeal = {
          name: recipe.title,
          type: "breakfast",
          cost: parseFloat((priceInfo.totalCost / 100).toFixed(2)),
          // Convert cents to rupees
          nutrition: {
            calories: recipe.nutrition.nutrients.find((n) => n.name === "Calories").amount,
            protein: recipe.nutrition.nutrients.find((n) => n.name === "Protein").amount,
            carbs: recipe.nutrition.nutrients.find((n) => n.name === "Carbohydrates").amount,
            fat: recipe.nutrition.nutrients.find((n) => n.name === "Fat").amount,
            fiber: recipe.nutrition.nutrients.find((n) => n.name === "Fiber")?.amount,
            sugar: recipe.nutrition.nutrients.find((n) => n.name === "Sugar")?.amount
          },
          ingredients
        };
      } else {
        breakfastMeal = defaultMeals.breakfast[0];
      }
      lunchMeal = defaultMeals.lunch[0];
      snackMeal = defaultMeals.snack[0];
      dinnerMeal = defaultMeals.dinner[0];
    } catch (error) {
      console.error("Error fetching meal data from API:", error);
      breakfastMeal = defaultMeals.breakfast[Math.floor(Math.random() * defaultMeals.breakfast.length)];
      lunchMeal = defaultMeals.lunch[Math.floor(Math.random() * defaultMeals.lunch.length)];
      snackMeal = defaultMeals.snack[Math.floor(Math.random() * defaultMeals.snack.length)];
      dinnerMeal = defaultMeals.dinner[Math.floor(Math.random() * defaultMeals.dinner.length)];
    }
    const mealPlanObj = {
      breakfast: breakfastMeal,
      lunch: lunchMeal,
      snack: snackMeal,
      dinner: dinnerMeal
    };
    const totalNutrition = calculateTotalNutrition(mealPlanObj);
    const totalCost = breakfastMeal.cost + lunchMeal.cost + snackMeal.cost + dinnerMeal.cost;
    return {
      ...mealPlanObj,
      totalNutrition,
      totalCost
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);
    const fallbackPlan = {
      breakfast: defaultMeals.breakfast[0],
      lunch: defaultMeals.lunch[0],
      snack: defaultMeals.snack[0],
      dinner: defaultMeals.dinner[0]
    };
    const totalNutrition = calculateTotalNutrition(fallbackPlan);
    const totalCost = fallbackPlan.breakfast.cost + fallbackPlan.lunch.cost + fallbackPlan.snack.cost + fallbackPlan.dinner.cost;
    return {
      ...fallbackPlan,
      totalNutrition,
      totalCost
    };
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/meal-plan", async (req, res) => {
    try {
      const result = mealPlanRequest.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid request body",
          errors: result.error.errors
        });
      }
      const mealPlanData = result.data;
      const mealPlan2 = await generateMealPlan(mealPlanData);
      return res.json(mealPlan2);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      return res.status(500).json({
        message: "Failed to generate meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/nutrition/:food", async (req, res) => {
    try {
      const food = req.params.food;
      if (!food) {
        return res.status(400).json({ message: "Food parameter is required" });
      }
      const nutritionInfo2 = await getNutritionInfo(food);
      return res.json(nutritionInfo2);
    } catch (error) {
      console.error("Error fetching nutrition info:", error);
      return res.status(500).json({
        message: "Failed to fetch nutrition information",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.post("/api/meal-plans/save", async (req, res) => {
    try {
      const userId = req.body.user_id || 1;
      const planName = req.body.plan_name || `Meal Plan - ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`;
      const mealPlanResult = mealPlanRequest.safeParse(req.body.plan_request);
      if (!mealPlanResult.success) {
        return res.status(400).json({
          message: "Invalid meal plan request",
          errors: mealPlanResult.error.errors
        });
      }
      if (!req.body.plan_data) {
        return res.status(400).json({ message: "Plan data is required" });
      }
      const insertData = {
        user_id: userId,
        plan_name: planName,
        preferences: mealPlanResult.data.preferences,
        goals: mealPlanResult.data.goals,
        budget: mealPlanResult.data.budget,
        plan_data: req.body.plan_data
      };
      const savedPlan = await storage.saveMealPlan(insertData);
      return res.status(201).json(savedPlan);
    } catch (error) {
      console.error("Error saving meal plan:", error);
      return res.status(500).json({
        message: "Failed to save meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/meal-plans/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const mealPlans = await storage.getUserMealPlans(userId);
      return res.json(mealPlans);
    } catch (error) {
      console.error("Error fetching user meal plans:", error);
      return res.status(500).json({
        message: "Failed to fetch user meal plans",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/meal-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid meal plan ID" });
      }
      const mealPlan2 = await storage.getMealPlan(planId);
      if (!mealPlan2) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      return res.json(mealPlan2);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      return res.status(500).json({
        message: "Failed to fetch meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/meal-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid meal plan ID" });
      }
      const deleted = await storage.deleteMealPlan(planId);
      if (!deleted) {
        return res.status(404).json({ message: "Meal plan not found or already deleted" });
      }
      return res.json({ message: "Meal plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      return res.status(500).json({
        message: "Failed to delete meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await initDB();
    log("Database initialized successfully", "server");
  } catch (error) {
    log(`Failed to initialize database: ${error}`, "server");
    process.exit(1);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
