
export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TableRow {
  liked: string;
  avoid: string;
}

export interface StructuredReport {
  profileSummary: {
    name: string;
    age: number;
    sex: string;
    height: string;
    currentWeight: number;
    targetWeight: number;
    bmi: number;
    bmiCategory: string;
  };
  nutritionalAnalysis: {
    summary: string;
    dailyMeals: number;
    waterIntake: string;
    recommendations: string[];
  };
  physicalAnalysis: {
    activityLevel: string;
    preferredActivities: string;
    sleepHours: number;
    recommendations: string[];
  };
  goalsAndMotivation: {
    mainChallenge: string;
    mainMotivation: string;
    recommendations: string[];
  };
  customPreferences: {
    likedFoods: string[];
    foodsToAvoid: string[];
  };
  actionPlan: {
    title: string;
    introduction: string;
    dietarySteps: string[];
    exerciseSteps: string[];
    lifestyleSteps: string[];
  };
  conclusion: {
    finalMessage: string;
  };
  charts: {
    weightComparison: ChartDataPoint[];
    activityDistribution: ChartDataPoint[]; 
  };
}
