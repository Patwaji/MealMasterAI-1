const Features = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-4">Features</h1>
        <p className="text-neutral-dark max-w-3xl mx-auto text-lg">
          Discover all the powerful features that make NutriPlan the perfect meal planning assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="bg-primary-light text-primary rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <span className="material-icons text-2xl">restaurant</span>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Personalization</h2>
          <p className="text-gray-600 mb-4">
            Create meal plans tailored to your unique preferences, dietary restrictions, and specific health conditions.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Multiple cuisine options (Italian, Asian, Mexican, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Support for dietary restrictions (vegetarian, vegan, gluten-free, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Exclude ingredients you dislike or are allergic to</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="bg-primary-light text-primary rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <span className="material-icons text-2xl">fitness_center</span>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Health Goal Alignment</h2>
          <p className="text-gray-600 mb-4">
            Optimize your meal plans to match your specific health and fitness objectives.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Weight loss, muscle gain, or maintenance plans</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Customizable daily calorie targets</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Specific health condition support (diabetes-friendly, heart-healthy, etc.)</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="bg-primary-light text-primary rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <span className="material-icons text-2xl">account_balance_wallet</span>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Budget Control</h2>
          <p className="text-gray-600 mb-4">
            Stay within your food budget while still eating nutritious, delicious meals.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Adjustable daily budget setting</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Meal-by-meal budget distribution</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Flexible budget priorities to balance cost and nutrition</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="bg-primary-light text-primary rounded-full w-14 h-14 flex items-center justify-center mb-4">
            <span className="material-icons text-2xl">query_stats</span>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Nutritional Insights</h2>
          <p className="text-gray-600 mb-4">
            Get detailed nutritional information for every meal in your plan.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Calorie count for each meal and daily total</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Macronutrient breakdown (protein, carbs, fats)</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2 text-sm mt-1">check_circle</span>
              <span>Additional nutritional metrics like fiber and sugar content</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-neutral-lightest border border-neutral-medium rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to experience these features?</h2>
        <p className="text-gray-600 mb-6">
          Start creating your personalized meal plans today and see the difference.
        </p>
        <a 
          href="/meal-planner" 
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200 inline-block"
        >
          Create Your Meal Plan
        </a>
      </div>
    </div>
  );
};

export default Features;
