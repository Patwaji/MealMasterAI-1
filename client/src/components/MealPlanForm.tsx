import { useReducer, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FormStep, FormState, AIAnalysisReport, AIInsight } from "@/types/mealplanner";
import { MealPlan, MealPlanRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useSavedMealPlans } from "@/hooks/useSavedMealPlans";
import StepProgressIndicator from "./StepProgressIndicator";
import LoadingState from "./LoadingState";
import SummaryCard from "./SummaryCard";
import MealCard from "./MealCard";
import AIThinkingIndicator from "./AIThinkingIndicator";

// Initial form state
const initialState: FormState = {
  step: FormStep.Preferences,
  isLoading: false,
  aiThinking: false,
  aiThinkingStage: '',
  aiAnalysis: {
    insights: [],
    nutritionScore: 85,
    balanceScore: 82,
    varietyScore: 78,
    personalizedMessage: "Your meal plan has been optimized for your goals!",
    mainRecommendation: "Consider adding more leafy greens to increase micronutrient intake.",
    aiVersion: "NutriAI 2.3"
  },
  preferences: {
    cuisineType: "any",
    dietaryRestrictions: "none",
    dislikedIngredients: ""
  },
  goals: {
    primaryGoal: "maintenance",
    calorieTarget: 2000,
    healthConditions: "none"
  },
  budget: {
    dailyBudget: 25,
    budgetPriority: "balanced",
    mealBudget: {
      breakfast: 6,
      lunch: 8,
      snack: 3,
      dinner: 8
    }
  },
  mealPlan: null
};

