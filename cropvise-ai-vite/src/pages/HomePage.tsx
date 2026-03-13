import { motion, Variants } from "framer-motion"
import { Link } from "react-router-dom"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Shield, History, Facebook, Twitter, Instagram, ArrowRight } from "lucide-react"
import { Logo } from "@/components/ui/logo"

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden font-sans selection:bg-primary selection:text-black">
      {/* Immersive Hero Section */}
      <section className="relative h-screen w-full flex flex-col overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/landing-bg.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        <Header transparent />

        <div className="relative z-10 flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              <span className="text-white/60 font-display text-sm md:text-base font-bold tracking-[0.6em] uppercase mb-6">
                AI-Powered Precision
              </span>
              <h2 className="text-white font-display text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
                Crop Insights
              </h2>
              {/* Signature Underline - matching logo */}
              <motion.div 
                className="h-2 w-32 bg-primary mb-12 rounded-sm shadow-[0_4px_20px_rgba(var(--primary),0.4)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </motion.div>
            
            <motion.p 
              className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Make data-driven decisions about what crops to grow based on your soil conditions, weather patterns, and farm characteristics. Maximize your yield with intelligent recommendations.
            </motion.p>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link 
                to="/recommend" 
                className="group relative px-12 py-4 border border-white/20 rounded-full text-white text-sm font-bold tracking-[0.2em] uppercase overflow-hidden transition-all hover:border-primary/50 hover:bg-white/5 active:scale-95"
              >
                <span className="relative z-10">Start Recommendation</span>
                <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 opacity-40">
           <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white" />
        </div>
      </section>

      {/* Capabilities Section */}
      <motion.section 
        id="features" 
        className="py-32 px-4 bg-[#050505] relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-12 border-b border-white/5 pb-16">
            <div className="flex-1">
              <motion.span className="text-primary font-display font-black tracking-[0.3em] uppercase text-xs mb-6 block" variants={itemVariants}>
                Our Capabilities
              </motion.span>
              <motion.h3 
                className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter leading-[1]"
                variants={itemVariants}
              >
                Intelligent Precision for <br /> every harvest.
              </motion.h3>
            </div>
            <motion.p className="text-white/40 text-xl max-w-sm mb-2 font-medium" variants={itemVariants}>
              We combine deep agricultural expertise with cutting-edge AI to transform how you grow.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, title: "Data Insights", desc: "Advanced ML models analyze soil and weather for precise recommendations." },
              { icon: History, title: "Sustainable", desc: "Optimize resources and promote eco-friendly agricultural practices." },
              { icon: Users, title: "User Friendly", desc: "Simple interface designed for farmers of all technical backgrounds." },
              { icon: Shield, title: "Reliability", desc: "Built on proven science and validated with real-world farming data." }
            ].map((f, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-700 group p-4">
                  <CardHeader className="pb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-0 border border-primary/20 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-black duration-500">
                      <f.icon className="h-6 w-6 text-primary group-hover:text-black transition-colors" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-2xl font-display font-bold text-white mb-4">{f.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-white/40 font-medium">
                      {f.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section 
        id="how-it-works" 
        className="py-32 px-4 bg-black relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="container mx-auto">
          <div className="text-center mb-32">
            <motion.span className="text-primary font-display font-black tracking-[0.4em] uppercase text-xs mb-6 block" variants={itemVariants}>
              Process
            </motion.span>
            <motion.h3 
              className="text-5xl md:text-8xl font-display font-bold text-white tracking-tighter mb-8"
              variants={itemVariants}
            >
              Three Steps to Success
            </motion.h3>
          </div>

          <div className="grid md:grid-cols-3 gap-24 relative">
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-white/10 -z-0" />
            
            {[
              { step: "01", title: "Data Input", desc: "Enter soil test results and local weather through our simple form." },
              { step: "02", title: "AI Analysis", desc: "Our models process data against thousands of agricultural patterns." },
              { step: "03", title: "Impact", desc: "Receive personalized suggestions with yield predictions and tips." }
            ].map((s, i) => (
              <motion.div key={i} className="relative z-10 text-center" variants={itemVariants}>
                <div className="w-20 h-20 bg-background border-2 border-primary/20 text-white rounded-full flex items-center justify-center text-3xl font-display font-bold mx-auto mb-10 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-black duration-700 shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                  {s.step}
                </div>
                <h4 className="text-3xl font-display font-bold text-white mb-6 uppercase tracking-tight">{s.title}</h4>
                <p className="text-white/40 text-lg leading-relaxed max-w-xs mx-auto font-medium">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-40 px-4 bg-primary relative overflow-hidden group"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Subtle texture background */}
        <div className="absolute inset-0 bg-black opacity-10 mix-blend-overlay" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h3 
            className="text-6xl md:text-9xl font-display font-black text-black mb-8 tracking-tighter uppercase leading-[0.85]"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            Ready to <br /> Transform Your Farm?
          </motion.h3>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mt-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button size="lg" variant="secondary" asChild className="h-16 px-16 text-sm font-bold tracking-widest uppercase rounded-full bg-black text-white hover:bg-black/90 hover:scale-105 transition-all shadow-2xl">
              <Link to="/recommend">Start Your Journey <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 py-32 px-4 selection:bg-primary selection:text-black">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="mb-10 block">
                <Logo textColor="text-white" textSize="text-3xl" />
              </Link>
              <p className="text-white/40 text-lg leading-relaxed max-w-sm font-medium">
                Empowering modern agriculture with intelligent insights and sustainable growth patterns.
              </p>
            </div>
            <div>
              <h5 className="font-display font-black text-white text-xs tracking-widest uppercase mb-10">Navigation</h5>
              <ul className="space-y-6 text-white/40 font-bold text-sm uppercase tracking-wider">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                <li><Link to="/recommend" className="hover:text-primary transition-colors">Recommendation</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display font-black text-white text-xs tracking-widest uppercase mb-10">Connect</h5>
              <div className="flex gap-8 text-white/40">
                <Facebook className="hover:text-primary transition-colors cursor-pointer h-6 w-6" />
                <Twitter className="hover:text-primary transition-colors cursor-pointer h-6 w-6" />
                <Instagram className="hover:text-primary transition-colors cursor-pointer h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-xs text-white/20 flex flex-col md:flex-row justify-between gap-8 font-bold uppercase tracking-widest">
            <div>&copy; {new Date().getFullYear()} CropWise AI. All rights reserved.</div>
            <div className="flex gap-12">
              <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
