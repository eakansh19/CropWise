import type { RecommendationRequest, RecommendationResponse, CropRecommendation } from "./types"

// Mock crop database with growing requirements
const CROP_DATABASE = [
  {
    name: "Rice",
    optimalPH: [5.5, 7.0],
    optimalTemp: [20, 35],
    optimalHumidity: [70, 90],
    optimalRainfall: [1000, 2000],
    nitrogenReq: [40, 80],
    phosphorusReq: [20, 40],
    potassiumReq: [40, 80],
    soilTypes: ["clay", "clay-loam", "silt"],
    seasons: ["summer", "spring"],
    waterReq: "High",
    growingPeriod: "120-150 days",
    baseYield: 4.5,
  },
  {
    name: "Wheat",
    optimalPH: [6.0, 7.5],
    optimalTemp: [15, 25],
    optimalHumidity: [50, 70],
    optimalRainfall: [400, 800],
    nitrogenReq: [60, 120],
    phosphorusReq: [25, 50],
    potassiumReq: [30, 60],
    soilTypes: ["loam", "sandy-loam", "clay-loam"],
    seasons: ["winter", "spring"],
    waterReq: "Medium",
    growingPeriod: "90-120 days",
    baseYield: 3.2,
  },
  {
    name: "Corn",
    optimalPH: [6.0, 6.8],
    optimalTemp: [20, 30],
    optimalHumidity: [60, 80],
    optimalRainfall: [500, 1000],
    nitrogenReq: [80, 150],
    phosphorusReq: [30, 60],
    potassiumReq: [60, 120],
    soilTypes: ["loam", "sandy-loam", "silt-loam"],
    seasons: ["spring", "summer"],
    waterReq: "Medium-High",
    growingPeriod: "100-130 days",
    baseYield: 5.8,
  },
  {
    name: "Soybeans",
    optimalPH: [6.0, 7.0],
    optimalTemp: [20, 30],
    optimalHumidity: [60, 80],
    optimalRainfall: [450, 700],
    nitrogenReq: [20, 40], // Lower due to nitrogen fixation
    phosphorusReq: [25, 45],
    potassiumReq: [40, 80],
    soilTypes: ["loam", "sandy-loam", "silt-loam"],
    seasons: ["spring", "summer"],
    waterReq: "Medium",
    growingPeriod: "90-120 days",
    baseYield: 2.8,
  },
  {
    name: "Cotton",
    optimalPH: [5.8, 8.0],
    optimalTemp: [25, 35],
    optimalHumidity: [50, 70],
    optimalRainfall: [500, 1000],
    nitrogenReq: [60, 120],
    phosphorusReq: [25, 50],
    potassiumReq: [50, 100],
    soilTypes: ["sandy-loam", "clay-loam", "loam"],
    seasons: ["spring", "summer"],
    waterReq: "Medium-High",
    growingPeriod: "150-180 days",
    baseYield: 1.2,
  },
  {
    name: "Tomatoes",
    optimalPH: [6.0, 6.8],
    optimalTemp: [18, 27],
    optimalHumidity: [60, 80],
    optimalRainfall: [400, 800],
    nitrogenReq: [50, 100],
    phosphorusReq: [30, 60],
    potassiumReq: [80, 150],
    soilTypes: ["loam", "sandy-loam", "silt-loam"],
    seasons: ["spring", "summer"],
    waterReq: "High",
    growingPeriod: "70-100 days",
    baseYield: 25.0,
  },
  {
    name: "Potatoes",
    optimalPH: [5.0, 6.5],
    optimalTemp: [15, 20],
    optimalHumidity: [70, 85],
    optimalRainfall: [400, 600],
    nitrogenReq: [40, 80],
    phosphorusReq: [20, 40],
    potassiumReq: [60, 120],
    soilTypes: ["sandy-loam", "loam", "silt-loam"],
    seasons: ["spring", "autumn"],
    waterReq: "Medium",
    growingPeriod: "90-120 days",
    baseYield: 20.0,
  },
]

function calculateSuitabilityScore(crop: any, request: RecommendationRequest): number {
  const { soilData, weatherData, farmData } = request
  let score = 0
  let factors = 0

  // pH score (30% weight - increased since no farm data)
  const phScore = calculateRangeScore(soilData.ph, crop.optimalPH)
  score += phScore * 0.3
  factors += 0.3

  // Temperature score (25% weight - increased)
  const tempScore = calculateRangeScore(weatherData.temperature, crop.optimalTemp)
  score += tempScore * 0.25
  factors += 0.25

  // Humidity score (20% weight - increased)
  const humidityScore = calculateRangeScore(weatherData.humidity, crop.optimalHumidity)
  score += humidityScore * 0.2
  factors += 0.2

  // Rainfall score (20% weight - increased)
  const rainfallScore = calculateRangeScore(weatherData.rainfall, crop.optimalRainfall)
  score += rainfallScore * 0.2
  factors += 0.2

  // Nutrient scores (15% total weight - slightly reduced)
  const nitrogenScore = calculateRangeScore(soilData.nitrogen, crop.nitrogenReq)
  const phosphorusScore = calculateRangeScore(soilData.phosphorus, crop.phosphorusReq)
  const potassiumScore = calculateRangeScore(soilData.potassium, crop.potassiumReq)
  const avgNutrientScore = (nitrogenScore + phosphorusScore + potassiumScore) / 3
  score += avgNutrientScore * 0.15
  factors += 0.15

  if (farmData) {
    // Soil type match (5% weight)
    const soilTypeScore = crop.soilTypes.includes(farmData.soilType) ? 1 : 0.5
    score += soilTypeScore * 0.05
    factors += 0.05
  }

  // Season match (10% weight - increased to compensate for optional farm data)
  const seasonScore = crop.seasons.includes(weatherData.season) ? 1 : 0.3
  score += seasonScore * 0.1
  factors += 0.1

  return Math.round((score / factors) * 100)
}

