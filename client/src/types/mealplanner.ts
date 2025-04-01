import { MealPreferences, HealthGoals, BudgetConstraints, MealPlan, Meal } from "@shared/schema";

export enum FormStep {
  Preferences = 0,
  Goals = 1,
  Budget = 2,
  Results = 3
}

export interface FormState {
  step: FormStep;
  isLoading: boolean;
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
}

export interface StepProgressIndicatorProps {
  currentStep: FormStep;
}

export interface SummaryCardProps {
  mealPlan: MealPlan;
}

export interface FormStepProps {
  onNext: () => void;
  onPrev?: () => void;
}
