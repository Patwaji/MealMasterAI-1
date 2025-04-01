import axios from 'axios';
import { NutritionInfo, Meal, MealPlanRequest, MealPlan } from '@shared/schema';

// USDA Nutrition API base URL
const USDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const USDA_API_KEY = process.env.USDA_API_KEY || 'demo_key'; // Default to demo key for testing

/**
 * Generates a complete meal plan using AI suggestions and USDA nutrition data
 * @param request User preferences and requirements for the meal plan
 * @returns A complete meal plan with nutritional information
 */
export async function generateAIMealPlan(request: MealPlanRequest): Promise<MealPlan> {
  try {
    const { preferences, goals, budget } = request;
    
    // Generate meal suggestions based on user preferences
    const meals = await generateMealSuggestions(preferences, goals, budget);
    
    // Calculate total nutrition
    const totalNutrition = calculateTotalNutrition(meals);
    
    // Calculate total cost
    const totalCost = meals.breakfast.cost + meals.lunch.cost + 
                      meals.snack.cost + meals.dinner.cost;
    
    // Create the complete meal plan
    const mealPlan: MealPlan = {
      breakfast: meals.breakfast,
      lunch: meals.lunch,
      snack: meals.snack,
      dinner: meals.dinner,
      totalNutrition,
      totalCost
    };
    
    return mealPlan;
  } catch (error) {
    console.error('Error generating AI meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}

/**
 * Generates meal suggestions based on user preferences
 * This is a fallback function that creates reasonable meal suggestions
 * when external APIs are unavailable
 */
async function generateMealSuggestions(
  preferences: MealPlanRequest['preferences'],
  goals: MealPlanRequest['goals'],
  budget: MealPlanRequest['budget']
) {
  // Calculate per-meal budget (if not specified)
  const mealBudget = budget.mealBudget || {
    breakfast: Math.round(budget.dailyBudget * 0.25),
    lunch: Math.round(budget.dailyBudget * 0.3),
    snack: Math.round(budget.dailyBudget * 0.15),
    dinner: Math.round(budget.dailyBudget * 0.3)
  };

  // Calculate target calories based on goal
  let targetCalories = goals.calorieTarget || 2000; // Default to 2000 calories
  if (goals.primaryGoal === 'weight-loss') {
    targetCalories = Math.max(1200, targetCalories - 500); // Deficit of 500 calories
  } else if (goals.primaryGoal === 'muscle-gain') {
    targetCalories = targetCalories + 300; // Surplus of 300 calories
  }

  // Calculate per-meal calorie targets
  const breakfastCalories = Math.round(targetCalories * 0.25);
  const lunchCalories = Math.round(targetCalories * 0.3);
  const snackCalories = Math.round(targetCalories * 0.15);
  const dinnerCalories = Math.round(targetCalories * 0.3);

  // Diet-specific adjustments
  const dietType = preferences.dietaryRestrictions;
  
  // Generate meal suggestions based on cuisine preference and dietary restrictions
  return {
    breakfast: await generateSingleMeal('breakfast', breakfastCalories, mealBudget.breakfast || Math.round(budget.dailyBudget * 0.25), preferences, goals),
    lunch: await generateSingleMeal('lunch', lunchCalories, mealBudget.lunch || Math.round(budget.dailyBudget * 0.3), preferences, goals),
    snack: await generateSingleMeal('snack', snackCalories, mealBudget.snack || Math.round(budget.dailyBudget * 0.15), preferences, goals),
    dinner: await generateSingleMeal('dinner', dinnerCalories, mealBudget.dinner || Math.round(budget.dailyBudget * 0.3), preferences, goals),
  };
}

/**
 * Generates a single meal with nutrition information
 */
async function generateSingleMeal(
  mealType: string, 
  targetCalories: number,
  budget: number,
  preferences: MealPlanRequest['preferences'],
  goals: MealPlanRequest['goals']
): Promise<Meal> {
  // Get meal options for this meal type based on preferences
  const mealOptions = getMealOptionsByType(mealType, preferences.dietaryRestrictions);
  
  // Select a meal that fits the calorie and budget constraints
  const selectedMeal = selectAppropriateOption(mealOptions, targetCalories, budget, goals.primaryGoal);
  
  // Get nutrition information for the selected meal
  const nutrition = await fetchNutritionInfo(selectedMeal.name);
  
  // Ensure mealType is one of the allowed types
  const validType = mealType as "breakfast" | "lunch" | "snack" | "dinner";
  
  return {
    name: selectedMeal.name,
    type: validType,
    cost: selectedMeal.cost,
    nutrition,
    ingredients: selectedMeal.ingredients,
    instructions: selectedMeal.instructions || ["Heat if necessary", "Enjoy your meal!"]
  };
}

/**
 * Fetches nutrition information from USDA database if available,
 * otherwise uses estimation based on meal components
 */
async function fetchNutritionInfo(mealName: string): Promise<NutritionInfo> {
  try {
    // Try to fetch from USDA database
    const response = await axios.get(`${USDA_API_BASE_URL}/foods/search`, {
      params: {
        api_key: USDA_API_KEY,
        query: mealName,
        dataType: ["Survey (FNDDS)"],
        pageSize: 1
      }
    });
    
    if (response.data?.foods?.length > 0) {
      const food = response.data.foods[0];
      const nutrients = food.foodNutrients;
      
      return {
        calories: getNutrientValue(nutrients, 'Energy') || estimateCalories(mealName),
        protein: getNutrientValue(nutrients, 'Protein') || 0,
        carbs: getNutrientValue(nutrients, 'Carbohydrate, by difference') || 0,
        fat: getNutrientValue(nutrients, 'Total lipid (fat)') || 0,
        fiber: getNutrientValue(nutrients, 'Fiber, total dietary') || 0,
        sugar: getNutrientValue(nutrients, 'Sugars, total including NLEA') || 0
      };
    }
    
    // Fall back to estimation if not found
    return estimateNutrition(mealName);
  } catch (error) {
    console.error('Error fetching nutrition from USDA:', error);
    return estimateNutrition(mealName);
  }
}

/**
 * Helper function to extract nutrient values from USDA API response
 */
function getNutrientValue(nutrients: any[], nutrientName: string): number {
  const nutrient = nutrients.find(n => n.nutrientName.includes(nutrientName));
  return nutrient ? nutrient.value : 0;
}

/**
 * Estimates nutrition when API data is not available
 */
function estimateNutrition(mealName: string): NutritionInfo {
  // Basic nutrition estimation based on meal type and name keywords
  let calories = estimateCalories(mealName);
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let sugar = 0;
  
  // Protein estimation
  if (mealName.match(/chicken|beef|fish|turkey|tofu|egg|protein/i)) {
    protein = Math.round(calories * 0.3 / 4); // 30% of calories from protein (4 cal/g)
  } else {
    protein = Math.round(calories * 0.15 / 4); // 15% of calories from protein
  }
  
  // Carbs estimation
  if (mealName.match(/bread|pasta|rice|potato|grain|cereal|oat/i)) {
    carbs = Math.round(calories * 0.6 / 4); // 60% of calories from carbs (4 cal/g)
    fiber = Math.round(carbs * 0.1); // 10% of carbs as fiber
    sugar = Math.round(carbs * 0.1); // 10% of carbs as sugar
  } else {
    carbs = Math.round(calories * 0.45 / 4); // 45% of calories from carbs
    fiber = Math.round(carbs * 0.08); // 8% of carbs as fiber
    sugar = Math.round(carbs * 0.15); // 15% of carbs as sugar
  }
  
  // Fat estimation (remainder of calories)
  const proteinCalories = protein * 4;
  const carbCalories = carbs * 4;
  fat = Math.round((calories - proteinCalories - carbCalories) / 9); // 9 cal/g for fat
  
  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sugar
  };
}

/**
 * Estimates calories based on meal name and type
 */
function estimateCalories(mealName: string): number {
  // Basic calorie estimation based on meal keywords
  if (mealName.match(/breakfast|morning/i)) {
    return mealName.match(/large|big|hearty/i) ? 600 : 400;
  } else if (mealName.match(/lunch|noon/i)) {
    return mealName.match(/large|big|hearty/i) ? 700 : 500;
  } else if (mealName.match(/dinner|evening/i)) {
    return mealName.match(/large|big|hearty/i) ? 800 : 600;
  } else if (mealName.match(/snack/i)) {
    return 200;
  } else {
    // Default estimation based on common components
    let estimate = 300; // Base calories
    
    if (mealName.match(/chicken|beef|meat/i)) estimate += 200;
    if (mealName.match(/rice|pasta|potato/i)) estimate += 150;
    if (mealName.match(/cheese|cream/i)) estimate += 100;
    if (mealName.match(/salad|vegetable/i)) estimate += 50;
    if (mealName.match(/oil|fried/i)) estimate += 150;
    
    return estimate;
  }
}

/**
 * Calculates total nutrition for a meal plan
 */
function calculateTotalNutrition(meals: {
  breakfast: Meal,
  lunch: Meal,
  snack: Meal,
  dinner: Meal
}): NutritionInfo {
  return {
    calories: Math.round(
      meals.breakfast.nutrition.calories +
      meals.lunch.nutrition.calories +
      meals.snack.nutrition.calories +
      meals.dinner.nutrition.calories
    ),
    protein: Math.round(
      meals.breakfast.nutrition.protein +
      meals.lunch.nutrition.protein +
      meals.snack.nutrition.protein +
      meals.dinner.nutrition.protein
    ),
    carbs: Math.round(
      meals.breakfast.nutrition.carbs +
      meals.lunch.nutrition.carbs +
      meals.snack.nutrition.carbs +
      meals.dinner.nutrition.carbs
    ),
    fat: Math.round(
      meals.breakfast.nutrition.fat +
      meals.lunch.nutrition.fat +
      meals.snack.nutrition.fat +
      meals.dinner.nutrition.fat
    ),
    fiber: Math.round(
      (meals.breakfast.nutrition.fiber || 0) +
      (meals.lunch.nutrition.fiber || 0) +
      (meals.snack.nutrition.fiber || 0) +
      (meals.dinner.nutrition.fiber || 0)
    ),
    sugar: Math.round(
      (meals.breakfast.nutrition.sugar || 0) +
      (meals.lunch.nutrition.sugar || 0) +
      (meals.snack.nutrition.sugar || 0) +
      (meals.dinner.nutrition.sugar || 0)
    )
  };
}

/**
 * Gets meal options based on meal type and dietary restrictions
 */
function getMealOptionsByType(mealType: string, dietaryRestrictions: string) {
  const isVegetarian = dietaryRestrictions.includes('vegetarian');
  const isVegan = dietaryRestrictions.includes('vegan');
  const isGlutenFree = dietaryRestrictions.includes('gluten-free');
  
  // Collection of meal options by type
  const mealOptions: {
    name: string;
    cost: number;
    ingredients: string[];
    instructions?: string[];
  }[] = [];
  
  if (mealType === 'breakfast') {
    if (isVegan) {
      mealOptions.push(
        {
          name: 'Avocado Toast with Fruit',
          cost: 5.50,
          ingredients: ['1 ripe avocado', '2 slices whole grain bread', '1 cup mixed berries', 'Lemon juice', 'Red pepper flakes']
        },
        {
          name: 'Overnight Oats with Almond Milk',
          cost: 3.75,
          ingredients: ['1 cup rolled oats', '1 cup almond milk', '1 tbsp chia seeds', '1 tbsp maple syrup', '1/2 cup mixed berries']
        },
        {
          name: 'Tofu Scramble with Vegetables',
          cost: 4.50,
          ingredients: ['8 oz firm tofu', '1/2 red bell pepper', '1/2 onion', '1 cup spinach', '1/4 tsp turmeric', 'Salt and pepper']
        }
      );
    } else if (isVegetarian) {
      mealOptions.push(
        {
          name: 'Greek Yogurt with Berries and Granola',
          cost: 4.25,
          ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '1/4 cup granola', '1 tbsp honey']
        },
        {
          name: 'Vegetable Omelette with Toast',
          cost: 5.25,
          ingredients: ['2 eggs', '1/4 cup diced bell peppers', '1/4 cup diced onions', '1/4 cup spinach', '2 tbsp shredded cheese', '1 slice whole wheat toast']
        },
        {
          name: 'Cottage Cheese with Fruit and Nuts',
          cost: 3.80,
          ingredients: ['1 cup cottage cheese', '1/2 cup mixed fruit', '1 tbsp chopped almonds', '1 tsp honey']
        }
      );
    } else {
      mealOptions.push(
        {
          name: 'Scrambled Eggs with Turkey Bacon',
          cost: 5.75,
          ingredients: ['2 eggs', '2 slices turkey bacon', '1 slice whole wheat toast', '1/4 avocado']
        },
        {
          name: 'Protein Pancakes with Berries',
          cost: 6.25,
          ingredients: ['1 cup pancake mix', '1 scoop protein powder', '1/2 cup mixed berries', '1 tbsp maple syrup']
        },
        {
          name: 'Breakfast Burrito with Salsa',
          cost: 5.50,
          ingredients: ['1 whole wheat tortilla', '2 eggs', '2 tbsp black beans', '2 tbsp diced bell peppers', '2 tbsp shredded cheese', '2 tbsp salsa']
        }
      );
    }
  } else if (mealType === 'lunch') {
    if (isVegan) {
      mealOptions.push(
        {
          name: 'Quinoa Salad with Roasted Vegetables',
          cost: 6.75,
          ingredients: ['1 cup cooked quinoa', '1 cup mixed roasted vegetables', '1/4 cup chickpeas', '2 tbsp lemon-tahini dressing', 'Fresh herbs']
        },
        {
          name: 'Lentil Soup with Crusty Bread',
          cost: 5.50,
          ingredients: ['1 cup lentil soup', '1 small piece crusty bread', '1 tbsp olive oil', 'Fresh parsley']
        },
        {
          name: 'Veggie Wrap with Hummus',
          cost: 6.25,
          ingredients: ['1 whole wheat wrap', '2 tbsp hummus', '1/4 cup cucumber', '1/4 cup shredded carrots', '1/4 cup roasted red peppers', '1/4 cup mixed greens']
        }
      );
    } else if (isVegetarian) {
      mealOptions.push(
        {
          name: 'Mediterranean Salad with Feta',
          cost: 7.25,
          ingredients: ['2 cups mixed greens', '1/4 cup crumbled feta', '1/4 cup cucumber', '1/4 cup cherry tomatoes', '2 tbsp olives', '2 tbsp balsamic vinaigrette']
        },
        {
          name: 'Caprese Sandwich on Ciabatta',
          cost: 6.50,
          ingredients: ['1 ciabatta roll', '2 slices fresh mozzarella', '2 slices tomato', 'Fresh basil leaves', '1 tbsp balsamic glaze', '1 tsp olive oil']
        },
        {
          name: 'Vegetable Quiche with Side Salad',
          cost: 7.75,
          ingredients: ['1 slice vegetable quiche', '1 cup mixed greens', '2 tbsp vinaigrette', '1/4 cup cherry tomatoes']
        }
      );
    } else {
      mealOptions.push(
        {
          name: 'Grilled Chicken Salad',
          cost: 8.25,
          ingredients: ['4 oz grilled chicken breast', '2 cups mixed greens', '1/4 cup cherry tomatoes', '1/4 cup cucumber', '2 tbsp vinaigrette']
        },
        {
          name: 'Turkey and Avocado Wrap',
          cost: 7.50,
          ingredients: ['1 whole wheat wrap', '3 oz sliced turkey', '1/4 avocado', '1/4 cup mixed greens', '2 slices tomato', '1 tbsp mustard']
        },
        {
          name: 'Tuna Salad on Whole Grain',
          cost: 6.75,
          ingredients: ['3 oz tuna salad', '2 slices whole grain bread', '1 leaf lettuce', '1 slice tomato', '1 cup carrot sticks']
        }
      );
    }
  } else if (mealType === 'snack') {
    if (isVegan) {
      mealOptions.push(
        {
          name: 'Apple with Almond Butter',
          cost: 2.50,
          ingredients: ['1 medium apple', '1 tbsp almond butter']
        },
        {
          name: 'Hummus with Vegetable Sticks',
          cost: 3.25,
          ingredients: ['1/4 cup hummus', '1 cup mixed vegetable sticks (carrots, cucumber, bell peppers)']
        },
        {
          name: 'Trail Mix with Dried Fruit',
          cost: 2.75,
          ingredients: ['1/4 cup mixed nuts', '2 tbsp dried cranberries', '1 tbsp pumpkin seeds']
        }
      );
    } else if (isVegetarian) {
      mealOptions.push(
        {
          name: 'Greek Yogurt with Honey',
          cost: 2.75,
          ingredients: ['1/2 cup Greek yogurt', '1 tsp honey', '1 tbsp chopped nuts']
        },
        {
          name: 'String Cheese with Fruit',
          cost: 2.25,
          ingredients: ['1 string cheese', '1 small apple']
        },
        {
          name: 'Cottage Cheese with Pineapple',
          cost: 2.80,
          ingredients: ['1/2 cup cottage cheese', '1/4 cup pineapple chunks']
        }
      );
    } else {
      mealOptions.push(
        {
          name: 'Beef Jerky with Nuts',
          cost: 3.50,
          ingredients: ['1 oz beef jerky', '1/4 cup mixed nuts']
        },
        {
          name: 'Hard-Boiled Egg with Crackers',
          cost: 2.25,
          ingredients: ['1 hard-boiled egg', '6 whole grain crackers']
        },
        {
          name: 'Protein Bar',
          cost: 3.00,
          ingredients: ['1 protein bar (20g protein)']
        }
      );
    }
  } else if (mealType === 'dinner') {
    if (isVegan) {
      mealOptions.push(
        {
          name: 'Chickpea and Vegetable Curry with Rice',
          cost: 7.50,
          ingredients: ['1 cup chickpeas', '1 cup mixed vegetables', '1/4 cup coconut milk', '1 tbsp curry paste', '1/2 cup brown rice']
        },
        {
          name: 'Lentil Pasta with Tomato Sauce',
          cost: 6.75,
          ingredients: ['1 cup lentil pasta', '1/2 cup tomato sauce', '1 cup sautéed vegetables', '1 tbsp nutritional yeast', 'Fresh basil']
        },
        {
          name: 'Stuffed Bell Peppers with Quinoa',
          cost: 8.25,
          ingredients: ['2 bell peppers', '1 cup cooked quinoa', '1/2 cup black beans', '1/4 cup corn', '1/4 cup diced tomatoes', '1 tsp taco seasoning']
        }
      );
    } else if (isVegetarian) {
      mealOptions.push(
        {
          name: 'Vegetable Lasagna',
          cost: 8.50,
          ingredients: ['1 slice vegetable lasagna', '1 cup side salad', '1 small garlic bread']
        },
        {
          name: 'Eggplant Parmesan with Pasta',
          cost: 9.25,
          ingredients: ['1 serving eggplant parmesan', '1/2 cup pasta', '1/4 cup marinara sauce', 'Fresh basil']
        },
        {
          name: 'Black Bean Enchiladas',
          cost: 7.75,
          ingredients: ['2 corn tortillas', '1/2 cup black beans', '1/4 cup corn', '1/4 cup enchilada sauce', '2 tbsp shredded cheese', '2 tbsp Greek yogurt']
        }
      );
    } else {
      mealOptions.push(
        {
          name: 'Grilled Salmon with Roasted Vegetables',
          cost: 10.50,
          ingredients: ['4 oz salmon fillet', '1 cup roasted mixed vegetables', '1/2 cup quinoa', '1 lemon wedge', 'Fresh herbs']
        },
        {
          name: 'Chicken Stir-Fry with Brown Rice',
          cost: 8.75,
          ingredients: ['4 oz chicken breast', '1 cup stir-fried vegetables', '1/2 cup brown rice', '2 tbsp stir-fry sauce']
        },
        {
          name: 'Beef and Bean Chili',
          cost: 7.50,
          ingredients: ['3 oz ground beef', '1/2 cup kidney beans', '1/4 cup diced tomatoes', '1/4 cup diced bell peppers', '1/4 cup diced onions', '1 tbsp chili seasoning']
        }
      );
    }
  }
  
  // Apply gluten-free filter if needed
  if (isGlutenFree) {
    return mealOptions.filter(meal => 
      !meal.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes('wheat') || 
        ingredient.toLowerCase().includes('bread') ||
        ingredient.toLowerCase().includes('pasta') ||
        ingredient.toLowerCase().includes('tortilla')
      )
    );
  }
  
  return mealOptions;
}

