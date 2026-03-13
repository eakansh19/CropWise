import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, BarChart3, Users, Shield, History } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">CropWise AI</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                How It Works
              </Link>
              <Link href="/history" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                <History className="h-4 w-4" />
                History
              </Link>
              <ThemeToggle />
              <Button asChild>
                <Link href="/recommend">Get Started</Link>
              </Button>
            </nav>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            AI-Powered Crop Recommendations for Smarter Farming
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Make data-driven decisions about what crops to grow based on your soil conditions, weather patterns, and
            farm characteristics. Maximize your yield with intelligent recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/recommend">Start Recommendation</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose CropWise AI?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Data-Driven Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced machine learning algorithms analyze soil nutrients, weather patterns, and historical data to
                  provide accurate crop recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Leaf className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Sustainable Farming</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimize resource usage and promote sustainable agricultural practices with recommendations tailored
                  to your specific conditions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Farmer-Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simple, intuitive interface designed for farmers of all technical backgrounds. No complex setup or
                  training required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Reliable Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built on proven agricultural science and validated with real-world farming data to ensure trustworthy
                  recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Input Your Data</h4>
              <p className="text-muted-foreground">
                Enter your soil test results, local weather conditions, and farm details through our simple form
                interface.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">AI Analysis</h4>
              <p className="text-muted-foreground">
                Our machine learning model processes your data against thousands of agricultural patterns and historical
                outcomes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">Get Recommendations</h4>
              <p className="text-muted-foreground">
                Receive personalized crop suggestions with yield predictions, growing tips, and resource requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Optimize Your Harvest?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who are already using AI to make smarter crop decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/recommend">Start Your Recommendation</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/history">View Past Recommendations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CropWise AI. Empowering farmers with intelligent crop recommendations.</p>
        </div>
      </footer>
    </div>
  )
}
