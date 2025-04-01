import React from 'react';
import { AIInsight } from '@/types/mealplanner';

interface AIInsightPanelProps {
  insights: AIInsight[];
  title?: string;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ 
  insights, 
  title = "AI Nutritional Insights" 
}) => {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 rounded-lg border border-green-100 p-4 mt-4">
      <div className="flex items-center mb-3">
        <svg 
          className="h-5 w-5 text-green-600 mr-2"
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
        <h4 className="text-sm font-medium text-green-800">{title}</h4>
      </div>
      
      <ul className="space-y-1 text-sm text-green-700">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block mr-2 mt-0.5">•</span>
            <span>{typeof insight === 'string' ? insight : insight.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsightPanel;