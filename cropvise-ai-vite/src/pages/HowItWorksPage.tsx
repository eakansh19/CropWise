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
    <div className="min-h-screen bg-background font-sans">
      {/* Immersive Hero Section */}
      <section className="relative h-[60vh] w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Process Background" 
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
                The Methodology
              </span>
              <h2 className="text-white font-display text-5xl md:text-7xl font-bold tracking-tight uppercase mb-6">
                How It <br /> Works
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-6 py-24 max-w-6xl">
        <motion.div 
          className="space-y-32 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-[1px] bg-border/50 -z-0" />

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className={`flex flex-col md:flex-row gap-16 items-center relative z-10 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              variants={itemVariants}
            >
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 bg-card border border-border/50 rounded-[2.5rem] flex items-center justify-center text-4xl font-display font-bold shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-700">
                    {step.icon}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center text-lg font-bold border-4 border-background">
                      {step.number}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full -z-0" />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 uppercase tracking-tight">{step.title}</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 font-light">
                  {step.description}
                </p>
                <div className="grid sm:grid-cols-1 gap-4">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-muted/20 px-6 py-4 rounded-2xl border border-white/5 group hover:border-primary/20 transition-colors">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-base font-medium text-muted-foreground group-hover:text-foreground transition-colors">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-40 p-12 md:p-24 rounded-[3rem] bg-primary relative overflow-hidden group text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[url('/landing-bg.jpg')] opacity-10 bg-cover bg-fixed group-hover:scale-110 transition-transform duration-[10s]" />
          <h3 className="text-4xl md:text-6xl font-display font-bold text-black mb-8 relative z-10 tracking-tighter">Ready for Smarter Harvests?</h3>
          <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Join thousands of successful farmers already optimizing their yields with AI-powered precision.
          </p>
          <Button size="lg" variant="secondary" asChild className="h-16 px-12 text-lg font-bold rounded-full hover:scale-105 active:scale-95 transition-all relative z-10 bg-black text-white hover:bg-black/90">
            <Link to="/recommend" className="flex items-center gap-3">
              Start Your Analysis <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </main>

      <footer className="bg-background border-t border-border py-20 px-6">
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