// Reducer function to handle form state updates
type FormAction = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP', payload: FormStep }
  | { type: 'UPDATE_PREFERENCES', payload: Partial<FormState['preferences']> }
  | { type: 'UPDATE_GOALS', payload: Partial<FormState['goals']> }
  | { type: 'UPDATE_BUDGET', payload: Partial<FormState['budget']> }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_MEAL_PLAN', payload: MealPlan }
  | { type: 'RESET_FORM' }
  | { type: 'SET_AI_THINKING', payload: boolean }
  | { type: 'SET_AI_THINKING_STAGE', payload: string }
  | { type: 'SET_AI_ANALYSIS', payload: AIAnalysisReport };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        step: Math.min(state.step + 1, FormStep.Results) as FormStep
      };
    case 'PREV_STEP':
      return {
        ...state,
        step: Math.max(state.step - 1, FormStep.Preferences) as FormStep
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        step: action.payload
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
    case 'UPDATE_GOALS':
      return {
        ...state,
        goals: {
          ...state.goals,
          ...action.payload
        }
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budget: {
          ...state.budget,
          ...action.payload
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_MEAL_PLAN':
      return {
        ...state,
        mealPlan: action.payload,
        isLoading: false,
        aiThinking: false // Reset AI thinking state when meal plan is set
      };
    case 'SET_AI_THINKING':
      return {
        ...state,
        aiThinking: action.payload
      };
    case 'SET_AI_THINKING_STAGE':
      return {
        ...state,
        aiThinkingStage: action.payload
      };
    case 'SET_AI_ANALYSIS':
      return {
        ...state,
        aiAnalysis: action.payload
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        step: FormStep.Preferences
      };
    default:
      return state;
  }
}

const MealPlanForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { toast } = useToast();

  const generateMealPlan = useMutation({
    mutationFn: async () => {
      const payload: MealPlanRequest = {
        preferences: state.preferences,
        goals: state.goals,
        budget: state.budget
      };
      const res = await apiRequest('POST', '/api/meal-plan', payload);
      const data = await res.json();
      return data as MealPlan;
    },
    onSuccess: (data) => {
      dispatch({ type: 'SET_MEAL_PLAN', payload: data });
      dispatch({ type: 'GO_TO_STEP', payload: FormStep.Results });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate meal plan: ${error.message}`,
        variant: "destructive"
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  });

  // AI thinking stages for simulating the AI thought process
  const thinkingStages = [
    'Analyzing your dietary preferences...',
    'Calculating nutritional requirements based on your goals...',
    'Evaluating meal options within your budget constraints...',
    'Balancing macronutrients for optimal health...',
    'Considering ingredient variety and combinations...',
    'Optimizing meal timings and composition...',
    'Finalizing personalized meal recommendations...',
    'Generating AI nutritional insights...'
  ];

  // Simulate AI thinking with staged progress
  const simulateAIThinking = async () => {
    dispatch({ type: 'SET_AI_THINKING', payload: true });
    
    // Simulate AI thinking stages
    for (let i = 0; i < thinkingStages.length; i++) {
      dispatch({ type: 'SET_AI_THINKING_STAGE', payload: thinkingStages[i] });
      
      // Wait for a bit at each stage to simulate thinking
      await new Promise(resolve => setTimeout(resolve, 1200));
    }
    
    // Generate the actual meal plan
    generateMealPlan.mutate();
  };

  const handleGeneratePlan = () => {
    // Initialize loading and AI thinking
    dispatch({ type: 'SET_LOADING', payload: true });
    simulateAIThinking();
  };

  const handleRegeneratePlan = () => {
    // Initialize loading and AI thinking
    dispatch({ type: 'SET_LOADING', payload: true });
    simulateAIThinking();
  };

  // Render steps
  const renderStepContent = () => {
    if (state.isLoading) {
      return <LoadingState state={state} />;
    }

    switch (state.step) {
      case FormStep.Preferences:
        return <PreferencesStep state={state} dispatch={dispatch} />;
      case FormStep.Goals:
        return <GoalsStep state={state} dispatch={dispatch} />;
      case FormStep.Budget:
        return <BudgetStep state={state} dispatch={dispatch} onSubmit={handleGeneratePlan} />;
      case FormStep.Results:
        return state.mealPlan ? (
          <ResultsStep 
            mealPlan={state.mealPlan} 
            aiAnalysis={state.aiAnalysis}
            onRegenerate={handleRegeneratePlan} 
            onStartOver={() => dispatch({ type: 'RESET_FORM' })} 
          />
        ) : null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-4">Your Personalized Meal Planner</h1>
        <p className="text-neutral-dark max-w-3xl mx-auto text-lg">
          Generate a customized daily meal plan based on your dietary preferences, health goals, and budget.
        </p>
      </div>
      
      <StepProgressIndicator currentStep={state.step} />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

// Step 1: Food Preferences
const PreferencesStep = ({ state, dispatch }: { state: FormState, dispatch: React.Dispatch<FormAction> }) => {
  return (
    <div id="step1" className="step-container active">
      <h2 className="text-2xl font-heading font-semibold mb-6">Food Preferences</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="cuisine-type">
            Cuisine Type
          </label>
          <select 
            id="cuisine-type" 
            name="cuisine-type" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={state.preferences.cuisineType}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_PREFERENCES', 
              payload: { cuisineType: e.target.value as any }
            })}
          >
            <option value="">Select cuisine...</option>
            <option value="italian">Italian</option>
            <option value="asian">Asian</option>
            <option value="mexican">Mexican</option>
            <option value="american">American</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="indian">Indian</option>
            <option value="any">Any (no preference)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dietary-restrictions">
            Dietary Restrictions
          </label>
          <select 
            id="dietary-restrictions" 
            name="dietary-restrictions" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={state.preferences.dietaryRestrictions}
            onChange={(e) => dispatch({ 
              type: 'UPDATE_PREFERENCES', 
              payload: { dietaryRestrictions: e.target.value as any }
            })}
          >
            <option value="">Select restriction...</option>
            <option value="none">None</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="dairy-free">Dairy-Free</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="disliked-ingredients">
          Disliked Ingredients (separate with commas)
        </label>
        <input 
          type="text" 
          id="disliked-ingredients" 
          name="disliked-ingredients" 
          placeholder="e.g., mushrooms, olives, seafood" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          value={state.preferences.dislikedIngredients || ''}
          onChange={(e) => dispatch({ 
            type: 'UPDATE_PREFERENCES', 
            payload: { dislikedIngredients: e.target.value }
          })}
        />
      </div>
      
      <div className="flex justify-end">
        <button 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
        >
          Next
          <span className="material-icons ml-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

// Step 2: Health Goals
const GoalsStep = ({ state, dispatch }: { state: FormState, dispatch: React.Dispatch<FormAction> }) => {
  return (
    <div id="step2" className="step-container">
      <h2 className="text-2xl font-heading font-semibold mb-6">Health Goals</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Goal
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors duration-200 goal-option ${
              state.goals.primaryGoal === 'weight-loss' ? 'border-primary bg-primary-light bg-opacity-10' : ''
            }`}
            onClick={() => dispatch({ 
              type: 'UPDATE_GOALS', 
              payload: { primaryGoal: 'weight-loss' }
            })}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Weight Loss</span>
              <span className="material-icons text-neutral-dark">fitness_center</span>
            </div>
            <p className="text-sm text-neutral-dark">Lower calorie meals with balanced macros</p>
          </div>
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors duration-200 goal-option ${
              state.goals.primaryGoal === 'muscle-gain' ? 'border-primary bg-primary-light bg-opacity-10' : ''
            }`}
            onClick={() => dispatch({ 
              type: 'UPDATE_GOALS', 
              payload: { primaryGoal: 'muscle-gain' }
            })}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Muscle Gain</span>
              <span className="material-icons text-neutral-dark">fitness_center</span>
            </div>
            <p className="text-sm text-neutral-dark">Higher protein and calorie content</p>
          </div>
          <div 
            className={`border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors duration-200 goal-option ${
              state.goals.primaryGoal === 'maintenance' ? 'border-primary bg-primary-light bg-opacity-10' : ''
            }`}
            onClick={() => dispatch({ 
              type: 'UPDATE_GOALS', 
              payload: { primaryGoal: 'maintenance' }
            })}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Maintenance</span>
              <span className="material-icons text-neutral-dark">balance</span>
            </div>
            <p className="text-sm text-neutral-dark">Balanced nutrients at maintenance calories</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Calorie Target (optional)
        </label>
        <div className="flex items-center">
          <input 
            type="range" 
            min="1200" 
            max="3500" 
            value={state.goals.calorieTarget} 
            className="w-full h-2 bg-neutral-medium rounded-lg appearance-none cursor-pointer" 
            id="calorie-slider"
            onChange={(e) => dispatch({ 
              type: 'UPDATE_GOALS', 
              payload: { calorieTarget: parseInt(e.target.value) }
            })}
          />
          <span className="ml-4 font-medium">{state.goals.calorieTarget}</span>
          <span className="ml-1">kcal</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="health-conditions">
          Specific Health Conditions (if any)
        </label>
        <select 
          id="health-conditions" 
          name="health-conditions" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          value={state.goals.healthConditions}
          onChange={(e) => dispatch({ 
            type: 'UPDATE_GOALS', 
            payload: { healthConditions: e.target.value as any }
          })}
        >
          <option value="none">None</option>
          <option value="diabetes">Diabetes-friendly</option>
          <option value="heart">Heart-healthy</option>
          <option value="low-sodium">Low sodium</option>
          <option value="ibs">IBS-friendly</option>
        </select>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="border border-neutral-medium hover:border-primary text-neutral-dark hover:text-primary px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={() => dispatch({ type: 'PREV_STEP' })}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Previous
        </button>
        <button 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
        >
          Next
          <span className="material-icons ml-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

// Step 3: Budget
const BudgetStep = ({ 
  state, 
  dispatch, 
  onSubmit 
}: { 
  state: FormState, 
  dispatch: React.Dispatch<FormAction>,
  onSubmit: () => void 
}) => {
  return (
    <div id="step3" className="step-container">
      <h2 className="text-2xl font-heading font-semibold mb-6">Budget Preferences</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Daily Budget
        </label>
        <div className="flex items-center">
          <span className="mr-2">$</span>
          <input 
            type="range" 
            min="10" 
            max="50" 
            value={state.budget.dailyBudget} 
            className="w-full h-2 bg-neutral-medium rounded-lg appearance-none cursor-pointer" 
            id="budget-slider"
            onChange={(e) => dispatch({ 
              type: 'UPDATE_BUDGET', 
              payload: { dailyBudget: parseInt(e.target.value) }
            })}
          />
          <span className="ml-4 font-medium">{state.budget.dailyBudget}</span>
          <span className="ml-1">/ day</span>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Budget Priority</p>
        <div className="flex flex-col space-y-2">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="budget-priority" 
              value="strict" 
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              checked={state.budget.budgetPriority === 'strict'}
              onChange={() => dispatch({ 
                type: 'UPDATE_BUDGET', 
                payload: { budgetPriority: 'strict' }
              })}
            />
            <span className="ml-2">Strict (never exceed budget)</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="budget-priority" 
              value="balanced" 
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              checked={state.budget.budgetPriority === 'balanced'}
              onChange={() => dispatch({ 
                type: 'UPDATE_BUDGET', 
                payload: { budgetPriority: 'balanced' }
              })}
            />
            <span className="ml-2">Balanced (occasionally exceed budget slightly for nutrition)</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="budget-priority" 
              value="nutrition" 
              className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
              checked={state.budget.budgetPriority === 'nutrition'}
              onChange={() => dispatch({ 
                type: 'UPDATE_BUDGET', 
                payload: { budgetPriority: 'nutrition' }
              })}
            />
            <span className="ml-2">Nutrition first (budget is secondary to nutritional goals)</span>
          </label>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Budget Distribution (optional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="breakfast-budget">Breakfast</label>
            <div className="flex items-center">
              <span className="mr-1">$</span>
              <input 
                type="number" 
                id="breakfast-budget" 
                min="1" 
                max="20" 
                value={state.budget.mealBudget?.breakfast || 6} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_BUDGET', 
                  payload: { 
                    mealBudget: {
                      ...state.budget.mealBudget,
                      breakfast: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="lunch-budget">Lunch</label>
            <div className="flex items-center">
              <span className="mr-1">$</span>
              <input 
                type="number" 
                id="lunch-budget" 
                min="1" 
                max="20" 
                value={state.budget.mealBudget?.lunch || 8} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_BUDGET', 
                  payload: { 
                    mealBudget: {
                      ...state.budget.mealBudget,
                      lunch: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="snack-budget">Snack</label>
            <div className="flex items-center">
              <span className="mr-1">$</span>
              <input 
                type="number" 
                id="snack-budget" 
                min="1" 
                max="10" 
                value={state.budget.mealBudget?.snack || 3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_BUDGET', 
                  payload: { 
                    mealBudget: {
                      ...state.budget.mealBudget,
                      snack: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1" htmlFor="dinner-budget">Dinner</label>
            <div className="flex items-center">
              <span className="mr-1">$</span>
              <input 
                type="number" 
                id="dinner-budget" 
                min="1" 
                max="20" 
                value={state.budget.mealBudget?.dinner || 8} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                onChange={(e) => dispatch({ 
                  type: 'UPDATE_BUDGET', 
                  payload: { 
                    mealBudget: {
                      ...state.budget.mealBudget,
                      dinner: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="border border-neutral-medium hover:border-primary text-neutral-dark hover:text-primary px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={() => dispatch({ type: 'PREV_STEP' })}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Previous
        </button>
        <button 
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={onSubmit}
        >
          Generate Plan
          <span className="material-icons ml-1">restaurant_menu</span>
        </button>
      </div>
    </div>
  );
};

// Step 4: Results
const ResultsStep = ({ 
  mealPlan, 
  aiAnalysis,
  onRegenerate, 
  onStartOver 
}: { 
  mealPlan: MealPlan, 
  aiAnalysis?: AIAnalysisReport,
  onRegenerate: () => void, 
  onStartOver: () => void 
}) => {
  const { saveMealPlan } = useSavedMealPlans();
  const { toast } = useToast();
  
  const handleSaveMealPlan = () => {
    const planRequest: MealPlanRequest = {
      preferences: {
        cuisineType: "any",
        dietaryRestrictions: "none",
        dislikedIngredients: ""
      },
      goals: {
        primaryGoal: "maintenance",
        calorieTarget: 2000,
        healthConditions: "none"
      },
      budget: {
        dailyBudget: 25,
        budgetPriority: "balanced",
        mealBudget: {
          breakfast: 6,
          lunch: 8,
          snack: 3,
          dinner: 8
        }
      }
    };
    
    saveMealPlan.mutate({
      planName: `Meal Plan - ${new Date().toLocaleDateString()}`,
      planRequest: planRequest,
      planData: mealPlan
    });
  };
  
  return (
    <div id="step4" className="step-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-semibold">Your Daily Meal Plan</h2>
        <div className="flex space-x-2">
          <button 
            className="bg-accent-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={onRegenerate}
          >
            <span className="material-icons mr-1 text-sm">refresh</span>
            Regenerate
          </button>
          <button 
            className="border border-neutral-medium hover:border-accent-red hover:text-accent-red px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={onStartOver}
          >
            <span className="material-icons mr-1 text-sm">restart_alt</span>
            Start Over
          </button>
        </div>
      </div>
      
      <SummaryCard mealPlan={mealPlan} aiAnalysis={aiAnalysis} />
      
      <div className="space-y-6">
        <MealCard 
          meal={mealPlan.breakfast} 
          icon="free_breakfast" 
          iconBgClass="bg-primary-light bg-opacity-30" 
          iconColor="text-primary"
          insights={[
            "High in protein to kickstart metabolism",
            "Balanced carbs for sustained morning energy",
            "Rich in antioxidants for cellular health"
          ]}
        />
        
        <MealCard 
          meal={mealPlan.lunch} 
          icon="lunch_dining" 
          iconBgClass="bg-secondary-light bg-opacity-30" 
          iconColor="text-secondary"
          insights={[
            "Balanced macros for midday performance",
            "Contains essential amino acids for muscle maintenance",
            "Omega-3 content supports brain function"
          ]} 
        />
        
        <MealCard 
          meal={mealPlan.snack} 
          icon="restaurant" 
          iconBgClass="bg-neutral-light" 
          iconColor="text-neutral-dark"
          insights={[
            "Low glycemic impact to avoid energy crashes",
            "Strategic timing for optimal nutrient utilization",
            "Fiber content supports digestive health"
          ]} 
        />
        
        <MealCard 
          meal={mealPlan.dinner} 
          icon="dinner_dining" 
          iconBgClass="bg-primary-light bg-opacity-30" 
          iconColor="text-primary"
          insights={[
            "Nutrient-dense, calorie-appropriate portion sizing",
            "Contains tryptophan to support quality sleep",
            "Anti-inflammatory ingredients aid recovery"
          ]} 
        />
      </div>
      
      <div className="mt-8 flex justify-center space-x-4">
        <button 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={handleSaveMealPlan}
          disabled={saveMealPlan.isPending}
        >
          <span className="material-icons mr-2">save</span>
          {saveMealPlan.isPending ? 'Saving...' : 'Save Meal Plan'}
        </button>
        
        <button 
          className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
          onClick={() => {
            alert('This would download a PDF of your meal plan in a real application.');
          }}
        >
          <span className="material-icons mr-2">download</span>
          Download Meal Plan PDF
        </button>
      </div>
    </div>
  );
};

export default MealPlanForm;
