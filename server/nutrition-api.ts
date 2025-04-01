import axios from 'axios';
import { NutritionInfo } from '@shared/schema';

// Spoonacular API key (get from environment variables)
const API_KEY = process.env.SPOONACULAR_API_KEY || 
                process.env.NUTRITION_API_KEY || 
                process.env.API_KEY || 
                "your_default_key";

const API_BASE_URL = 'https://api.spoonacular.com';

/**
 * Fetches nutrition information for a food item from Spoonacular API
 * @param food The food item to get nutrition information for
 * @returns Nutrition information including calories, protein, carbs, and fat
 */
export async function getNutritionInfo(food: string): Promise<NutritionInfo> {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/guessNutrition`, {
      params: {
        apiKey: API_KEY,
        title: food
      }
    });

    const data = response.data;

    // Extract and return the relevant nutrition information
    return {
      calories: data.calories.value || 0,
      protein: data.protein.value || 0,
      carbs: data.carbs.value || 0,
      fat: data.fat.value || 0,
      fiber: data.fiber?.value || 0,
      sugar: data.sugar?.value || 0
    };
  } catch (error) {
    console.error('Error fetching nutrition info from Spoonacular:', error);
    throw new Error('Failed to fetch nutrition information');
  }
}

/**
 * Searches for recipes based on criteria
 * @param query Search query
 * @param cuisine Cuisine type
 * @param diet Dietary restrictions
 * @param excludeIngredients Ingredients to exclude
 * @param maxCalories Maximum calories
 * @returns Array of matching recipes
 */
export async function searchRecipes(
  query: string,
  cuisine?: string,
  diet?: string,
  excludeIngredients?: string,
  maxCalories?: number
) {
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
        number: 5 // limit results
      }
    });

    return response.data.results;
  } catch (error) {
    console.error('Error searching recipes from Spoonacular:', error);
    throw new Error('Failed to search recipes');
  }
}

/**
 * Gets detailed information about a recipe including ingredients
 * @param recipeId The ID of the recipe
 * @returns Detailed recipe information
 */
export async function getRecipeInformation(recipeId: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching recipe info from Spoonacular:', error);
    throw new Error('Failed to fetch recipe information');
  }
}

/**
 * Gets recipe information including price breakdown
 * @param recipeId The ID of the recipe
 * @returns Price information for the recipe
 */
export async function getRecipePriceBreakdown(recipeId: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}/priceBreakdownWidget.json`, {
      params: {
        apiKey: API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching recipe price from Spoonacular:', error);
    throw new Error('Failed to fetch recipe price information');
  }
}
