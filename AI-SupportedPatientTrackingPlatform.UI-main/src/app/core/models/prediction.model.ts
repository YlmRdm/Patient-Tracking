export interface PredictionCondition {
    condition: string;
    probability: number;
    severityScore: number;
    recommendedAction: string;
  }
  
  export interface Prediction {
    patientId: string;
    predictions: PredictionCondition[];
    riskScore: number;
    generatedAt: Date;
    modelVersion: string;
  }