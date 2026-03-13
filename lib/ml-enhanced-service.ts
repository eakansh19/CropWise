import { getCropRecommendations as getBasicRecommendations } from "./ml-service"
import { generateIntelligentTips, analyzeMarketTrends, assessRiskFactors, calculateAIConfidence } from "./ai-service"
import type { RecommendationRequest, RecommendationResponse } from "./types"

export async function getEnhancedCropRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
  console.log("[v0] Starting AI-enhanced crop recommendation process")

  // Get basic rule-based recommendations
  const basicResponse = await getBasicRecommendations(request)

  const hasOpenAIKey = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== ""

  if (!hasOpenAIKey) {
    console.log("[v0] OpenAI API key not available, returning basic recommendations")
    // Return basic recommendations with fallback AI fields
    const enhancedRecommendations = basicResponse.recommendations.map((crop) => ({
      ...crop,
      marketInsights: "AI analysis unavailable - configure OpenAI API key for enhanced insights",
      aiConfidence: crop.suitabilityScore,
      riskFactors: ["Standard agricultural risks apply"],
    }))

    return {
      ...basicResponse,
      recommendations: enhancedRecommendations,
    }
  }

  // Enhance top 3 recommendations with AI insights (only if API key available)
  const enhancedRecommendations = await Promise.all(
    basicResponse.recommendations.map(async (crop, index) => {
      try {
        console.log(`[v0] Enhancing recommendation ${index + 1}: ${crop.cropName}`)

        const [aiTips, marketAnalysis, riskFactors] = await Promise.all([
          generateIntelligentTips(crop, request),
          analyzeMarketTrends(crop.cropName),
          assessRiskFactors(crop, request),
        ])

        const aiConfidence = calculateAIConfidence(crop.suitabilityScore)

        return {
          ...crop,
          tips: aiTips.length > 0 ? aiTips : crop.tips, // Use AI tips if available
          marketInsights: marketAnalysis,
          aiConfidence,
          riskFactors,
        }
      } catch (error) {
        console.error(`[v0] Failed to enhance ${crop.cropName}:`, error)
        // Return original recommendation if AI enhancement fails
        return {
          ...crop,
          marketInsights: "AI analysis unavailable",
          aiConfidence: crop.suitabilityScore,
          riskFactors: ["Standard agricultural risks apply"],
        }
      }
    }),
  )

  console.log("[v0] AI enhancement completed successfully")

  return {
    ...basicResponse,
    recommendations: enhancedRecommendations,
  }
}
