import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, HelpCircle, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { CropInputForm } from "@/components/crop-input-form"
import { Header } from "@/components/header"
import type { SoilData, WeatherData, RecommendationResponse } from "@/lib/types"
import { getRecommendations } from "@/lib/recommendation-service"
import { LoadingOverlay } from "@/components/ui/loading-animation"
import { showAlert } from "@/lib/alerts"
import { motion } from "framer-motion"

export default function RecommendPage() {
  const navigate = useNavigate()
  const [soilData, setSoilData] = useState<Partial<SoilData>>({})
  const [weatherData, setWeatherData] = useState<Partial<WeatherData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const requestData = {
        soilData: soilData as SoilData,
        weatherData: weatherData as WeatherData,
      }

      console.log("[v0] Processing recommendation request:", requestData)

      // Direct service call instead of fetch
      const result: RecommendationResponse = await getRecommendations(requestData)
      console.log("[v0] Received recommendations:", result)

      // Store results in sessionStorage and navigate to results page
      sessionStorage.setItem("cropRecommendations", JSON.stringify(result))
      sessionStorage.setItem("inputData", JSON.stringify(requestData))
      navigate("/results")
    } catch (err) {
      console.error("[v0] Error getting recommendations:", err)
      showAlert.error("Recommendation Error", err instanceof Error ? err.message : "An unexpected error occurred while analyzing your data.")
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
    <div className="min-h-screen bg-[#050505] font-sans pb-32 selection:bg-primary selection:text-black">
      <Header transparent />
      
      <main className="container mx-auto px-6 max-w-4xl pt-32 relative z-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-16">
            <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-[10px] mb-6 block">
              Analysis Engine
            </span>
            <h1 className="text-white font-display text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
              Crop Recommendation
            </h1>
            <p className="text-white/40 text-lg font-medium max-w-2xl mx-auto">
              Provide your soil and climate data to receive AI-driven agricultural insights.
            </p>
          </div>

          <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Form Section */}
              <div className="relative">
                <CropInputForm
                  soilData={soilData}
                  weatherData={weatherData}
                  onSoilChange={setSoilData}
                  onWeatherChange={setWeatherData}
                />
              </div>

              {/* Submit Button */}
              <div className="mt-16 flex flex-col items-center gap-8">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid() || isLoading} 
                  size="lg" 
                  className={`h-20 w-full sm:w-auto px-16 rounded-full text-sm font-black tracking-[0.2em] uppercase transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 ${isFormValid() ? 'bg-primary text-black' : 'bg-white/5 text-white/20'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 animate-spin" /> Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Get Recommendations <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                {!isFormValid() && !isLoading && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em] italic"
                  >
                    Complete all fields to start analysis
                  </motion.p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay message="AI is architecting your crop recommendations..." />}

        {/* Help Section */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all duration-500">
            <CardContent className="p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                <HelpCircle className="w-8 h-8 text-primary group-hover:text-black transition-colors" />
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-xl mb-3 uppercase tracking-tight">Technical Data Assistance</h4>
                <p className="text-white/40 leading-relaxed font-medium text-lg">
                  If precise metrics are unavailable, refer to regional agricultural bulletins or extension reports. Laboratory-grade soil analysis is recommended for maximum predictive accuracy.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-32 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-white/20 text-xs font-black uppercase tracking-[0.5em] mb-8">
            Global Agricultural Intelligence Network
          </p>
          <p className="text-white/40 text-lg leading-relaxed font-medium">
            &copy; {new Date().getFullYear()} CropWise AI Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

