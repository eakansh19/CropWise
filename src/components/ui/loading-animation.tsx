import { motion } from "framer-motion"
import { Leaf } from "lucide-react"

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg" | "xl"
  message?: string
}

export function LoadingAnimation({ size = "md", message }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }

  const iconSizes = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative">
        {/* Floating particles background (only for larger sizes) */}
        {(size === "lg" || size === "xl") && (
          <div className="absolute inset-0 -z-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-primary/30"
                initial={{ 
                  x: Math.random() * 200 - 100, 
                  y: Math.random() * 200 - 100, 
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                animate={{
                  y: [null, Math.random() * -100 - 50],
                  opacity: [0, 1, 0],
                  rotate: [null, Math.random() * 360 + 180],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                <Leaf size={12 + Math.random() * 12} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Outer pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/10"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* The core growing element */}
        <motion.div
          className={`relative z-10 flex items-center justify-center rounded-full bg-card border-2 border-primary/30 shadow-xl ${sizeClasses[size]}`}
          animate={{
            boxShadow: [
              "0 0 0px var(--primary)",
              "0 0 20px var(--primary)",
              "0 0 0px var(--primary)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{
              rotate: [10, -10, 10],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Leaf size={iconSizes[size]} className="text-primary fill-primary/20" />
          </motion.div>
        </motion.div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-foreground tracking-tight">{message}</p>
          <div className="mt-2 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function LoadingOverlay({ message = "Analyzing conditions..." }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md overflow-hidden"
    >
      <div className="p-8 rounded-3xl bg-card border border-border shadow-2xl relative z-10">
        <LoadingAnimation size="lg" message={message} />
      </div>

      {/* Background stylized field elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 flex items-end justify-around pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            initial={{ height: 0 }}
            animate={{ 
              height: [20, 60, 20],
              rotate: [-5, 5, -5]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
