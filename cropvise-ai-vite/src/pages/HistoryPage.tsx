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
    <div className="min-h-screen bg-background font-sans">
      {/* Immersive Hero Section */}
      <section className="relative h-[40vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="History Background" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <Header transparent />

        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary font-display font-bold tracking-[0.4em] uppercase text-sm mb-4 block">
                Archive
              </span>
              <h2 className="text-white font-display text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">
                Analysis <br /> History
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 max-w-6xl -mt-20 relative z-20">
        {/* Stats Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
              <CardContent className="pt-8 pb-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-foreground">{stats.totalRecommendations}</p>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Total Reports</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
              <CardContent className="pt-8 pb-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {recommendations.length > 0 ? new Date(recommendations[0].savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "N/A"}
                  </p>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Latest Analysis</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
              <CardContent className="pt-8 pb-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-foreground">
                    {recommendations.length > 0 ? recommendations[0].recommendations.length : 0}
                  </p>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Crops Found</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* List Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-display font-bold">Recent Insights</h3>
            <Button asChild className="rounded-full px-6 py-6 font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Link to="/recommend" className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> New Analysis
              </Link>
            </Button>
          </div>

          {recommendations.length === 0 ? (
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <Card className="border-dashed border-white/10 bg-muted/20 rounded-[2.5rem]">
                <CardContent className="pt-24 pb-24 text-center">
                  <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5">
                      <BarChart3 className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4">No analysis history found</h4>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                    Start your first journey towards optimized farming by creating a new recommendation.
                  </p>
                  <Button asChild size="lg" className="rounded-full px-12 h-14 font-bold">
                    <Link to="/recommend">Start Analysis</Link>
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
                  <Card className="overflow-hidden border-white/5 bg-card/40 backdrop-blur-xl group hover:border-primary/40 transition-all duration-500 rounded-[2.5rem]">
                    <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                          <div className="px-4 py-1.5 bg-primary/10 rounded-full flex items-center gap-2 border border-primary/20">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                              {new Date(rec.savedAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Crop Analysis Report</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3 mb-8">
                          <Badge variant="secondary" className="px-6 py-2 bg-white/5 border-white/5 text-sm font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">pH: {rec.soilData.ph}</Badge>
                          <Badge variant="secondary" className="px-6 py-2 bg-white/5 border-white/5 text-sm font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">{rec.weatherData.temperature}°C</Badge>
                          <Badge variant="secondary" className="px-6 py-2 bg-white/5 border-white/5 text-sm font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">{rec.weatherData.rainfall}mm Rain</Badge>
                          <Badge variant="secondary" className="px-6 py-2 bg-white/5 border-white/5 text-sm font-bold rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">{rec.weatherData.humidity}% Humid</Badge>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl border border-white/5 w-fit">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Top Picks</span>
                          <span className="h-4 w-[1px] bg-white/10 hidden md:block" />
                          <span className="text-base font-bold text-foreground/80">
                            {rec.recommendations
                            .slice(0, 3)
                            .map((r: any) => r.cropName)
                            .join(", ")}
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleViewRecommendation(rec)}
                        className="h-20 w-full md:w-20 rounded-full md:rounded-[2rem] bg-white/5 hover:bg-primary border border-white/10 hover:border-primary text-white hover:text-black transition-all p-0 group flex items-center justify-center overflow-hidden relative"
                      >
                        <ChevronRight className="w-8 h-8 relative z-10 transition-transform group-hover:translate-x-1" />
                        <span className="md:hidden ml-2 font-bold uppercase tracking-widest text-sm relative z-10">View Analysis</span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <footer className="bg-background border-t border-border py-20 px-6 mt-20">
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

