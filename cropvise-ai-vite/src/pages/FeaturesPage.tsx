import { motion, Variants } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Leaf, Users, Shield, Zap, Globe, Cpu, Database, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Link } from "react-router-dom"

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

export default function FeaturesPage() {
  const features = [
    {
      title: "Data-Driven Insights",
      description: "Advanced machine learning algorithms analyze soil nutrients and weather patterns.",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
    },
    {
      title: "Sustainable Farming",
      description: "Optimize resource usage and promote eco-friendly agricultural practices.",
      icon: <Leaf className="h-8 w-8 text-primary" />,
    },
    {
      title: "Farmer-Friendly",
      description: "Simple, intuitive interface designed for farmers of all technical backgrounds.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Reliable Results",
      description: "Built on proven science and validated with real-world farming data.",
      icon: <Shield className="h-8 w-8 text-primary" />,
    },
    {
      title: "Real-time Processing",
      description: "Get instant recommendations as soon as you provide your data.",
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
    {
      title: "Global Accessibility",
      description: "Accessible platform supporting various regional soil types and weather.",
      icon: <Globe className="h-8 w-8 text-primary" />,
    },
    {
      title: "AI Optimization",
      description: "Neural networks that learn and improve over time for accurate suggestions.",
      icon: <Cpu className="h-8 w-8 text-primary" />,
    },
    {
      title: "Secure History",
      description: "Past reports are securely stored, allowing you to track progress over time.",
      icon: <Database className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Immersive Hero Section */}
      <section className="relative h-[60vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Features Background" 
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
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
                Platform Capabilities
              </span>
              <h2 className="text-white font-display text-5xl md:text-7xl font-bold tracking-tight uppercase mb-6">
                Redefining <br /> Agriculture
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-24">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full group hover:border-primary/40 transition-all duration-500 bg-card/40 backdrop-blur-xl border-white/5">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10 transition-transform group-hover:scale-110 group-hover:bg-primary/10 duration-500">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-32 p-12 rounded-[2.5rem] bg-muted/30 border border-white/5 relative overflow-hidden group text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <h3 className="text-3xl md:text-5xl font-display font-bold mb-8 relative z-10">Experience the Future Today</h3>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join the digital revolution in farming and start making smarter, data-driven decisions for your harvest.
          </p>
          <Link 
            to="/recommend" 
            className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all relative z-10"
          >
            Start Your Journey <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </main>

      <footer className="bg-background border-t border-border py-20 px-6 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-lg">&copy; {new Date().getFullYear()} CropWise AI. Empowering a sustainable future.</p>
        </div>
      </footer>
    </div>
  )
}

