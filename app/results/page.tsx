"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Leaf,
  Droplets,
  Clock,
  Lightbulb,
  History,
  AlertTriangle,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCropIcon } from "@/lib/crop-icons"
import type { RecommendationResponse, RecommendationRequest } from "@/lib/types"

declare global {
  interface Window {
    jsPDF: any
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null)
  const [inputData, setInputData] = useState<RecommendationRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Get data from sessionStorage
    const storedRecommendations = sessionStorage.getItem("cropRecommendations")
    const storedInputData = sessionStorage.getItem("inputData")

    if (storedRecommendations && storedInputData) {
      setRecommendations(JSON.parse(storedRecommendations))
      setInputData(JSON.parse(storedInputData))

      const savedRecommendations = JSON.parse(localStorage.getItem("savedRecommendations") || "[]")
      const currentTimestamp = JSON.parse(storedRecommendations).timestamp
      const isAlreadySaved = savedRecommendations.some((saved: any) => saved.timestamp === currentTimestamp)
      setIsSaved(isAlreadySaved)
    } else {
      // Redirect to recommendation page if no data
      router.push("/recommend")
      return
    }

    setIsLoading(false)
  }, [router])

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getSuitabilityLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getAIConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-blue-600 bg-blue-50 border-blue-200"
    if (confidence >= 70) return "text-indigo-600 bg-indigo-50 border-indigo-200"
    return "text-purple-600 bg-purple-50 border-purple-200"
  }

  const handleDownloadReport = async () => {
    if (!recommendations || !inputData) return

    setIsGeneratingPDF(true)

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AI-Enhanced Crop Recommendation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #22c55e; padding-bottom: 20px; }
            .header h1 { color: #22c55e; font-size: 28px; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .ai-badge { background: #3b82f6; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
            .section { margin: 30px 0; }
            .section h2 { color: #1f2937; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .summary-item { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .summary-item strong { color: #22c55e; }
            .crop-card { background: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0; }
            .crop-header { display: flex; align-items: center; margin-bottom: 15px; }
            .crop-number { background: #22c55e; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
            .crop-title { font-size: 22px; font-weight: bold; color: #1f2937; }
            .score-badge { background: #dcfce7; color: #166534; padding: 5px 15px; border-radius: 20px; font-weight: bold; margin-left: auto; }
            .ai-confidence { background: #dbeafe; color: #1e40af; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-left: 10px; }
            .crop-details { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .detail-section h4 { color: #22c55e; font-size: 16px; margin-bottom: 10px; }
            .detail-item { margin: 8px 0; }
            .detail-label { color: #666; }
            .detail-value { font-weight: bold; color: #1f2937; }
            .tips ul { margin: 10px 0; padding-left: 20px; }
            .tips li { margin: 5px 0; color: #4b5563; }
            .risk-factors { background: #fef2f2; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌾 AI-Enhanced Crop Recommendation Report</h1>
            <span class="ai-badge">🤖 AI-Powered Analysis</span>
            <p>Generated on ${new Date(recommendations.timestamp).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Farm Conditions Summary</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <strong>Soil pH:</strong> ${inputData.soilData.ph}
              </div>
              <div class="summary-item">
                <strong>Temperature:</strong> ${inputData.weatherData.temperature}°C
              </div>
              <div class="summary-item">
                <strong>Nitrogen (N):</strong> ${inputData.soilData.nitrogen} kg/ha
              </div>
              <div class="summary-item">
                <strong>Humidity:</strong> ${inputData.weatherData.humidity}%
              </div>
              <div class="summary-item">
                <strong>Phosphorus (P):</strong> ${inputData.soilData.phosphorus} kg/ha
              </div>
              <div class="summary-item">
                <strong>Rainfall:</strong> ${inputData.weatherData.rainfall}mm
              </div>
              <div class="summary-item">
                <strong>Potassium (K):</strong> ${inputData.soilData.potassium} kg/ha
              </div>
              <div class="summary-item">
                <strong>Season:</strong> ${inputData.weatherData.season}
              </div>
            </div>
          </div>

          <div class="section">
            <h2>AI-Enhanced Crop Recommendations</h2>
            ${recommendations.recommendations
              .map(
                (crop, index) => `
              <div class="crop-card">
                <div class="crop-header">
                  <div class="crop-number">${index + 1}</div>
                  <div class="crop-title">${crop.cropName}</div>
                  <div class="score-badge">${crop.suitabilityScore}% Suitable</div>
                  ${crop.aiConfidence ? `<div class="ai-confidence">🤖 ${crop.aiConfidence}% AI Confidence</div>` : ""}
                </div>
                
                <div class="crop-details">
                  <div class="detail-section">
                    <h4>Growing Information</h4>
                    <div class="detail-item">
                      <span class="detail-label">Growing Period:</span><br>
                      <span class="detail-value">${crop.growingPeriod}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Water Requirement:</span><br>
                      <span class="detail-value">${crop.waterRequirement}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Expected Yield:</span><br>
                      <span class="detail-value">${crop.expectedYield} tons</span>
                    </div>
                  </div>
                  
                  <div class="detail-section">
                    <h4>Fertilizer Requirements</h4>
                    ${
                      crop.fertilizer.length > 0
                        ? crop.fertilizer.map((fert) => `<div class="detail-item">• ${fert}</div>`).join("")
                        : '<div class="detail-item">No specific fertilizer requirements</div>'
                    }
                  </div>
                  
                  <div class="detail-section tips">
                    <h4>AI-Generated Tips</h4>
                    <ul>
                      ${crop.tips
                        .slice(0, 4)
                        .map((tip) => `<li>${tip}</li>`)
                        .join("")}
                    </ul>
                  </div>

                  ${
                    crop.riskFactors
                      ? `
                  <div class="detail-section">
                    <h4>Risk Assessment</h4>
                    <ul>
                      ${crop.riskFactors.map((risk) => `<li>${risk}</li>`).join("")}
                    </ul>
                  </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="footer">
            <p><strong>Important:</strong> These AI-enhanced recommendations combine agricultural expertise with machine learning analysis. Consult local agricultural experts for region-specific advice.</p>
            <p>Report generated by AI-Enhanced Crop Recommendation System</p>
          </div>
        </body>
        </html>
      `

      // Create Word document blob
      const blob = new Blob([htmlContent], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crop-recommendations-${new Date().toISOString().split("T")[0]}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating Word document:", error)
      // Fallback to JSON if Word generation fails
      const reportData = {
        timestamp: recommendations.timestamp,
        soilData: inputData.soilData,
        weatherData: inputData.weatherData,
        recommendations: recommendations.recommendations,
      }
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `crop-recommendations-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSaveRecommendation = async () => {
    if (!recommendations || !inputData) return

    setIsSaving(true)
    try {
      const recommendationData = {
        id: `rec_${Date.now()}`,
        timestamp: recommendations.timestamp,
        soilData: inputData.soilData,
        weatherData: inputData.weatherData,
        recommendations: recommendations.recommendations,
        savedAt: new Date().toISOString(),
      }

      // Save to localStorage (fallback if Firebase not configured)
      const savedRecommendations = JSON.parse(localStorage.getItem("savedRecommendations") || "[]")
      savedRecommendations.unshift(recommendationData) // Add to beginning
      localStorage.setItem("savedRecommendations", JSON.stringify(savedRecommendations))

      setIsSaved(true)
    } catch (error) {
      console.error("Error saving recommendation:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your recommendations...</p>
        </div>
      </div>
    )
  }

  if (!recommendations || !inputData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No recommendations found.</p>
          <Button asChild>
            <Link href="/recommend">Start New Recommendation</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/recommend">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  New Recommendation
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">AI-Enhanced Crop Recommendations</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history">
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={handleDownloadReport} disabled={isGeneratingPDF}>
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Word Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Summary Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Your AI-Enhanced Crop Recommendations</h2>
              <p className="text-muted-foreground">Powered by artificial intelligence and agricultural expertise</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Generated on</p>
              <p className="font-medium">{new Date(recommendations.timestamp).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Farm Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm font-medium">Soil pH</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{inputData.soilData.ph}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm font-medium">Temperature</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{inputData.weatherData.temperature}°C</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm font-medium">Rainfall</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{inputData.weatherData.rainfall}mm</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p className="text-sm font-medium">Humidity</p>
                </div>
                <p className="text-2xl font-bold text-foreground">{inputData.weatherData.humidity}%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-6">
          {recommendations.recommendations.map((crop, index) => (
            <Card key={crop.cropName} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCropIcon(crop.cropName)}</span>
                      <div>
                        <CardTitle className="text-xl">{crop.cropName}</CardTitle>
                        <CardDescription>Expected yield: {crop.expectedYield} tons</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getSuitabilityColor(crop.suitabilityScore)} border`}>
                      {getSuitabilityLabel(crop.suitabilityScore)} ({crop.suitabilityScore}%)
                    </Badge>
                    {crop.aiConfidence && (
                      <Badge className={`${getAIConfidenceColor(crop.aiConfidence)} border`}>
                        <Brain className="h-3 w-3 mr-1" />
                        AI: {crop.aiConfidence}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Suitability Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Suitability Score</p>
                    <p className="text-sm text-muted-foreground">{crop.suitabilityScore}%</p>
                  </div>
                  <Progress value={crop.suitabilityScore} className="h-2" />
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  {/* Growing Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Growing Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Growing Period:</span>
                        <span className="font-medium">{crop.growingPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Water Requirement:</span>
                        <span className="font-medium">{crop.waterRequirement}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Yield:</span>
                        <span className="font-medium">{crop.expectedYield} tons</span>
                      </div>
                    </div>
                  </div>

                  {/* Fertilizer Recommendations */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-primary" />
                      Fertilizer Needs
                    </h4>
                    <div className="space-y-2">
                      {crop.fertilizer.map((fert, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {fert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* AI-Generated Tips */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      AI-Generated Tips
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {crop.tips.slice(0, 3).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {crop.riskFactors && crop.riskFactors.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Risk Assessment
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {crop.riskFactors.slice(0, 3).map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Section */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {!isSaved ? (
            <Button
              onClick={handleSaveRecommendation}
              disabled={isSaving}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <History className="h-4 w-4 mr-2" />
                  Save to History
                </>
              )}
            </Button>
          ) : (
            <Button disabled size="lg" variant="outline" className="border-green-600 text-green-600 bg-transparent">
              <History className="h-4 w-4 mr-2" />
              Saved to History ✓
            </Button>
          )}

          <Button asChild size="lg">
            <Link href="/recommend">
              <RefreshCw className="h-4 w-4 mr-2" />
              Get New Recommendations
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={handleDownloadReport} disabled={isGeneratingPDF}>
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Word Report
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              View All History
            </Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Important Note</h3>
            <p className="text-sm text-muted-foreground">
              These AI-enhanced recommendations combine traditional agricultural knowledge with machine learning
              analysis for improved accuracy. The system uses advanced algorithms to provide risk assessments and
              personalized growing tips. For best results, consult with your local agricultural extension office or
              farming experts who understand your specific regional conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
