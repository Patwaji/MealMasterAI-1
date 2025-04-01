import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-medium mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold font-heading text-gray-900 mb-4">NutriPlan</h3>
            <p className="text-neutral-dark">Personalized meal planning powered by AI to match your preferences, health goals, and budget.</p>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-neutral-dark hover:text-primary">Home</a></Link></li>
              <li><Link href="/how-it-works"><a className="text-neutral-dark hover:text-primary">How It Works</a></Link></li>
              <li><Link href="/features"><a className="text-neutral-dark hover:text-primary">Features</a></Link></li>
              <li><Link href="/about"><a className="text-neutral-dark hover:text-primary">About Us</a></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/faq"><a className="text-neutral-dark hover:text-primary">FAQs</a></Link></li>
              <li><Link href="/contact"><a className="text-neutral-dark hover:text-primary">Contact Us</a></Link></li>
              <li><Link href="/privacy"><a className="text-neutral-dark hover:text-primary">Privacy Policy</a></Link></li>
              <li><Link href="/terms"><a className="text-neutral-dark hover:text-primary">Terms of Service</a></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-medium mb-4">Get Updates</h4>
            <p className="text-neutral-dark mb-4">Subscribe to our newsletter for tips and new features.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-primary focus:border-primary"
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors duration-200"
              >
                <span className="material-icons text-sm">send</span>
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-medium text-center text-neutral-dark text-sm">
          <p>© {new Date().getFullYear()} NutriPlan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
