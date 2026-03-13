import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { RecommendationRequest, CropRecommendation } from "./types"

function isOpenAIAvailable(): boolean {
  return !!import.meta.env.VITE_OPENAI_API_KEY
}

export async function generateIntelligentTips(
  crop: CropRecommendation,
  request: RecommendationRequest,
): Promise<string[]> {
  if (!isOpenAIAvailable()) {
    console.log("[v0] OpenAI API key not available, using fallback tips")
    return crop.tips // Return rule-based tips immediately
  }

  const { soilData, weatherData, farmData } = request

  const prompt = `As an agricultural expert, provide 3-4 specific, actionable farming tips for growing ${crop.cropName} with these conditions:
  
  Soil: pH ${soilData.ph}, N:${soilData.nitrogen}, P:${soilData.phosphorus}, K:${soilData.potassium}
  Weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.rainfall}mm rainfall
  Farm: ${farmData?.soilType || "unknown"} soil, ${farmData?.farmSize || 1} acres
  
  Current suitability score: ${crop.suitabilityScore}%
  
  Focus on practical, specific advice for improving yield and addressing any deficiencies.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      system: "You are an expert agricultural advisor. Provide concise, practical farming advice in bullet points.",
    })

    return text
      .split("\n")
      .filter((tip) => tip.trim().length > 0)
      .map((tip) => tip.replace(/^[-•*]\s*/, "").trim())
      .slice(0, 4)
  } catch (error) {
    console.error("[v0] AI tip generation failed:", error)
    return crop.tips // Fallback to rule-based tips
  }
}

export async function analyzeMarketTrends(cropName: string): Promise<string> {
  if (!isOpenAIAvailable()) {
    console.log("[v0] OpenAI API key not available, using fallback market analysis")
    return "Market data requires AI integration. Consider checking local agricultural extension services for current pricing and demand trends."
  }

  const prompt = `Provide a brief market analysis for ${cropName} including:
  - Current market demand and price trends
  - Best selling strategies and timing
  - Economic outlook for this crop
  Keep it under 80 words and focus on actionable insights.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      system: "You are an agricultural market analyst. Provide concise, data-driven market insights.",
    })

    return text.trim()
  } catch (error) {
    console.error("[v0] Market analysis failed:", error)
    return "Market data currently unavailable. Consider checking local agricultural extension services for current pricing."
  }
}

export async function assessRiskFactors(crop: CropRecommendation, request: RecommendationRequest): Promise<string[]> {
  if (!isOpenAIAvailable()) {
    console.log("[v0] OpenAI API key not available, using fallback risk assessment")
    return [
      "Monitor weather conditions for optimal growing periods",
      "Regular soil testing recommended for nutrient management",
      "Consider local pest and disease patterns for this crop",
    ]
  }

  const { soilData, weatherData, farmData } = request

  const prompt = `Identify 2-3 main risk factors for growing ${crop.cropName} given these conditions:
  
  Soil: pH ${soilData.ph}, nutrients N:${soilData.nitrogen} P:${soilData.phosphorus} K:${soilData.potassium}
  Weather: ${weatherData.temperature}°C, ${weatherData.humidity}% humidity, ${weatherData.rainfall}mm rainfall
  Suitability: ${crop.suitabilityScore}%
  
  Focus on specific risks like disease, pests, weather, or soil issues.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      system: "You are an agricultural risk assessment expert. Identify specific, actionable risk factors.",
    })

    return text
      .split("\n")
      .filter((risk) => risk.trim().length > 0)
      .map((risk) => risk.replace(/^[-•*]\s*/, "").trim())
      .slice(0, 3)
  } catch (error) {
    console.error("[v0] Risk assessment failed:", error)
    return ["Monitor weather conditions closely", "Regular soil testing recommended"]
  }
}

export function calculateAIConfidence(suitabilityScore: number, dataQuality = 0.8): number {
  const hasAI = isOpenAIAvailable()
  const baseConfidence = suitabilityScore / 100
  const adjustedConfidence = baseConfidence * dataQuality * (hasAI ? 1.0 : 0.85) // Slightly lower confidence without AI
  return Math.round(adjustedConfidence * 100)
}

export function getAIStatus(): { available: boolean; features: string[] } {
  const available = isOpenAIAvailable()
  return {
    available,
    features: available
      ? ["Intelligent Tips", "Market Analysis", "Risk Assessment"]
      : ["Rule-based Recommendations", "Static Agricultural Data"],
  }
}
