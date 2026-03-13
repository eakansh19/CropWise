"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HistoryPage() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    uniqueLocations: 0,
    averageFarmSize: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        const savedRecommendations = JSON.parse(localStorage.getItem("savedRecommendations") || "[]")

        setRecommendations(savedRecommendations)
        setStats({
          totalRecommendations: savedRecommendations.length,
          uniqueLocations: 1, // Default since we don't have location data
          averageFarmSize: 0, // Default since we removed farm data
        })
      } catch (err) {
        console.error("[v0] Error loading history data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleViewRecommendation = (recommendation: any) => {
    // Store the recommendation data in sessionStorage and navigate to results
    const recommendationResponse = {
      recommendations: recommendation.recommendations,
      timestamp: recommendation.timestamp,
    }

    const inputData = {
      soilData: recommendation.soilData,
      weatherData: recommendation.weatherData,
    }

    sessionStorage.setItem("cropRecommendations", JSON.stringify(recommendationResponse))
    sessionStorage.setItem("inputData", JSON.stringify(inputData))
    window.location.href = "/results"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recommendation history...</p>
        </div>
      </div>
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
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">Recommendation History</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalRecommendations}</p>
                    <p className="text-sm text-muted-foreground">Total Recommendations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {recommendations.length > 0 ? new Date(recommendations[0].savedAt).toLocaleDateString() : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Latest Recommendation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {recommendations.length > 0 ? recommendations[0].recommendations.length : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Crops per Recommendation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Recent Recommendations</h3>
            <Button asChild>
              <Link href="/recommend">New Recommendation</Link>
            </Button>
          </div>

          {recommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No recommendations found.</p>
                <Button asChild>
                  <Link href="/recommend">Create Your First Recommendation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Crop Recommendation
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(rec.savedAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewRecommendation(rec)}>
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">pH: {rec.soilData.ph}</Badge>
                      <Badge variant="secondary">{rec.weatherData.temperature}°C</Badge>
                      <Badge variant="secondary">{rec.weatherData.rainfall}mm rainfall</Badge>
                      <Badge variant="secondary">{rec.weatherData.humidity}% humidity</Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">
                        Top recommendations:{" "}
                        {rec.recommendations
                          .slice(0, 3)
                          .map((r: any) => r.cropName)
                          .join(", ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
