import { Button } from "@/components/ui/button"
import { History, Leaf } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/ui/logo"

export function Header({ transparent = false }: { transparent?: boolean }) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const textColorClass = "text-white/60 hover:text-white transition-colors"
  const activeColorClass = "text-primary font-bold"

  return (
    <header className={`${transparent ? 'bg-transparent border-none' : 'border-b border-border bg-card backdrop-blur-sm bg-card/80'} sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo textColor={transparent ? "text-white" : "text-foreground"} />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/features" 
              className={`transition-all font-medium ${isActive('/features') ? activeColorClass : textColorClass}`}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className={`transition-all font-medium ${isActive('/how-it-works') ? activeColorClass : textColorClass}`}
            >
              How It Works
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-1 transition-all font-medium ${isActive('/history') ? activeColorClass : textColorClass}`}
            >
              <History className="h-4 w-4" />
              History
            </Link>
            <ThemeToggle />
            <Button asChild className={`shadow-lg transition-all active:scale-95 ${transparent ? 'bg-primary text-black hover:bg-primary/90' : 'shadow-primary/20 hover:shadow-primary/30'}`}>
              <Link to="/recommend">Get Started</Link>
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild className={transparent ? "text-white" : ""}>
              <Link to="/recommend">
                <Leaf className="h-6 w-6 text-primary" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
