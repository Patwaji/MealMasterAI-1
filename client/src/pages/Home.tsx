import { Link } from "wouter";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              AI-Powered Meal Planning <br /> Tailored to <span className="text-primary">You</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate personalized meal plans that match your dietary preferences, health goals, and budget constraints - all in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/meal-planner">
                <a className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200">
                  Create Your Meal Plan
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="border border-gray-300 hover:border-primary text-gray-800 hover:text-primary px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200">
                  Learn More
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center text-gray-900 mb-12">Why Choose NutriPlan?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-lightest p-6 rounded-lg">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">restaurant_menu</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Plans</h3>
              <p className="text-gray-600">Tailor your meal plans to your dietary needs, preferences, and health goals.</p>
            </div>
            
            <div className="bg-neutral-lightest p-6 rounded-lg">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">attach_money</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Budget Friendly</h3>
              <p className="text-gray-600">Set your daily or per-meal budget and get plans that respect your financial constraints.</p>
            </div>
            
            <div className="bg-neutral-lightest p-6 rounded-lg">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">health_and_safety</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Nutritionally Balanced</h3>
              <p className="text-gray-600">Get detailed nutritional information for each meal and ensure you're meeting your health goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary bg-opacity-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">Ready to transform your meal planning?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Stop stressing about what to eat and start enjoying personalized meal plans that fit your lifestyle.
          </p>
          <Link href="/meal-planner">
            <a className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200 inline-block">
              Get Started For Free
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