/**
 * Selects the most appropriate meal option based on the target calorie
 * and budget constraints
 */
function selectAppropriateOption(
  options: Array<{name: string, cost: number, ingredients: string[], instructions?: string[]}>,
  targetCalories: number,
  budget: number,
  primaryGoal?: string
) {
  // If no options are available, create a default
  if (options.length === 0) {
    return {
      name: "Simple Balanced Meal",
      cost: budget * 0.8, // 80% of budget
      ingredients: ["Portion of protein", "Portion of vegetables", "Portion of complex carbs"],
      instructions: ["Prepare ingredients as desired", "Combine and enjoy"]
    };
  }
  
  // Filter by budget first
  const affordableOptions = options.filter(option => option.cost <= budget);
  
  // If nothing is affordable, return the cheapest option
  if (affordableOptions.length === 0) {
    options.sort((a, b) => a.cost - b.cost);
    return options[0];
  }
  
  // For each option, estimate calories and find the one closest to target
  const optionsWithCalories = affordableOptions.map(option => ({
    ...option,
    estimatedCalories: estimateCalories(option.name)
  }));
  
  // Sort by how close they are to the target calories
  optionsWithCalories.sort((a, b) => 
    Math.abs(a.estimatedCalories - targetCalories) - 
    Math.abs(b.estimatedCalories - targetCalories)
  );
  
  // Return the best match
  return optionsWithCalories[0];
}