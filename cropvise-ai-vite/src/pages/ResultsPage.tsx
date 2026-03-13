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
    <div className="min-h-screen bg-[#050505] font-sans pb-32 selection:bg-primary selection:text-black">
      <Header transparent />
      
      {/* Immersive Hero Section */}
      <section className="relative h-[50vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Results Background" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-32">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
                  <Brain className="w-3.5 h-3.5 mr-2" /> Neural Validated
                </Badge>
                <div className="w-[1px] h-4 bg-white/20" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                  {new Date(recommendations.timestamp).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-white font-display text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                Agricultural <br /> Optimization
              </h1>
              {/* Signature Underline */}
              <motion.div 
                className="h-2 w-32 bg-primary mx-auto rounded-sm shadow-[0_4px_20px_rgba(var(--primary),0.4)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 max-w-7xl -mt-24 relative z-20">
        {/* Environmental Signature Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
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
              <Card className="bg-white/[0.03] backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-700 group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-8 h-8 ${stat.color} text-black rounded-lg flex items-center justify-center text-[9px] font-black group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-primary transition-colors">{stat.label}</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-display font-bold text-white tracking-tighter leading-none">{stat.value}</p>
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
          <div className="flex items-baseline justify-between border-b border-white/5 pb-8">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-tighter leading-none">Optimal Recommendations</h3>
            <div className="hidden md:flex items-center gap-4 text-xs font-black text-white/20 uppercase tracking-[0.4em]">
              <span className="text-primary">Ranked By</span> Neural Suitability Index
            </div>
          </div>

          {recommendations.recommendations.map((crop, index) => {
            const Icon = getCropIcon(crop.cropName)
            return (
              <motion.div key={crop.cropName} variants={itemVariants}>
                <Card className="overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-3xl group hover:border-primary/30 transition-all duration-700 rounded-[2.5rem]">
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="flex items-center gap-8">
                        <div className="relative">
                          <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-[1.5rem] flex items-center justify-center relative z-10 group-hover:border-primary/30 transition-all duration-700">
                            <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-black rounded-xl flex items-center justify-center font-black text-lg border-4 border-[#050505] z-20">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{crop.cropName}</h4>
                          <div className="flex items-center gap-6">
                            <Badge className={`${getSuitabilityColor(crop.suitabilityScore)} font-black uppercase tracking-[0.2em] text-[9px] rounded-full px-4 py-1.5 border`}>
                              {getSuitabilityLabel(crop.suitabilityScore)} {crop.suitabilityScore}%
                            </Badge>
                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Yield: <span className="text-white">{crop.expectedYield}</span> tons/acre</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                         <div className="text-right hidden md:block">
                            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-3">Maturity Window</div>
                            <div className="text-3xl font-display font-bold text-primary tracking-tighter">{crop.growingPeriod}</div>
                         </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Confidence Index</span>
                            <span className="text-xs font-black text-primary tracking-widest">{crop.suitabilityScore}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${crop.suitabilityScore}%` }}
                              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="flex items-center gap-4 py-4 border-b border-white/5">
                            <Clock className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Cycle Duration</p>
                               <p className="font-bold text-white/80 text-base tracking-tight">{crop.growingPeriod}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 py-4 border-b border-white/5">
                            <Droplets className="w-5 h-5 text-primary" />
                            <div className="flex-1">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Hydration Index</p>
                               <p className="font-bold text-white/80 text-base tracking-tight">{crop.waterRequirement}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <h5 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                          <Leaf className="w-4 h-4" /> Optimization Protocol
                        </h5>
                        <div className="flex flex-wrap gap-4">
                          {crop.fertilizer.map((fert, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white/5 border-white/10 text-[10px] text-white font-black uppercase tracking-widest rounded-xl py-3 px-6 hover:border-primary/40 transition-all hover:bg-white/[0.08]">
                              {fert}
                            </Badge>
                          ))}
                        </div>
                        {crop.riskFactors && crop.riskFactors.length > 0 && (
                          <div className="mt-10 p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
                            <h6 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-6">
                              <AlertTriangle className="w-4 h-4" /> Risk Assessment
                            </h6>
                            <ul className="space-y-3 text-sm text-red-200/40 font-bold uppercase tracking-widest">
                              {crop.riskFactors.map((risk, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="w-1.5 h-1.5 bg-red-500/40 rounded-full mt-1.5" />
                                  <span className="flex-1 leading-relaxed">{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="lg:border-l lg:border-white/5 lg:pl-16 space-y-8">
                        <h5 className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                          <Lightbulb className="w-4 h-4" /> Intelligent Insights
                        </h5>
                        <ul className="space-y-4">
                          {crop.tips.slice(0, 3).map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-4 group/tip">
                              <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/tip:bg-primary transition-all duration-500">
                                <ChevronRight className="w-3 h-3 text-white group-hover/tip:text-black transition-colors" />
                              </div>
                              <span className="text-base font-medium leading-relaxed text-white/40 group-hover/tip:text-white transition-colors duration-500">{tip}</span>
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
          className="mt-32 p-16 md:p-24 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[4rem] text-center relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-[10px] mb-8 block relative z-10">
            Action Terminal
          </span>
          <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-12 uppercase tracking-tighter leading-none relative z-10">Archive & <br /> Export Data</h3>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center relative z-10">
            {!isSaved ? (
              <Button
                onClick={handleSaveRecommendation}
                disabled={isSaving}
                className="h-20 px-16 rounded-full font-black text-xs tracking-[0.2em] uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center gap-4"
              >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <History className="w-5 h-5" />}
                Archive Analysis
              </Button>
            ) : (
              <Button disabled className="h-20 px-16 rounded-full font-black text-xs tracking-[0.2em] uppercase bg-primary/10 border border-primary/20 text-primary opacity-80 flex items-center gap-4">
                <History className="w-5 h-5" /> Intelligence Logged
              </Button>
            )}

            <Button onClick={handleDownloadReport} disabled={isGeneratingPDF} className="h-20 px-16 rounded-full font-black text-xs tracking-[0.2em] uppercase bg-primary text-black hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
              {isGeneratingPDF ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Generate Intelligence Report
            </Button>

            <Button asChild variant="outline" className="h-20 px-16 rounded-full font-black text-xs tracking-[0.2em] uppercase border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white">
              <Link to="/recommend" className="flex items-center gap-4">
                <RefreshCw className="w-5 h-5" /> New Session
              </Link>
            </Button>
          </div>

          <div className="mt-20 pt-12 border-t border-white/5">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] font-display">
              Advanced Neural Environmental Mapping Engine v6.1.4
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-32 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto mb-10">
            Predictive analytics based on deep-mesh agricultural datasets. 
            Implementation should be verified against real-time field sensors.
          </p>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.8em] font-display">
            &copy; {new Date().getFullYear()} CropWise Intelligence Network
          </p>
        </div>
      </footer>
    </div>
  )
}

