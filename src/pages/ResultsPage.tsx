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
      await showAlert.success("Archived", "The analysis has been successfully recorded in your history.")
    } catch (error) {
      console.error("Error saving record:", error)
      await showAlert.error("Storage Error", "Could not commit the analysis to permanent storage.")
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans">
        <div className="text-center p-12 bg-card rounded-[3rem] border border-white/5 shadow-2xl">
          <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4 uppercase tracking-tight text-white">No Data Available</h2>
          <p className="text-white/40 mb-8 text-lg font-medium">We couldn't find any recent analysis data to display.</p>
          <Button asChild className="rounded-full px-10 h-14 font-bold bg-primary text-black">
            <Link to="/recommend">Initialize Analysis</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary selection:text-black pb-32">
      
      {/* Neural Dossier Hero */}
      <section className="relative h-[35vh] w-full flex flex-col overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Results Background" 
            className="w-full h-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/0 to-[#050505]" />
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-end px-4 sm:px-6 pb-10 sm:pb-12">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="flex flex-col items-start"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 font-mono text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] text-primary/60">
                <Brain className="w-3 h-3" />
                <span>NEURAL_ANALYSIS_COMPLETE // {new Date(recommendations.timestamp).toISOString().split('T')[0]}</span>
              </div>
              <h1 className="text-white font-display text-[clamp(26px,8vw,44px)] sm:text-4xl md:text-5xl font-black tracking-tight uppercase leading-tight mb-2 break-words whitespace-normal max-w-[18ch] sm:max-w-none">
                Agricultural<span className="text-primary">.</span>
                <span className="block sm:inline sm:ml-2">Optimization</span>
              </h1>
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.5em] text-white/20">Environmental Signature Mapping v6.1.4</p>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 max-w-7xl py-10 sm:py-12 relative z-20">
        {/* Environmental Metadata Bar */}
        <motion.div 
          className="flex flex-wrap items-stretch border border-white/10 bg-white/[0.02] mb-12 sm:mb-16 divide-x-0 sm:divide-x divide-white/10 rounded-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "SOIL_PH", value: inputData.soilData.ph, color: "text-primary" },
            { label: "THERMAL_C", value: inputData.weatherData.temperature, color: "text-orange-500" },
            { label: "PRECIPI_MM", value: inputData.weatherData.rainfall, color: "text-blue-500" },
            { label: "HUMID_PCT", value: inputData.weatherData.humidity, color: "text-indigo-500" },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} className="flex-1 min-w-[120px] p-3 sm:p-4 flex flex-col gap-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/30">{stat.label}</span>
              <span className={`font-display text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
            </motion.div>
          ))}
          <div className="w-full sm:flex-[2] p-3 sm:p-4 bg-primary/5 flex items-center justify-between">
             <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-primary/40">COLLECTION_STATUS</span>
                <span className="font-mono text-[10px] font-bold text-primary uppercase">Active_Monitoring</span>
             </div>
             <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(b => (
                  <div key={b} className="w-1 h-3 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: `${b * 0.2}s` }} />
                ))}
             </div>
          </div>
        </motion.div>

        {/* Optimal Recommendation Grid */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {recommendations.recommendations.map((crop, index) => {
            const Icon = getCropIcon(crop.cropName)
            return (
              <motion.div key={crop.cropName} variants={itemVariants}>
                <div className="group relative overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-xl flex flex-col">
                  {/* Card ID Bar */}
                  <div className="px-4 py-1.5 border-b border-white/5 flex items-center justify-between font-mono text-[7px] uppercase tracking-[0.4em] text-white/30">
                    <span>OBJECT_ID: {crop.cropName.toUpperCase().replace(/\s+/g, '_')}_{index + 1}</span>
                    <span className="text-primary/40">SUITABILITY_CONFIRMED</span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-6">
                    {/* Visual Identity Section */}
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center relative shrink-0">
                        <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-primary text-black rounded text-[10px] font-mono font-bold flex items-center justify-center border-2 border-black">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">{crop.cropName}</h4>
                        <div className="flex items-center gap-3">
                          <div className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${getSuitabilityColor(crop.suitabilityScore)}`}>
                            {getSuitabilityLabel(crop.suitabilityScore)} {crop.suitabilityScore}%
                          </div>
                          <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">YIELD_LVL: <span className="text-white/60">{crop.expectedYield} t/a</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Data Grid Section */}
                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-md">
                      <div className="bg-[#0a0a0a] p-3 flex flex-col gap-1">
                        <span className="font-mono text-[7px] uppercase tracking-widest text-white/20">GROWING_PERIOD</span>
                        <span className="font-display text-sm font-bold text-white">{crop.growingPeriod}</span>
                      </div>
                      <div className="bg-[#0a0a0a] p-3 flex flex-col gap-1">
                        <span className="font-mono text-[7px] uppercase tracking-widest text-white/20">WATER_INDEX</span>
                        <span className="font-display text-sm font-bold text-white truncate">{crop.waterRequirement}</span>
                      </div>
                    </div>

                    {/* Optimization Protocol */}
                    <div className="flex flex-wrap gap-2">
                      {crop.fertilizer.map((fert, idx) => (
                        <div key={idx} className="px-2 py-1 bg-white/5 border border-white/5 font-mono text-[8px] text-white/40 uppercase tracking-widest rounded group-hover:border-primary/20 transition-colors">
                          {fert}
                        </div>
                      ))}
                    </div>

                    {/* Insights Accordion (Simplified) */}
                    <div className="space-y-2 mt-2">
                       {crop.tips.slice(0, 2).map((tip, idx) => (
                         <div key={idx} className="flex gap-3 items-start group/tip">
                           <ChevronRight className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                           <p className="text-[10px] text-white/40 leading-relaxed group-hover/tip:text-white/70 transition-colors">{tip}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Global Action Terminal */}
        <motion.div 
          className="mt-20 sm:mt-32 p-8 sm:p-12 md:p-24 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] sm:rounded-[4rem] text-center relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <span className="text-primary font-display font-black tracking-[0.3em] sm:tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-6 sm:mb-8 block relative z-10">
            Action Terminal
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-8 sm:mb-12 uppercase tracking-tighter leading-tight relative z-10">Archive & <br /> Export Data</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10">
            {!isSaved ? (
              <Button
                onClick={handleSaveRecommendation}
                disabled={isSaving}
                className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-16 w-full sm:w-auto rounded-full font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center gap-3 sm:gap-4"
              >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <History className="w-5 h-5" />}
                Archive Analysis
              </Button>
            ) : (
              <Button disabled className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-16 w-full sm:w-auto rounded-full font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase bg-primary/10 border border-primary/20 text-primary opacity-80 flex items-center justify-center gap-3 sm:gap-4">
                <History className="w-5 h-5" /> Intelligence Logged
              </Button>
            )}

            <Button onClick={handleDownloadReport} disabled={isGeneratingPDF} className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-16 w-full sm:w-auto rounded-full font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase bg-primary text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 sm:gap-4 shadow-[0_0_40px_rgba(var(--primary),0.2)]">
              {isGeneratingPDF ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              Generate Intelligence Report
            </Button>

            <Button asChild variant="outline" className="h-12 sm:h-16 md:h-20 px-6 sm:px-10 md:px-16 w-full sm:w-auto rounded-full font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white">
              <Link to="/recommend" className="flex items-center gap-4">
                <RefreshCw className="w-5 h-5" /> New Session
              </Link>
            </Button>
          </div>

          <div className="mt-12 sm:mt-20 pt-10 sm:pt-12 border-t border-white/5">
            <p className="text-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] font-display">
              Advanced Neural Environmental Mapping Engine v6.1.4
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-20 sm:py-32 px-6 mt-20 sm:mt-32">
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
