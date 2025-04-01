import { SummaryCardProps, AIInsight } from "@/types/mealplanner";
import AIInsightPanel from "./AIInsightPanel";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const SummaryCard = ({ mealPlan, aiAnalysis }: SummaryCardProps) => {
  const [showAIDetails, setShowAIDetails] = useState(false);
  
  // Calculate macronutrient percentages
  const totalCalories = mealPlan.totalNutrition.calories;
  const proteinCalories = mealPlan.totalNutrition.protein * 4;
  const carbCalories = mealPlan.totalNutrition.carbs * 4;
  const fatCalories = mealPlan.totalNutrition.fat * 9;
  
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100);
  const carbPercentage = Math.round((carbCalories / totalCalories) * 100);
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100);

  // Generate AI analysis based on macronutrients if not provided
  const analysis = aiAnalysis || generateAIAnalysis(mealPlan, proteinPercentage, carbPercentage, fatPercentage);

  return (
    <div className="bg-neutral-lightest border border-neutral-medium rounded-lg mb-6 overflow-hidden">
      <div className="p-4">
        {/* AI Banner at the top */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 -mx-4 -mt-4 mb-4 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2 border border-green-200">
              <span className="material-icons text-green-700 text-base">smart_toy</span>
            </div>
            <div>
              <h3 className="font-medium text-green-900">NutriPlanAI Analysis</h3>
              <p className="text-xs text-green-700">AI-powered nutritional insights for your meal plan</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAIDetails(!showAIDetails)}
            className="text-xs bg-white px-2 py-1 rounded border border-green-200 text-green-700 hover:bg-green-50 transition-colors flex items-center"
          >
            {showAIDetails ? (
              <>
                <span className="material-icons text-xs mr-1">visibility_off</span>
                Hide Details
              </>
            ) : (
              <>
                <span className="material-icons text-xs mr-1">visibility</span>
                Show Details
              </>
            )}
          </button>
        </div>
        
        {/* AI Quick Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="border rounded-lg p-3 bg-white">
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <span className="material-icons text-green-600 text-xs mr-1">spa</span>
              <span>Nutrition Score</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">{analysis.nutritionScore}/100</div>
              <div className="w-20">
                <Progress value={analysis.nutritionScore} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3 bg-white">
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <span className="material-icons text-blue-600 text-xs mr-1">balance</span>
              <span>Balance Score</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">{analysis.balanceScore}/100</div>
              <div className="w-20">
                <Progress value={analysis.balanceScore} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3 bg-white">
            <div className="flex items-center text-xs text-gray-600 mb-1">
              <span className="material-icons text-purple-600 text-xs mr-1">diversity_3</span>
              <span>Variety Score</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800">{analysis.varietyScore}/100</div>
              <div className="w-20">
                <Progress value={analysis.varietyScore} className="h-2" />
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Main Message */}
        <div className="bg-white border rounded-lg p-3 mb-4">
          <p className="italic text-gray-700">"{analysis.personalizedMessage}"</p>
          <div className="mt-2 flex items-center">
            <span className="material-icons text-green-600 text-sm mr-1">recommend</span>
            <p className="text-sm font-medium text-green-800">{analysis.mainRecommendation}</p>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            - NutriPlanAI {analysis.aiVersion}
          </div>
        </div>
      
        {/* Expanded AI Details */}
        {showAIDetails && (
          <div className="mt-4 mb-4 animate-fade-down animate-duration-300">
            <AIInsightPanel insights={analysis.insights} />
          </div>
        )}
      
        {/* Nutrition Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-neutral-dark mb-1">Total Calories</p>
            <p className="text-xl font-semibold text-gray-800">
              {totalCalories.toLocaleString()} kcal
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-dark mb-1">Protein</p>
            <p className="text-xl font-semibold text-gray-800">
              {mealPlan.totalNutrition.protein}g <span className="text-sm font-normal">({proteinPercentage}%)</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-dark mb-1">Carbs</p>
            <p className="text-xl font-semibold text-gray-800">
              {mealPlan.totalNutrition.carbs}g <span className="text-sm font-normal">({carbPercentage}%)</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-dark mb-1">Fat</p>
            <p className="text-xl font-semibold text-gray-800">
              {mealPlan.totalNutrition.fat}g <span className="text-sm font-normal">({fatPercentage}%)</span>
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-medium">
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-dark">
              Daily Budget: <span className="font-medium text-gray-800">${mealPlan.totalCost.toFixed(2)}</span>
            </p>
            <p className="text-sm">
              Total Cost: <span className="font-semibold text-gray-800">${mealPlan.totalCost.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Function to generate AI analysis for demonstration
function generateAIAnalysis(mealPlan: any, protein: number, carbs: number, fat: number) {
  // Nutrition score based on balanced macros and sufficient calories
  const isBalancedMacros = protein >= 20 && protein <= 35 && carbs >= 45 && carbs <= 65 && fat >= 20 && fat <= 35;
  const calorieSufficiency = mealPlan.totalNutrition.calories >= 1800 && mealPlan.totalNutrition.calories <= 2500;
  
  const nutritionScore = Math.min(100, Math.max(50, 
    (isBalancedMacros ? 40 : 20) + 
    (calorieSufficiency ? 30 : 15) + 
    (mealPlan.totalNutrition.fiber > 25 ? 15 : 8) + 
    (mealPlan.totalNutrition.sugar < 50 ? 15 : 7)
  ));
  
  // Balance score - how well macros align with recommended distributions
  const proteinBalance = 100 - Math.abs(protein - 25) * 2;
  const carbBalance = 100 - Math.abs(carbs - 55) * 1.5;
  const fatBalance = 100 - Math.abs(fat - 30) * 2;
  const balanceScore = Math.round((proteinBalance + carbBalance + fatBalance) / 3);
  
  // Variety score based on different meal types
  const mealDiversity = new Set([
    mealPlan.breakfast.name.split(' ')[0],
    mealPlan.lunch.name.split(' ')[0],
    mealPlan.dinner.name.split(' ')[0],
    mealPlan.snack.name.split(' ')[0],
  ]).size;
  
  const varietyScore = Math.min(100, Math.round(mealDiversity * 25 + 
    (mealPlan.breakfast.ingredients.length + mealPlan.lunch.ingredients.length + 
     mealPlan.dinner.ingredients.length + mealPlan.snack.ingredients.length) / 2));
  
  // Create insights
  const insights: AIInsight[] = [];
  
  // Protein insights
  if (protein < 20) {
    insights.push({
      type: 'analysis',
      text: 'Your meal plan is low in protein, which may not adequately support muscle maintenance and recovery.',
      priority: 3,
      relatedNutrient: 'protein',
      recommendation: 'Consider adding more protein-rich foods like chicken, fish, tofu, or legumes to your meals.'
    });
  } else if (protein > 35) {
    insights.push({
      type: 'info',
      text: 'Your meal plan has a high protein content, which may be beneficial for muscle building but could stress kidneys in some individuals.',
      priority: 2,
      relatedNutrient: 'protein'
    });
  } else {
    insights.push({
      type: 'health_tip',
      text: 'Your protein intake is well-balanced, supporting muscle health and providing satiety to help maintain energy levels throughout the day.',
      priority: 1,
      relatedNutrient: 'protein'
    });
  }
  
  // Carbs insights
  if (carbs < 45) {
    insights.push({
      type: 'analysis',
      text: 'Your carbohydrate intake is on the lower side, which might limit readily available energy for high-intensity activities.',
      priority: 2,
      relatedNutrient: 'carbs',
      recommendation: 'For sustained energy, consider adding more complex carbohydrates like whole grains, fruits, or starchy vegetables.'
    });
  } else if (carbs > 65) {
    insights.push({
      type: 'analysis',
      text: 'Your meal plan is high in carbohydrates, which may cause energy fluctuations for some individuals.',
      priority: 2,
      relatedNutrient: 'carbs',
      recommendation: 'Consider balancing with more protein and healthy fats to stabilize energy levels.'
    });
  }
  
  // Fiber insights
  if (mealPlan.totalNutrition.fiber < 25) {
    insights.push({
      type: 'suggestion',
      text: 'Your meal plan could benefit from more fiber to support digestive health and sustained energy.',
      priority: 3,
      relatedNutrient: 'fiber',
      recommendation: 'Add more vegetables, fruits, legumes, or whole grains to increase your fiber intake.'
    });
  } else {
    insights.push({
      type: 'health_tip',
      text: 'Your fiber intake is excellent, supporting gut health and helping regulate blood sugar levels.',
      priority: 1,
      relatedNutrient: 'fiber'
    });
  }
  
  // Budget insights
  if (mealPlan.totalCost > 25) {
    insights.push({
      type: 'suggestion',
      text: 'This meal plan is on the higher end of your budget. There may be opportunities to reduce costs while maintaining nutrition.',
      priority: 2,
      recommendation: 'Consider seasonal produce and bulk protein options to reduce costs.'
    });
  } else {
    insights.push({
      type: 'info',
      text: 'This meal plan is cost-effective while still providing excellent nutritional value.',
      priority: 1
    });
  }
  
  // Meal-specific insights
  if (mealPlan.breakfast.nutrition.sugar > 15) {
    insights.push({
      type: 'suggestion',
      text: 'Your breakfast contains a relatively high amount of sugar, which may cause mid-morning energy crashes.',
      priority: 2,
      mealType: 'breakfast',
      relatedNutrient: 'sugar',
      recommendation: 'Consider lower-sugar breakfast options with more protein to sustain energy longer.'
    });
  }
  
  // Generate personalized message
  let personalizedMessage = '';
  if (nutritionScore >= 80) {
    personalizedMessage = "This meal plan is exceptionally well-balanced, providing optimal nutrition while respecting your preferences and constraints.";
  } else if (nutritionScore >= 60) {
    personalizedMessage = "Your meal plan provides good nutrition overall, with a few opportunities for enhancement to better support your health goals.";
  } else {
    personalizedMessage = "While this meal plan accommodates your preferences, there are several ways it could be nutritionally improved to better support your health.";
  }
  
  // Generate main recommendation
  let mainRecommendation = '';
  if (protein < 20) {
    mainRecommendation = "Increase protein intake to better support muscle health and metabolism";
  } else if (mealPlan.totalNutrition.fiber < 25) {
    mainRecommendation = "Add more fiber-rich foods for improved digestive health and sustained energy";
  } else if (mealPlan.totalNutrition.sugar > 50) {
    mainRecommendation = "Reduce added sugars to improve metabolic health and energy stability";
  } else {
    mainRecommendation = "Maintain this well-balanced approach to nutrition for optimal health";
  }
  
  return {
    insights,
    nutritionScore,
    balanceScore,
    varietyScore,
    personalizedMessage,
    mainRecommendation,
    aiVersion: "2.0.0"
  };
}

export default SummaryCard;
