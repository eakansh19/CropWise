import { motion, Variants } from "framer-motion"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ClipboardList, BrainCircuit, CheckCircle2, ArrowRight } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Input Your Data",
      description: "Provide essential information about your farm including soil composition (N, P, K levels) and local climatic conditions.",
      icon: <ClipboardList className="h-10 w-10 text-primary" />,
      details: ["Easy-to-use sliders", "Real-time validation", "Support for all soil types"]
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our advanced machine learning engine processes your signature against millions of agricultural data points.",
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      details: ["Neural network processing", "Ensemble learning", "Data-driven accuracy"]
    },
    {
      number: "03",
      title: "Get Recommendations",
      description: "Receive a comprehensive report with suitable crops, yield estimates, and actionable agricultural tips.",
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      details: ["Exportable reports", "Historical tracking", "Growing tips"]
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary selection:text-black pb-32">
      <Header transparent />
      
      {/* Immersive Hero Section */}
      <section className="relative h-[65vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Process Background" 
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
                The Methodology
              </span>
              <h2 className="text-white font-display text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                How It <br /> Works
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
      
      <main className="container mx-auto px-6 py-24 max-w-7xl relative z-20">
        <motion.div 
          className="space-y-48 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-[1px] bg-white/10 -z-0" />

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className={`flex flex-col md:flex-row gap-16 items-center relative z-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              variants={itemVariants}
            >
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative group">
                  <div className="w-48 h-48 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4rem] flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-700">
                    <div className="text-primary scale-125">
                      {step.icon}
                    </div>
                    <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary text-black rounded-3xl flex items-center justify-center text-xl font-black border-4 border-[#050505]">
                      {step.number}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full -z-0 group-hover:bg-primary/20 transition-all duration-700 opacity-60" />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-xl md:text-2xl text-white/40 leading-relaxed mb-12 font-medium font-display tracking-tight">
                  {step.description}
                </p>
                <div className="grid gap-6">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-6 bg-white/[0.02] px-8 py-5 rounded-[2rem] border border-white/5 group/detail hover:border-primary/20 transition-all duration-500">
                      <div className="w-2.5 h-2.5 bg-primary/40 rounded-full group-hover/detail:bg-primary transition-colors" />
                      <span className="text-lg font-bold uppercase tracking-widest text-white/20 group-hover/detail:text-white/60 transition-colors">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-60 p-16 md:p-32 rounded-[4rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <span className="text-primary font-display font-black tracking-[0.6em] uppercase text-[10px] mb-8 block relative z-10">
            System Ready
          </span>
          <h3 className="text-5xl md:text-8xl font-display font-bold text-white mb-12 uppercase tracking-tighter leading-none relative z-10">Ready for <br /> Smarter Harvests?</h3>
          <p className="text-white/40 text-xl md:text-2xl mb-16 max-w-2xl mx-auto relative z-10 font-medium font-display tracking-tight leading-relaxed">
            Join the digital revolution in farming and start making smarter, data-driven decisions for your harvest.
          </p>
          <Button asChild size="lg" className="h-20 px-16 bg-primary text-black font-black text-xs tracking-[0.2em] uppercase rounded-full hover:scale-105 active:scale-95 transition-all relative z-10 shadow-2xl shadow-primary/20">
            <Link to="/recommend" className="flex items-center gap-4">
              Connect to Intelligence <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
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

