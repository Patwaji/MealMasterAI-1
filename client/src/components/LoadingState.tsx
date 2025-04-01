import { FormState } from "@/types/mealplanner";
import AIThinkingIndicator from "./AIThinkingIndicator";
import { useState, useEffect } from "react";

interface LoadingStateProps {
  state?: FormState;
}

const LoadingState = ({ state }: LoadingStateProps) => {
  const [progress, setProgress] = useState(0);
  
  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3;
      });
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  // If AI thinking is active, show the AI thinking indicator
  if (state?.aiThinking) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <AIThinkingIndicator stage={state.aiThinkingStage || "Processing..."} progress={progress} />
      </div>
    );
  }

  // Otherwise show the default loading state
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">Generating Your Meal Plan</h2>
      <p className="text-neutral-dark text-center">Our AI is creating personalized meals based on your preferences...</p>
    </div>
  );
};

export default LoadingState;
