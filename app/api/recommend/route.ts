import { type NextRequest, NextResponse } from "next/server"
import { getEnhancedCropRecommendations } from "@/lib/ml-enhanced-service"
import { saveRecommendation } from "@/lib/firebase-service"
import { isFirebaseReady } from "@/lib/firebase"
import type { RecommendationRequest } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json()

    const { soilData, weatherData } = body

    if (!soilData || !weatherData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Validate soil data
    if (
      soilData.nitrogen === undefined ||
      soilData.phosphorus === undefined ||
      soilData.potassium === undefined ||
      soilData.ph === undefined
    ) {
      return NextResponse.json({ error: "Incomplete soil data" }, { status: 400 })
    }

    // Validate weather data
    if (
      weatherData.temperature === undefined ||
      weatherData.humidity === undefined ||
      weatherData.rainfall === undefined ||
      !weatherData.season
    ) {
      return NextResponse.json({ error: "Incomplete weather data" }, { status: 400 })
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

    return NextResponse.json({
      recommendations: recommendations.recommendations,
      timestamp: recommendations.timestamp,
      requestId: recommendations.requestId,
    })
  } catch (error) {
    console.error("[v0] Error processing AI-enhanced recommendation request:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process AI-enhanced recommendation request",
      },
      { status: 500 },
    )
  }
}
