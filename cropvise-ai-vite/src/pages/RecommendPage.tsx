import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, HelpCircle } from "lucide-react"
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
    <div className="min-h-screen bg-background font-sans pb-24">
      {/* Immersive Hero Section */}
      <section className="relative h-[45vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Analysis Background" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <Header transparent />

        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-display font-bold tracking-[0.4em] uppercase text-sm mb-4 block">
                Analysis Engine
              </span>
              <h2 className="text-white font-display text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">
                Soil & Climate <br /> Profiling
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 max-w-5xl -mt-24 relative z-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Card className="border-white/5 bg-card/50 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="mb-12">
                <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight">Environmental Parameters</h3>
                <p className="text-muted-foreground text-lg font-light leading-relaxed">
                  Enter your local agricultural data below. Our AI uses these metrics to identify the absolute best crop matches for your specific plot.
                </p>
              </div>

              {/* Form Section */}
              <CropInputForm
                soilData={soilData}
                weatherData={weatherData}
                onSoilChange={setSoilData}
                onWeatherChange={setWeatherData}
              />

              {/* Submit Button */}
              <div className="mt-16 flex flex-col items-center gap-6">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!isFormValid() || isLoading} 
                  size="lg" 
                  className={`h-16 px-16 rounded-full text-lg font-bold transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 ${isFormValid() ? 'bg-primary text-black' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" /> Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Start Intelligence Analysis <Sparkles className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                {!isFormValid() && (
                  <p className="text-sm text-primary/60 font-medium uppercase tracking-widest italic animate-pulse">
                    Please complete all parameters to begin analysis
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Loading Overlay */}
        {isLoading && <LoadingOverlay message="AI is architecting your crop recommendations..." />}

        {/* Help Section */}
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-muted/10 border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-colors">
            <CardContent className="p-8 flex items-start gap-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg mb-2 uppercase tracking-wide">Need technical assistance?</h4>
                <p className="text-muted-foreground leading-relaxed font-light">
                  If you don't have precise soil test results, we recommend contacting your local agricultural extension or using a consumer-grade pH meter. For weather parameters, refer to local meteorological data for the current season.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="bg-background border-t border-border py-20 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Leading the way in AI-enhanced agriculture. <br />
            &copy; {new Date().getFullYear()} CropWise AI.
          </p>
        </div>
      </footer>
    </div>
  )
}

