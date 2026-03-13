import { motion } from "framer-motion"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
  textColor?: string
}

export function Logo({ className, iconSize = 32, textSize = "text-2xl", textColor = "text-foreground" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      <div className="relative flex items-center justify-center">
        {/* The Leaf Icon with a subtle "Organic Glow" */}
        <motion.div
          initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Leaf 
            size={iconSize} 
            className="text-primary fill-primary/10" 
            strokeWidth={2.5} 
          />
        </motion.div>
        
        {/* Background glow for premium texture */}
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10" />
      </div>

      <div className="flex flex-col leading-none">
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn("font-display font-black tracking-tight flex items-baseline gap-1.5 whitespace-nowrap", textSize, textColor)}
        >
          <span>CropWise</span>
          
          <span className="relative inline-block italic">
            AI
            {/* The "Nature Bar" Underline - Short and thick as seen in ref */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: "circOut" }}
              className="absolute -bottom-1 right-0 left-0 h-2 bg-primary rounded-sm shadow-[0_4px_12px_rgba(var(--primary),0.2)]"
            />
          </span>
        </motion.div>
      </div>
    </div>
  )
}
