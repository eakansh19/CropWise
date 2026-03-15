import React from "react"
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
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary selection:text-black pb-32">
      
      {/* Immersive Hero Section */}
      <section className="relative h-[65vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Features Background" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-40">
          <div className="text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-[10px] mb-8 block">
                Platform Capabilities
              </span>
              <h1 className="text-white font-display text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                Redefining <br /> Agriculture
              </h1>
              {/* Signature Underline */}
              <motion.div 
                className="h-2 w-32 bg-primary mx-auto rounded-sm shadow-[0_4px_30px_rgba(var(--primary),0.4)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 max-w-7xl -mt-20 relative z-20">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="flex">
              <Card className="flex flex-col w-full group bg-white/[0.03] backdrop-blur-3xl border-white/5 hover:border-primary/30 transition-all duration-700 rounded-[2rem] overflow-hidden">
                <div className="p-8 flex flex-col h-full">
                  {/* Card Header Area */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black duration-500">
                      <div className="text-primary group-hover:text-black transition-colors [&>svg]:h-6 [&>svg]:w-6">
                        {feature.icon}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] group-hover:text-primary transition-colors duration-500">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Text Content Area */}
                  <div className="flex flex-col flex-grow">
                    <CardTitle className="text-xl font-display font-bold text-white mb-4 uppercase tracking-tight group-hover:text-primary transition-colors min-h-[3.5rem] flex items-center">
                      {feature.title}
                    </CardTitle>
                    <div className="h-px w-full bg-white/5 mb-6 group-hover:bg-primary/20 transition-colors duration-500" />
                    <CardDescription className="text-base leading-relaxed text-white/40 font-medium group-hover:text-white/60 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-40 p-12 md:p-20 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-[10px] mb-8 block relative z-10">
            Get Started
          </span>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-10 uppercase tracking-tighter leading-tight relative z-10">Experience the <br /> Future Today</h3>
          <p className="text-white/40 text-lg mb-12 max-w-2xl mx-auto relative z-10 font-medium font-display tracking-tight">
            Join the digital revolution in farming and start making smarter, data-driven decisions for your harvest.
          </p>
          <Link 
            to="/recommend" 
            className="inline-flex items-center gap-4 px-16 py-6 bg-primary text-black font-black text-xs tracking-[0.2em] uppercase rounded-full hover:scale-105 active:scale-95 transition-all relative z-10 shadow-2xl shadow-primary/20"
          >
            Start Your Journey <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </main>

      <footer className="bg-[#050505] border-t border-white/5 py-32 px-6 mt-32">
        <div className="container mx-auto text-center">
          <p className="text-white/20 text-xs font-black uppercase tracking-[0.5em] mb-10">Leading the edge of agricultural intelligence</p>
          <p className="text-white/40 text-lg font-medium leading-none">&copy; {new Date().getFullYear()} CropWise AI Ecosystem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