function calculateRangeScore(value: number, optimalRange: [number, number]): number {
  const [min, max] = optimalRange
  if (value >= min && value <= max) {
    return 1.0 // Perfect score
  }

  // Calculate how far outside the optimal range
  const center = (min + max) / 2
  const range = max - min
  const distance = Math.abs(value - center)
  const maxDistance = range * 2 // Allow for some tolerance

  if (distance > maxDistance) {
    return 0.1 // Minimum score
  }

  return Math.max(0.1, 1 - distance / maxDistance)
}

function calculateExpectedYield(crop: any, suitabilityScore: number, farmSize?: number): number {
  const baseYieldPerAcre = crop.baseYield
  const suitabilityFactor = suitabilityScore / 100
  const expectedYieldPerAcre = baseYieldPerAcre * suitabilityFactor
  const effectiveFarmSize = farmSize || 1
  return Math.round(expectedYieldPerAcre * effectiveFarmSize * 100) / 100
}

function generateTips(crop: any, request: RecommendationRequest, suitabilityScore: number): string[] {
  const tips: string[] = []
  const { soilData, weatherData, farmData } = request

  // pH recommendations
  if (soilData.ph < crop.optimalPH[0]) {
    tips.push(`Consider adding lime to increase soil pH to ${crop.optimalPH[0]}-${crop.optimalPH[1]} range`)
  } else if (soilData.ph > crop.optimalPH[1]) {
    tips.push(
      `Consider adding sulfur or organic matter to lower soil pH to ${crop.optimalPH[0]}-${crop.optimalPH[1]} range`,
    )
  }

  // Nutrient recommendations
  if (soilData.nitrogen < crop.nitrogenReq[0]) {
    tips.push("Apply nitrogen-rich fertilizer or compost to meet crop requirements")
  }
  if (soilData.phosphorus < crop.phosphorusReq[0]) {
    tips.push("Consider phosphorus supplementation through bone meal or rock phosphate")
  }
  if (soilData.potassium < crop.potassiumReq[0]) {
    tips.push("Add potassium through potash fertilizer or wood ash")
  }

  if (farmData && farmData.irrigationType === "rain-fed" && weatherData.rainfall < crop.optimalRainfall[0]) {
    tips.push("Consider installing irrigation system due to low rainfall for this crop")
  }

  // General tips based on suitability
  if (suitabilityScore > 80) {
    tips.push("Excellent conditions for this crop - focus on optimal planting timing")
  } else if (suitabilityScore > 60) {
    tips.push("Good conditions with some adjustments needed for optimal yield")
  } else {
    tips.push("Consider soil amendments and improved management practices")
  }

  return tips.slice(0, 4) // Limit to 4 tips
}

function generateFertilizerRecommendations(crop: any, soilData: any): string[] {
  const fertilizers: string[] = []

  // NPK recommendations based on crop needs and soil levels
  const nDeficit = Math.max(0, crop.nitrogenReq[0] - soilData.nitrogen)
  const pDeficit = Math.max(0, crop.phosphorusReq[0] - soilData.phosphorus)
  const kDeficit = Math.max(0, crop.potassiumReq[0] - soilData.potassium)

  if (nDeficit > 0 || pDeficit > 0 || kDeficit > 0) {
    const nRatio = Math.ceil(nDeficit / 10) || 1
    const pRatio = Math.ceil(pDeficit / 10) || 1
    const kRatio = Math.ceil(kDeficit / 10) || 1
    fertilizers.push(`NPK ${nRatio}-${pRatio}-${kRatio} fertilizer`)
  }

  // Organic alternatives
  if (soilData.organicMatter < 3) {
    fertilizers.push("Compost or well-rotted manure")
  }

  // Specific recommendations
  if (crop.name === "Soybeans") {
    fertilizers.push("Rhizobium inoculant for nitrogen fixation")
  }

  return fertilizers.slice(0, 3)
}

export async function getCropRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  const recommendations: CropRecommendation[] = CROP_DATABASE.map((crop) => {
    const suitabilityScore = calculateSuitabilityScore(crop, request)
    const expectedYield = calculateExpectedYield(crop, suitabilityScore, request.farmData?.farmSize)
    const tips = generateTips(crop, request, suitabilityScore)
    const fertilizer = generateFertilizerRecommendations(crop, request.soilData)

    return {
      cropName: crop.name,
      suitabilityScore,
      expectedYield,
      growingPeriod: crop.growingPeriod,
      waterRequirement: crop.waterReq,
      fertilizer,
      tips,
    }
  })
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore) // Sort by suitability score
    .slice(0, 3) // Return top 3 recommendations instead of 5

  return {
    recommendations,
    timestamp: new Date().toISOString(),
    requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}
