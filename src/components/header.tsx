import { Button } from "@/components/ui/button"
import { History, Leaf } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/ui/logo"
import { useState, useEffect } from "react"

export function Header({ transparent = false }: { transparent?: boolean }) {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  const textColorClass = "text-white/60 hover:text-white transition-colors"
  const activeColorClass = "text-primary font-bold"

  const isFloating = isScrolled || !transparent

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 pt-4 pb-2 pointer-events-none`}
    >
      <div 
        className={`mx-auto max-w-7xl w-full pointer-events-auto transition-all duration-500 rounded-full border border-white/5 
          ${isFloating ? 'bg-black/60 backdrop-blur-xl py-2 px-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/10' : 'bg-transparent py-4 px-4 border-transparent'}
        `}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo textColor="text-white" textSize={isFloating ? "text-lg" : "text-2xl"} iconSize={isFloating ? 24 : 32} />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/features" 
              className={`transition-all text-xs tracking-widest uppercase font-bold ${isActive('/features') ? activeColorClass : textColorClass}`}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className={`transition-all text-xs tracking-widest uppercase font-bold ${isActive('/how-it-works') ? activeColorClass : textColorClass}`}
            >
              How It Works
            </Link>
            <Link 
              to="/history" 
              className={`flex items-center gap-1.5 transition-all text-xs tracking-widest uppercase font-bold ${isActive('/history') ? activeColorClass : textColorClass}`}
            >
              <History className="h-3.5 w-3.5" />
              History
            </Link>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            <ThemeToggle />
            <Button asChild size="sm" className={`rounded-full shadow-lg transition-all active:scale-95 px-6 font-bold uppercase tracking-widest text-[10px] h-9`}>
              <Link to="/recommend">Get Started</Link>
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild className="text-white rounded-full">
              <Link to="/recommend">
                <Leaf className="h-5 w-5 text-primary" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
