import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  RefreshCw,
  Leaf,
  Droplets,
  Clock,
  Lightbulb,
  History,
  AlertTriangle,
  Brain,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/ui/loading-animation"
import { getCropIcon } from "@/lib/crop-icons"
import { showAlert } from "@/lib/alerts"
import type { RecommendationResponse, RecommendationRequest } from "@/lib/types"
import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20
    },
  },
}

export default function ResultsPage() {
  const navigate = useNavigate()
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
      navigate("/recommend")
      return
    }

    setIsLoading(false)
  }, [navigate])

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-primary bg-primary/10 border-primary/20"
    if (score >= 60) return "text-orange-500 bg-orange-500/10 border-orange-500/20"
    return "text-red-500 bg-red-500/10 border-red-500/20"
  }

  const getSuitabilityLabel = (score: number) => {
    if (score >= 80) return "Optimal"
    if (score >= 60) return "Strong"
    if (score >= 40) return "Viable"
    return "Experimental"
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
          <title>CropWise AI - Agricultural Intelligence Report</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; margin: 40px; line-height: 1.6; color: #1a1a1a; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 4px solid #22c55e; padding-bottom: 30px; }
            .header h1 { color: #1a1a1a; font-size: 32px; margin: 0; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em; }
            .header p { color: #666; margin: 10px 0; font-weight: 500; }
            .ai-badge { background: #22c55e; color: black; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 800; text-transform: uppercase; }
            .section { margin: 40px 0; }
            .section h2 { color: #1a1a1a; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; font-weight: 700; text-transform: uppercase; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
            .summary-item { background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; }
            .summary-item strong { color: #22c55e; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
            .summary-item span { font-size: 20px; font-weight: 700; }
            .crop-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 30px; margin: 30px 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            .crop-header { display: flex; align-items: center; margin-bottom: 25px; gap: 20px; }
            .crop-number { background: #22c55e; color: black; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; }
            .crop-title { font-size: 28px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.02em; text-transform: uppercase; }
            .score-badge { background: #22c55e; color: black; padding: 8px 20px; border-radius: 100px; font-weight: 800; margin-left: auto; text-transform: uppercase; font-size: 14px; }
            .crop-details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 25px; }
            .detail-section h4 { color: #22c55e; font-size: 14px; margin-bottom: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
            .detail-item { margin: 12px 0; }
            .detail-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .detail-value { font-weight: 700; color: #1e293b; font-size: 16px; display: block; }
            .tips ul { margin: 0; padding-left: 20px; }
            .tips li { margin: 8px 0; color: #334155; font-size: 14px; }
            .risk-factors { background: #fff1f2; padding: 20px; border-radius: 16px; margin: 20px 0; border: 1px solid #fecaca; }
            .footer { margin-top: 60px; padding-top: 30px; border-top: 2px solid #e5e7eb; font-size: 14px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="ai-badge">Agricultural Intelligence Analysis</span>
            <h1>CropWise AI - Insights Report</h1>
            <p>Generated for Environment Signature: ${new Date(recommendations.timestamp).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>Environmental Parameters</h2>
            <div class="summary-grid">
              <div class="summary-item"><strong>Soil pH Index</strong><span>${inputData.soilData.ph}</span></div>
              <div class="summary-item"><strong>Thermal Profile</strong><span>${inputData.weatherData.temperature}°C</span></div>
              <div class="summary-item"><strong>Nitrogen content</strong><span>${inputData.soilData.nitrogen} kg/ha</span></div>
              <div class="summary-item"><strong>Atmospheric Humidity</strong><span>${inputData.weatherData.humidity}%</span></div>
              <div class="summary-item"><strong>Phosphorus levels</strong><span>${inputData.soilData.phosphorus} kg/ha</span></div>
              <div class="summary-item"><strong>Precipitation</strong><span>${inputData.weatherData.rainfall}mm</span></div>
              <div class="summary-item"><strong>Potassium levels</strong><span>${inputData.soilData.potassium} kg/ha</span></div>
              <div class="summary-item"><strong>Active Season</strong><span>${inputData.weatherData.season}</span></div>
            </div>
          </div>

          <div class="section">
            <h2>Optimal Crop Pathfinding</h2>
            ${recommendations.recommendations
              .map(
                (crop, index) => `
              <div class="crop-card">
                <div class="crop-header">
                  <div class="crop-number">${index + 1}</div>
                  <div class="crop-title">${crop.cropName}</div>
                  <div class="score-badge">${crop.suitabilityScore}% Match</div>
                </div>
                
                <div class="crop-details">
                  <div class="detail-section">
                    <h4>Cultivation Dynamics</h4>
                    <div class="detail-item">
                      <span class="detail-label">Maturity Window</span>
                      <span class="detail-value">${crop.growingPeriod}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Hydration Demand</span>
                      <span class="detail-value">${crop.waterRequirement}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Projected Yield</span>
                      <span class="detail-value">${crop.expectedYield} tons/acre</span>
                    </div>
                  </div>
                  
                  <div class="detail-section">
                    <h4>Nutrient Protocol</h4>
                    ${
                      crop.fertilizer.length > 0
                        ? crop.fertilizer.map((fert) => `<div class="detail-item">• <span class="detail-value">${fert}</span></div>`).join("")
                        : '<div class="detail-item">Standard nutrient protocol</div>'
                    }
                  </div>
                  
                  <div class="detail-section tips">
                    <h4>Intelligence Insights</h4>
                    <ul>
                      ${crop.tips
                        .map((tip) => `<li>${tip}</li>`)
                        .join("")}
                    </ul>
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="footer">
            <p>This report utilized advanced neural networks for predictive soil-to-crop matching.</p>
            <p>&copy; ${new Date().getFullYear()} CropWise AI Systems. All rights reserved.</p>
          </div>
        </body>
        </html>
      `

      const blob = new Blob([htmlContent], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `CropWise-AI-Insights-${new Date().toISOString().split("T")[0]}.doc`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating report:", error)
      showAlert.error("System Error", "The intelligence report could not be compiled at this time.")
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

      const savedRecommendations = JSON.parse(localStorage.getItem("savedRecommendations") || "[]")
      savedRecommendations.unshift(recommendationData)
      localStorage.setItem("savedRecommendations", JSON.stringify(savedRecommendations))

      setIsSaved(true)
      showAlert.success("Archived", "The analysis has been successfully recorded in your history.")
    } catch (error) {
      console.error("Error saving record:", error)
      showAlert.error("Storage Error", "Could not commit the analysis to permanent storage.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingAnimation message="Compiling intelligence results..." />
      </div>
    )
  }

  if (!recommendations || !inputData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-sans">
        <div className="text-center p-12 bg-card rounded-[3rem] border border-white/5 shadow-2xl">
          <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4 uppercase tracking-tight">No Data Available</h2>
          <p className="text-muted-foreground mb-8 text-lg">We couldn't find any recent analysis data to display.</p>
          <Button asChild className="rounded-full px-10 h-14 font-bold">
            <Link to="/recommend">Initialize Analysis</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans pb-32">
      {/* Immersive Hero Section */}
      <section className="relative h-[45vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Results Background" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <Header transparent />

        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-16">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-xs">
                  <Brain className="w-3.5 h-3.5 mr-2" /> AI Validated
                </Badge>
                <div className="w-[1px] h-4 bg-white/20" />
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {new Date(recommendations.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-white font-display text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">
                Agricultural <br /> Optimization
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 max-w-6xl -mt-20 relative z-20">
        {/* Environmental Signature Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "Soil pH", value: inputData.soilData.ph, icon: "pH", color: "bg-primary" },
            { label: "Thermal", value: `${inputData.weatherData.temperature}°C`, icon: <TrendingUp className="w-4 h-4" />, color: "bg-orange-500" },
            { label: "Hydration", value: `${inputData.weatherData.rainfall}mm`, icon: <Droplets className="w-4 h-4" />, color: "bg-blue-500" },
            { label: "Atmosphere", value: `${inputData.weatherData.humidity}%`, icon: "H", color: "bg-indigo-500" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 ${stat.color} text-black rounded-lg flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{stat.label}</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-display font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Results Grid */}
        <motion.div 
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-display font-bold uppercase tracking-tight">Optimal Matches</h3>
            <div className="hidden md:flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span className="text-primary">Ranked</span> by Suitability Index
            </div>
          </div>

          {recommendations.recommendations.map((crop, index) => {
            const Icon = getCropIcon(crop.cropName)
            return (
              <motion.div key={crop.cropName} variants={itemVariants}>
                <Card className="overflow-hidden border-white/5 bg-card/40 backdrop-blur-xl group hover:border-primary/40 transition-all duration-700 rounded-[3rem]">
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="flex items-center gap-8">
                        <div className="relative">
                          <div className="w-24 h-24 bg-card border border-white/10 rounded-[2rem] flex items-center justify-center relative z-10 group-hover:border-primary/40 transition-all duration-500">
                            <Icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-black rounded-xl flex items-center justify-center font-black text-lg border-4 border-background z-20">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-3xl md:text-5xl font-display font-bold mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">{crop.cropName}</h4>
                          <div className="flex items-center gap-4">
                            <Badge className={`${getSuitabilityColor(crop.suitabilityScore)} font-black uppercase tracking-widest text-[10px] rounded-full px-4 py-1 border`}>
                              {getSuitabilityLabel(crop.suitabilityScore)} {crop.suitabilityScore}%
                            </Badge>
                            <span className="text-muted-foreground text-sm font-light">Yield: <span className="text-foreground font-bold">{crop.expectedYield}</span> tons/acre</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                         <div className="text-right hidden md:block">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Maturity Window</div>
                            <div className="text-2xl font-display font-bold text-primary">{crop.growingPeriod}</div>
                         </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Suitability Index</span>
                            <span className="text-sm font-black text-primary">{crop.suitabilityScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${crop.suitabilityScore}%` }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3 py-4 border-b border-white/5">
                            <Clock className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</p>
                               <p className="font-bold text-foreground/80">{crop.growingPeriod}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 py-4 border-b border-white/5">
                            <Droplets className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Hydration</p>
                               <p className="font-bold text-foreground/80">{crop.waterRequirement}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h5 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
                          <Leaf className="w-4 h-4" /> Nutrient Protocol
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {crop.fertilizer.map((fert, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white/5 border-white/10 text-xs font-bold rounded-xl py-2 px-4 group-hover:border-primary/20 transition-all">
                              {fert}
                            </Badge>
                          ))}
                        </div>
                        {crop.riskFactors && crop.riskFactors.length > 0 && (
                          <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem]">
                            <h6 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-red-500 mb-4">
                              <AlertTriangle className="w-4 h-4" /> Risk Assessment
                            </h6>
                            <ul className="space-y-2 text-sm text-red-100/60 font-medium">
                              {crop.riskFactors.map((risk, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="lg:border-l lg:border-white/5 lg:pl-12 space-y-6">
                        <h5 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
                          <Lightbulb className="w-4 h-4" /> Professional Tips
                        </h5>
                        <ul className="space-y-4">
                          {crop.tips.slice(0, 3).map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-4 group/tip">
                              <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover/tip:bg-primary transition-colors">
                                <ChevronRight className="w-3.5 h-3.5 text-primary group-hover/tip:text-black transition-colors" />
                              </div>
                              <span className="text-sm font-light leading-relaxed text-muted-foreground group-hover/tip:text-foreground transition-colors">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Global Action Terminal */}
        <motion.div 
          className="mt-24 p-12 md:p-16 bg-card/40 backdrop-blur-2xl border border-white/5 rounded-[4rem] text-center relative overflow-hidden group"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-3xl md:text-5xl font-display font-bold mb-12 uppercase tracking-tight relative z-10">Analysis Terminal</h3>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
            {!isSaved ? (
              <Button
                onClick={handleSaveRecommendation}
                disabled={isSaving}
                className="h-16 px-12 rounded-full font-bold bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black transition-all flex items-center gap-3"
              >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <History className="w-5 h-5" />}
                Archive Analysis
              </Button>
            ) : (
              <Button disabled className="h-16 px-12 rounded-full font-bold bg-primary/10 border border-primary/20 text-primary opacity-80 flex items-center gap-3">
                <History className="w-5 h-5" /> Analysis Recorded
              </Button>
            )}

            <Button onClick={handleDownloadReport} disabled={isGeneratingPDF} className="h-16 px-12 rounded-full font-bold bg-primary text-black hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-primary/20">
              {isGeneratingPDF ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Generate Report
            </Button>

            <Button asChild variant="outline" className="h-16 px-12 rounded-full font-bold border-white/10 bg-white/5 hover:bg-white/10 transition-all">
              <Link to="/recommend" className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5" /> Reset Analysis
              </Link>
            </Button>
          </div>

          <p className="mt-12 text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] font-display opacity-40">
            Advanced Predictive Environmental Mapping v4.0.2
          </p>
        </motion.div>
      </main>

      <footer className="bg-background border-t border-border py-20 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm font-light italic leading-relaxed max-w-2xl mx-auto">
            These AI-enhanced recommendations utilize neural networks and historical agricultural datasets. 
            For exact field implementation, consult your regional agricultural advisor.
          </p>
          <p className="mt-8 text-muted-foreground text-lg uppercase font-bold tracking-widest font-display">
            &copy; {new Date().getFullYear()} CropWise AI Systems
          </p>
        </div>
      </footer>
    </div>
  )
}

