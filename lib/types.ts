export interface SoilData {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  organicMatter: number
  moisture: number
}

export interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  season: "spring" | "summer" | "autumn" | "winter"
}

export interface FarmData {
  location: string
  farmSize: number
  soilType: string
  irrigationType: string
}

export interface CropRecommendation {
  cropName: string
  suitabilityScore: number
  expectedYield: number
  growingPeriod: string
  waterRequirement: string
  fertilizer: string[]
  tips: string[]
  marketInsights?: string
  aiConfidence?: number
  riskFactors?: string[]
}

export interface RecommendationRequest {
  soilData: SoilData
  weatherData: WeatherData
  farmData?: FarmData // Made farmData optional since we removed farm details form
}

export interface RecommendationResponse {
  recommendations: CropRecommendation[]
  timestamp: string
  requestId: string
}

export interface AIEnhancedRecommendation extends CropRecommendation {
  marketInsights: string
  aiConfidence: number
  riskFactors: string[]
}

export interface MarketData {
  currentPrice: number
  demandLevel: "low" | "medium" | "high"
  pricetrend: "rising" | "stable" | "falling"
  seasonalFactors: string[]
}
