"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CropInputForm } from "@/components/crop-input-form"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SoilData, WeatherData, RecommendationResponse } from "@/lib/types"

export default function RecommendPage() {
  const router = useRouter()
  const [soilData, setSoilData] = useState<Partial<SoilData>>({})
  const [weatherData, setWeatherData] = useState<Partial<WeatherData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const requestData = {
        soilData: soilData as SoilData,
        weatherData: weatherData as WeatherData,
      }

      console.log("[v0] Submitting recommendation request:", requestData)

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get recommendations")
      }

      const result: RecommendationResponse = await response.json()
      console.log("[v0] Received recommendations:", result)

      // Store results in sessionStorage and navigate to results page
      sessionStorage.setItem("cropRecommendations", JSON.stringify(result))
      sessionStorage.setItem("inputData", JSON.stringify(requestData))
      router.push("/results")
    } catch (err) {
      console.error("[v0] Error getting recommendations:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      soilData.nitrogen !== undefined &&
      soilData.phosphorus !== undefined &&
      soilData.potassium !== undefined &&
      soilData.ph !== undefined &&
      weatherData.temperature !== undefined &&
      weatherData.humidity !== undefined &&
      weatherData.rainfall !== undefined &&
      weatherData.season !== undefined
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Crop Recommendation</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Get Your Crop Recommendations</h2>
          <p className="text-muted-foreground">
            Provide your soil and weather information to receive AI-powered crop recommendations tailored to your
            conditions.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive font-medium">Error: {error}</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Form Section */}
        <CropInputForm
          soilData={soilData}
          weatherData={weatherData}
          onSoilChange={setSoilData}
          onWeatherChange={setWeatherData}
        />

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSubmit} disabled={!isFormValid() || isLoading} size="lg" className="px-8">
            {isLoading ? "Processing..." : "Get Recommendations"}
          </Button>
        </div>

        {/* Help Section */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you don't have soil test results, you can get them from your local agricultural extension office or use
              a home soil testing kit. Weather data can be obtained from local weather stations or agricultural apps.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
