import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TrendingUp, BarChart3, ChevronRight, PlusCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Header } from "@/components/header"
import { LoadingAnimation } from "@/components/ui/loading-animation"
import { showAlert } from "@/lib/alerts"
import { motion, Variants } from "framer-motion"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    },
  },
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRecommendations: 0,
    uniqueLocations: 0,
    averageFarmSize: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const savedRecommendations = JSON.parse(localStorage.getItem("savedRecommendations") || "[]")
        setRecommendations(savedRecommendations)
        setStats({
          totalRecommendations: savedRecommendations.length,
          uniqueLocations: 1,
          averageFarmSize: 0,
        })
      } catch (err) {
        console.error("[v0] Error loading history data:", err)
        showAlert.error("History Error", "Failed to load your recommendation history. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleViewRecommendation = (recommendation: any) => {
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
    navigate("/results")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingAnimation message="Loading recommendation history..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary selection:text-black pb-32">
      <Header transparent />
      
      {/* Immersive Hero Section */}
      <section className="relative h-[65vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="History Background" 
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
                Archive
              </span>
              <h2 className="text-white font-display text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                Analysis <br /> History
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

      <main className="container mx-auto px-6 py-12 max-w-7xl -mt-32 relative z-20">
        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-700 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-1000" />
              <CardContent className="pt-10 pb-10 flex items-center gap-8">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <TrendingUp className="h-10 w-10 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-5xl font-display font-bold text-white tracking-tighter leading-none mb-2">{stats.totalRecommendations}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Total Reports</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-700 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-1000" />
              <CardContent className="pt-10 pb-10 flex items-center gap-8">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Calendar className="h-10 w-10 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-white tracking-tighter leading-none mb-2">
                    {recommendations.length > 0 ? new Date(recommendations[0].savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "---"}
                  </p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Latest Entry</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/[0.03] backdrop-blur-3xl border-white/5 hover:border-primary/20 transition-all duration-700 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-1000" />
              <CardContent className="pt-10 pb-10 flex items-center gap-8">
                <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <BarChart3 className="h-10 w-10 text-primary group-hover:text-black transition-colors" />
                </div>
                <div>
                  <p className="text-5xl font-display font-bold text-white tracking-tighter leading-none mb-2">
                    {recommendations.length > 0 ? recommendations[0].recommendations.length : 0}
                  </p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em]">Crops Found</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* List Section */}
        <div className="space-y-12">
          <div className="flex items-baseline justify-between border-b border-white/5 pb-12">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tighter leading-none">System Archives</h3>
            <Button asChild className="rounded-full px-10 h-16 bg-primary text-black font-black text-xs tracking-[0.2em] uppercase shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Link to="/recommend" className="flex items-center gap-3">
                <PlusCircle className="w-5 h-5" /> New Analysis
              </Link>
            </Button>
          </div>

          {recommendations.length === 0 ? (
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="border-dashed border-white/10 bg-white/[0.01] rounded-[3rem]">
                <CardContent className="pt-32 pb-32 text-center">
                  <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/5">
                      <BarChart3 className="h-12 w-12 text-white/20" />
                  </div>
                  <h4 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-tighter">No analysis history found</h4>
                  <p className="text-white/40 mb-12 max-w-sm mx-auto text-xl font-medium leading-relaxed">
                    Start your journey towards optimized farming by creating your first system recommendation.
                  </p>
                  <Button asChild className="rounded-full px-12 h-16 font-black text-xs tracking-[0.2em] uppercase">
                    <Link to="/recommend">Start Your Journey</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {recommendations.map((rec) => (
                <motion.div key={rec.id} variants={itemVariants}>
                  <Card className="overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-3xl group hover:border-primary/30 transition-all duration-700 rounded-[3rem]">
                    <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-12">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-6 mb-8">
                          <div className="px-6 py-2 bg-primary/10 rounded-full flex items-center gap-3 border border-primary/20">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                              {new Date(rec.savedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-white/20">
                            <MapPin className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Digital Soil Signature</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mb-10">
                          <Badge variant="secondary" className="px-6 py-3 bg-white/5 border-white/10 text-xs font-black uppercase tracking-widest rounded-xl text-white group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">pH: {rec.soilData.ph}</Badge>
                          <Badge variant="secondary" className="px-6 py-3 bg-white/5 border-white/10 text-xs font-black uppercase tracking-widest rounded-xl text-white group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">{rec.weatherData.temperature}°C Temp</Badge>
                          <Badge variant="secondary" className="px-6 py-3 bg-white/5 border-white/10 text-xs font-black uppercase tracking-widest rounded-xl text-white group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">{rec.weatherData.rainfall}mm Rain</Badge>
                          <Badge variant="secondary" className="px-6 py-3 bg-white/5 border-white/10 text-xs font-black uppercase tracking-widest rounded-xl text-white group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">{rec.weatherData.humidity}% Humidity</Badge>
                        </div>

                        <div className="flex items-center gap-6 p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 w-fit group-hover:border-primary/20 transition-all duration-500">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Top Predictions</span>
                          <span className="h-6 w-[1px] bg-white/10 hidden md:block" />
                          <span className="text-lg font-bold text-white/80 tracking-tight">
                            {rec.recommendations
                            .slice(0, 3)
                            .map((r: any) => r.cropName)
                            .join(", ")}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleViewRecommendation(rec)}
                        className="h-28 w-full md:w-28 rounded-full md:rounded-[2.5rem] bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black transition-all p-0 group flex items-center justify-center overflow-hidden relative shadow-2xl"
                      >
                        <ChevronRight className="w-10 h-10 relative z-10 transition-transform group-hover:translate-x-1" />
                        <span className="md:hidden ml-3 font-black uppercase tracking-[0.2em] text-sm relative z-10">View Analysis</span>
                        <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-32 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-white/40 text-lg leading-relaxed font-medium mb-12">
            Archiving agricultural progress for a sustainable future.
          </p>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.8em]">
            &copy; {new Date().getFullYear()} CropWise AI Archive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

