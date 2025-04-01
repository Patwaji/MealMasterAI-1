import { useState } from "react";
import { MealCardProps } from "@/types/mealplanner";

const MealCard = ({ meal, icon, iconBgClass, iconColor }: MealCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleDetails = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="meal-card bg-white border border-neutral-medium rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer meal-header flex justify-between items-center"
        onClick={toggleDetails}
      >
        <div className="flex items-center">
          <div className={`${iconBgClass} rounded-full w-10 h-10 flex items-center justify-center mr-3`}>
            <span className={`material-icons ${iconColor}`}>{icon}</span>
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
      <div className={`meal-details border-t border-neutral-medium ${expanded ? "expanded max-h-[500px]" : "max-h-0"}`}>
        <div className="p-4">
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
        </div>
      </div>
    </div>
  );
};

export default MealCard;
