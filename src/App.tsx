import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AnimatePresence } from "framer-motion"
import HomePage from "@/pages/HomePage"
import RecommendPage from "@/pages/RecommendPage"
import ResultsPage from "@/pages/ResultsPage"
import HistoryPage from "@/pages/HistoryPage"
import { PageTransition } from "@/components/page-transition"
import { CursorTrail } from "@/components/ui/cursor-trail"

import FeaturesPage from "@/pages/FeaturesPage"
import HowItWorksPage from "@/pages/HowItWorksPage"
import { Header } from "@/components/header"

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
        <Route path="/recommend" element={<PageTransition><RecommendPage /></PageTransition>} />
        <Route path="/results" element={<PageTransition><ResultsPage /></PageTransition>} />
        <Route path="/history" element={<PageTransition><HistoryPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><HomePage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cropvise-theme">
      <CursorTrail />
      <Router>
        <Header transparent />
        <AnimatedRoutes />
      </Router>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
