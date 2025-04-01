import { SummaryCardProps } from "@/types/mealplanner";

const SummaryCard = ({ mealPlan }: SummaryCardProps) => {
  // Calculate macronutrient percentages
  const totalCalories = mealPlan.totalNutrition.calories;
  const proteinCalories = mealPlan.totalNutrition.protein * 4;
  const carbCalories = mealPlan.totalNutrition.carbs * 4;
  const fatCalories = mealPlan.totalNutrition.fat * 9;
  
  const proteinPercentage = Math.round((proteinCalories / totalCalories) * 100);
  const carbPercentage = Math.round((carbCalories / totalCalories) * 100);
  const fatPercentage = Math.round((fatCalories / totalCalories) * 100);

  return (
    <div className="bg-neutral-lightest border border-neutral-medium rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Daily Budget: <span className="font-medium text-gray-800">₹{mealPlan.totalCost.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            Total Cost: <span className="font-semibold text-gray-800">₹{mealPlan.totalCost.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
