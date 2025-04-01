import React from 'react';
import { Progress } from '@/components/ui/progress';

interface AIThinkingIndicatorProps {
  stage: string;
  progress: number;
}

const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ stage, progress }) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="animate-pulse mr-3 h-4 w-4 rounded-full bg-green-500 opacity-75"></div>
        <h3 className="text-lg font-medium text-green-700">AI Working</h3>
      </div>
      
      <div className="bg-white border-2 border-green-100 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">Creating Your Personalized Meal Plan</h4>
          <p className="text-sm text-gray-600 mb-2">
            Our AI is analyzing your preferences, health goals, and budget to create a tailored meal plan.
          </p>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">{stage}</span>
            <span className="text-sm font-medium text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-green-100" />
        </div>
        
        <div className="bg-green-50 rounded-md p-3 border border-green-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-green-600" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                The AI is considering numerous factors including nutrient balance, flavor combinations, ingredient availability, and your personal preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIThinkingIndicator;