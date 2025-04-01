import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mealPlanRequest, MealPlanRequest } from "../shared/schema";
import { generateMealPlan } from "./meal-generator";
import { getNutritionInfo } from "./nutrition-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate a meal plan
  app.post('/api/meal-plan', async (req, res) => {
    try {
      // Validate request body
      const result = mealPlanRequest.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: result.error.errors 
        });
      }
      
      const mealPlanData: MealPlanRequest = result.data;
      
      // Generate the meal plan using our algorithm
      const mealPlan = await generateMealPlan(mealPlanData);
      
      // Return the generated meal plan
      return res.json(mealPlan);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      return res.status(500).json({ 
        message: "Failed to generate meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API endpoint to get nutrition info for a specific food
  app.get('/api/nutrition/:food', async (req, res) => {
    try {
      const food = req.params.food;
      
      if (!food) {
        return res.status(400).json({ message: "Food parameter is required" });
      }
      
      // Get nutrition information from external API
      const nutritionInfo = await getNutritionInfo(food);
      
      return res.json(nutritionInfo);
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
      return res.status(500).json({ 
        message: "Failed to fetch nutrition information",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
