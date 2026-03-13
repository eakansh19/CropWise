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
      
      {/* Immersive Hero Section */}
      <section className="relative h-[65vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Analysis Background" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-32">
          <div className="text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-xs mb-6 block">
                Analysis Engine
              </span>
              <h2 className="text-white font-display text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                Soil & Climate <br /> Profiling
              </h2>
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

      <main className="container mx-auto px-6 max-w-6xl -mt-32 relative z-20">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          <Card className="border-white/5 bg-white/[0.03] backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden">
            <div className="p-8 md:p-16">
              <div className="mb-16 border-b border-white/5 pb-12">
                <h3 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-tighter leading-tight">Environmental Parameters</h3>
                <p className="text-white/40 text-xl font-medium leading-relaxed max-w-3xl">
                  Connect your land's digital signature with our neural prediction engines. Provide the metrics below to architect your optimal cultivation strategy.
                </p>
              </div>

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
              <div className="mt-20 flex flex-col items-center gap-8">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid() || isLoading} 
                  size="lg" 
                  className={`h-20 px-16 rounded-full text-sm font-black tracking-[0.2em] uppercase transition-all shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 ${isFormValid() ? 'bg-primary text-black' : 'bg-white/5 text-white/20'}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 animate-spin" /> Analyzing Biological Signature...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Initialize Intelligence Analysis <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                {!isFormValid() && !isLoading && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em] italic animate-pulse"
                  >
                    Input all parameters to unlock predictive engine
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

