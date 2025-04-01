import { MealPreferences, HealthGoals, BudgetConstraints, MealPlan, Meal } from "@shared/schema";

export enum FormStep {
  Preferences = 0,
  Goals = 1,
  Budget = 2,
  Results = 3
}

export type AIInsight = string | {
  type: 'suggestion' | 'analysis' | 'health_tip' | 'info';
  text: string;
  priority?: number; // 1-3, with 3 being highest priority
  mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'overall';
  relatedNutrient?: string;
  recommendation?: string;
}

export interface AIAnalysisReport {
  insights: AIInsight[];
  nutritionScore: number; // 1-100 score of overall nutritional value
  balanceScore: number; // 1-100 score of macronutrient balance
  varietyScore: number; // 1-100 score of food variety
  personalizedMessage: string;
  mainRecommendation: string;
  aiVersion: string;
}

export interface FormState {
  step: FormStep;
  isLoading: boolean;
  aiThinking?: boolean;
  aiThinkingStage?: string;
  aiAnalysis?: AIAnalysisReport;
  preferences: MealPreferences;
  goals: HealthGoals;
  budget: BudgetConstraints;
  mealPlan: MealPlan | null;
}

export interface MealCardProps {
  meal: Meal;
  expanded?: boolean;
  icon: string;
  iconBgClass: string;
  iconColor: string;
  insights?: AIInsight[];
}

export interface StepProgressIndicatorProps {
  currentStep: FormStep;
}

export interface SummaryCardProps {
  mealPlan: MealPlan;
  aiAnalysis?: AIAnalysisReport;
}

export interface FormStepProps {
  onNext: () => void;
  onPrev?: () => void;
}

export interface AIInsightPanelProps {
  insights: AIInsight[];
  title?: string;
  compact?: boolean;
}

export interface AIThinkingIndicatorProps {
  stage: string;
  progress: number;
}
