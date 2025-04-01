import { Link, useLocation } from "wouter";

const Navbar = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary-dark text-xl font-bold font-heading cursor-pointer">NutriPlan</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                <Link href="/">
                  <a className={`${isActive('/') ? 'text-primary' : 'text-neutral-dark hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium`}>Home</a>
                </Link>
                <Link href="/how-it-works">
                  <a className={`${isActive('/how-it-works') ? 'text-primary' : 'text-neutral-dark hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium`}>How It Works</a>
                </Link>
                <Link href="/meal-planner">
                  <a className={`${isActive('/meal-planner') ? 'bg-primary text-white' : 'text-neutral-dark hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium`}>Meal Planner</a>
                </Link>
                <Link href="/features">
                  <a className={`${isActive('/features') ? 'text-primary' : 'text-neutral-dark hover:text-primary'} px-3 py-2 rounded-md text-sm font-medium`}>Features</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">Sign Up</button>
          </div>
          <div className="flex items-center sm:hidden">
            <button type="button" className="text-gray-500 hover:text-primary focus:outline-none">
              <span className="material-icons">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
