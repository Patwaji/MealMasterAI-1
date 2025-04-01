import { useState } from "react";
import { MealCardProps, AIInsight } from "@/types/mealplanner";

const MealCard = ({ meal, icon, iconBgClass, iconColor, insights = [] }: MealCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Filter insights specific to this meal type (if the insight is an object with mealType)
  const mealInsights = insights.filter(insight => 
    typeof insight === 'string' || 
    insight.mealType === meal.type || 
    !insight.mealType || 
    insight.mealType === 'overall'
  );

  // Check if we have high priority insights
  const hasImportantInsights = mealInsights.some(insight => 
    typeof insight !== 'string' && (insight.priority || 0) >= 2
  );

  const toggleDetails = () => {
    setExpanded(!expanded);
  };

  // Helper to get icon for insight type 
  const getInsightIcon = (insight: AIInsight) => {
    if (typeof insight === 'string') {
      return 'info';
    }
    
    switch (insight.type) {
      case 'suggestion': return 'lightbulb';
      case 'analysis': return 'analytics';
      case 'health_tip': return 'healing';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className="meal-card bg-white border border-neutral-medium rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer meal-header flex justify-between items-center"
        onClick={toggleDetails}
      >
        <div className="flex items-center">
          <div className={`${iconBgClass} rounded-full w-10 h-10 flex items-center justify-center mr-3 relative`}>
            <span className={`material-icons ${iconColor}`}>{icon}</span>
            {hasImportantInsights && (
              <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs border border-white">
                <span className="material-icons text-[12px]">psychology</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg">{meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}</h3>
            <p className="text-neutral-dark">{meal.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-4">
            <p className="font-medium">${meal.cost.toFixed(2)}</p>
            <p className="text-sm text-neutral-dark">{meal.nutrition.calories} kcal</p>
          </div>
          <span 
            className={`material-icons transform transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </div>
      </div>
      <div className={`meal-details border-t border-neutral-medium ${expanded ? "expanded max-h-[800px]" : "max-h-0"}`}>
        <div className="p-4">
          {/* AI Insights Section */}
          {mealInsights.length > 0 && (
            <div className="mb-4 bg-green-50 border border-green-100 rounded-md p-3">
              <div className="flex items-center mb-2">
                <span className="material-icons text-green-600 mr-2">psychology</span>
                <h4 className="font-medium text-green-800">AI Insights</h4>
              </div>
              <div className="space-y-2">
                {mealInsights.map((insight, idx) => (
                  <div key={idx} className="flex bg-white p-2 rounded border border-green-100">
                    <span className="material-icons text-green-500 mr-2 mt-0.5">
                      {getInsightIcon(insight)}
                    </span>
                    <div>
                      {typeof insight === 'string' ? (
                        <p className="text-sm">{insight}</p>
                      ) : (
                        <>
                          <p className="text-sm">{insight.text}</p>
                          {insight.recommendation && (
                            <p className="text-xs mt-1 text-green-700 italic">
                              Recommendation: {insight.recommendation}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <h4 className="font-medium mb-2">Nutrition Facts</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-neutral-dark">Calories</p>
                  <p className="font-medium">{meal.nutrition.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Protein</p>
                  <p className="font-medium">{meal.nutrition.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Carbs</p>
                  <p className="font-medium">{meal.nutrition.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-dark">Fat</p>
                  <p className="font-medium">{meal.nutrition.fat}g</p>
                </div>
                {meal.nutrition.fiber && (
                  <div>
                    <p className="text-sm text-neutral-dark">Fiber</p>
                    <p className="font-medium">{meal.nutrition.fiber}g</p>
                  </div>
                )}
                {meal.nutrition.sugar && (
                  <div>
                    <p className="text-sm text-neutral-dark">Sugar</p>
                    <p className="font-medium">{meal.nutrition.sugar}g</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ingredients</h4>
              <ul className="text-sm space-y-1">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-light">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-green-700 text-sm">
                <span className="material-icons text-sm mr-1">verified</span>
                AI-optimized meal selection
              </div>
              <button className="text-sm flex items-center text-blue-600 hover:text-blue-800">
                <span className="material-icons text-sm mr-1">shuffle</span>
                Suggest alternatives
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
