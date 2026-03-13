import { getEnhancedCropRecommendations } from "./ml-enhanced-service"
import { saveRecommendation } from "./firebase-service"
import { isFirebaseReady } from "./firebase"
import type { RecommendationRequest, RecommendationResponse } from "./types"

export async function getRecommendations(body: RecommendationRequest): Promise<RecommendationResponse> {
  const { soilData, weatherData } = body

  if (!soilData || !weatherData) {
    throw new Error("Missing required data")
  }

  // Validate soil data
  if (
    soilData.nitrogen === undefined ||
    soilData.phosphorus === undefined ||
    soilData.potassium === undefined ||
    soilData.ph === undefined
  ) {
    throw new Error("Incomplete soil data")
  }

  // Validate weather data
  if (
    weatherData.temperature === undefined ||
    weatherData.humidity === undefined ||
    weatherData.rainfall === undefined ||
    !weatherData.season
  ) {
    throw new Error("Incomplete weather data")
  }

  // Get AI-enhanced recommendations
  console.log("[v0] Processing AI-enhanced recommendation request")
  const recommendations = await getEnhancedCropRecommendations(body)

  if (isFirebaseReady) {
    try {
      const savedId = await saveRecommendation(body, recommendations)
      console.log("[v0] Recommendation saved to Firebase with ID:", savedId)
    } catch (saveError) {
      console.error("[v0] Failed to save to Firebase, but continuing with response:", saveError)
      // Continue even if save fails - don't break the user experience
    }
  } else {
    console.log("[v0] Firebase not configured, skipping save")
  }

  return {
    recommendations: recommendations.recommendations,
    timestamp: recommendations.timestamp,
    requestId: recommendations.requestId,
  }
}
