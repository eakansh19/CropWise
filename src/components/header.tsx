import { Button } from "@/components/ui/button"
import { History, Leaf, Menu, X } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/ui/logo"
import { useState, useEffect } from "react"

export function Header({ transparent = false }: { transparent?: boolean }) {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const isActive = (path: string) => location.pathname === path

  const textColorClass = "text-white/60 hover:text-white transition-colors"
  const activeColorClass = "text-primary font-bold"

  const isFloating = isScrolled || !transparent

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 py-4 pointer-events-none`}
    >
      <div 
        className={`mx-auto max-w-7xl w-full pointer-events-auto transition-all duration-500 rounded-full border-2 border-white/10 bg-transparent py-4 px-4`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo textColor="text-white" textSize="text-2xl" iconSize={32} />
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
            <Button asChild size="sm" className={`rounded-full shadow-lg transition-all active:scale-95 px-6 font-bold uppercase tracking-widest text-[10px] h-9`}>
              <Link to="/recommend">Get Started</Link>
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="text-white rounded-full">
              <Link to="/recommend">
                <Leaf className="h-5 w-5 text-primary" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu overlay"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[80vw] bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="px-6 pt-6 pb-4 border-b border-white/10">
              <Logo textColor="text-white" textSize="text-lg" iconSize={24} />
            </div>
            <nav className="px-6 py-6 flex flex-col gap-5">
              <Link
                to="/features"
                onClick={() => setIsMenuOpen(false)}
                className={`transition-all text-xs tracking-widest uppercase font-bold ${isActive('/features') ? activeColorClass : textColorClass}`}
              >
                Features
              </Link>
              <Link
                to="/how-it-works"
                onClick={() => setIsMenuOpen(false)}
                className={`transition-all text-xs tracking-widest uppercase font-bold ${isActive('/how-it-works') ? activeColorClass : textColorClass}`}
              >
                How It Works
              </Link>
              <Link
                to="/history"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-1.5 transition-all text-xs tracking-widest uppercase font-bold ${isActive('/history') ? activeColorClass : textColorClass}`}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Link>
              <div className="h-px w-full bg-white/10" />
              <Button
                asChild
                size="sm"
                className="rounded-full shadow-lg transition-all active:scale-95 px-6 font-bold uppercase tracking-widest text-[10px] h-9 w-fit"
              >
                <Link to="/recommend" onClick={() => setIsMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
