import { Link } from "wouter";

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Large Logo at the top */}
      <div className="text-center mb-10">
        <div className="inline-block mb-6">
          <div className="flex items-center justify-center">
            <span className="material-icons text-primary text-5xl mr-2">eco</span>
            <span className="text-5xl font-extrabold text-primary-dark">Nutri<span className="text-primary">Plan</span></span>
          </div>
          <div className="text-sm text-neutral-dark mt-1">AI-Powered Meal Planning</div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-4">How It Works</h1>
        <p className="text-neutral-dark max-w-3xl mx-auto text-lg">
          NutriPlan makes personalized meal planning simple. Here's how our AI-powered system creates the perfect meal plan for you.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center shadow-lg">
              <span className="material-icons text-primary text-6xl">restaurant</span>
            </div>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <div className="flex items-center mb-2">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 text-lg shadow-md">1</span>
              <h2 className="text-2xl font-semibold">Enter Your Food Preferences</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Tell us about your preferred cuisines, dietary restrictions, and ingredients you'd like to avoid. Our system will ensure your meal plan only includes foods you enjoy.
            </p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Select from various cuisine types</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Specify dietary restrictions like vegetarian, vegan, or gluten-free</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>List ingredients you dislike or are allergic to</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center md:order-2">
            <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center shadow-lg">
              <span className="material-icons text-primary text-6xl">fitness_center</span>
            </div>
          </div>
          <div className="md:w-2/3 md:pr-8 md:order-1">
            <div className="flex items-center mb-2">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 text-lg shadow-md">2</span>
              <h2 className="text-2xl font-semibold">Define Your Health Goals</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Whether you're looking to lose weight, build muscle, or maintain your current fitness level, we'll optimize your meal plan to support your health objectives.
            </p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Choose your primary goal (weight loss, muscle gain, maintenance)</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Set your target daily calorie intake</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Indicate any specific health conditions that should be considered</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center shadow-lg">
              <span className="material-icons text-primary text-6xl">account_balance_wallet</span>
            </div>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <div className="flex items-center mb-2">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 text-lg shadow-md">3</span>
              <h2 className="text-2xl font-semibold">Set Your Budget</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Eating well doesn't have to break the bank. Tell us your daily food budget, and we'll create a meal plan that's both nutritious and affordable.
            </p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Specify your maximum daily budget</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Adjust budget distribution across meals if desired</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Choose your budget priority (strict, balanced, or nutrition-first)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row items-center mb-16">
          <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center md:order-2">
            <div className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center shadow-lg">
              <span className="material-icons text-primary text-6xl">magic_button</span>
            </div>
          </div>
          <div className="md:w-2/3 md:pr-8 md:order-1">
            <div className="flex items-center mb-2">
              <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 text-lg shadow-md">4</span>
              <h2 className="text-2xl font-semibold">Generate Your Meal Plan</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our AI algorithm processes your inputs and generates a personalized daily meal plan, complete with breakfast, lunch, snack, and dinner options.
            </p>
            <ul className="space-y-1 text-gray-600">
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>Receive meal suggestions based on your criteria</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>View detailed nutritional information for each meal</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons list-icon">arrow_right</span>
                <span>See ingredient lists and estimated costs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final step */}
        <div className="bg-neutral-lightest border border-neutral-medium rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Creating your personalized meal plan takes just a few minutes. Try NutriPlan today and take the stress out of meal planning.
          </p>
          <Link href="/meal-planner">
            <a className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200 inline-block">
              Create Your Meal Plan Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
