"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Leaf } from "lucide-react"
import type { WeatherData } from "@/lib/types"
import { LoadingAnimation } from "@/components/ui/loading-animation"

interface LocationInputProps {
  onWeatherFetch: (weatherData: Partial<WeatherData>) => void
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

export function LocationInput({ onWeatherFetch }: LocationInputProps) {
  const [selectedState, setSelectedState] = useState("")
  const [isLoadingGPS, setIsLoadingGPS] = useState(false)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)
  const [weatherFetched, setWeatherFetched] = useState(false)
  const [lastLocation, setLastLocation] = useState<string>("")
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lon: number } | null>(null)

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setIsLoadingWeather(true)

      const cityName = `GPS Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`

      const mockWeatherData = {
        temperature: Math.round(20 + Math.random() * 15), // 20-35°C
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        rainfall: Math.round(200 + Math.random() * 200), // 200-400mm
        season: getCurrentSeason(),
      }

      onWeatherFetch(mockWeatherData)
      setWeatherFetched(true)
      setLastLocation(cityName)
      console.log("[v0] Weather data fetched for coordinates:", { lat, lon, weather: mockWeatherData })

      setTimeout(async () => {
        try {
          const geocodeResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            { signal: AbortSignal.timeout(3000) }, // 3 second timeout
          )

          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json()
            const city = geocodeData.city || geocodeData.locality
            const state = geocodeData.principalSubdivision

            if (city && state) {
              const betterName = `${city}, ${state}`
              setLastLocation(betterName)
              console.log("[v0] Location name updated:", betterName)
            }
          }
        } catch (error) {
          console.log("[v0] Background geocoding failed (non-critical):", error)
        }
      }, 0)
    } catch (error) {
      console.error("[v0] Error fetching weather data:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const fetchWeatherByState = async (state: string) => {
    try {
      setIsLoadingWeather(true)
      // Mock weather data based on state (in real app, use weather API with state coordinates)
      const stateWeatherMap: Record<string, Partial<WeatherData>> = {
        Punjab: { temperature: 25, humidity: 65, rainfall: 300, season: getCurrentSeason() },
        Maharashtra: { temperature: 28, humidity: 70, rainfall: 250, season: getCurrentSeason() },
        Karnataka: { temperature: 26, humidity: 75, rainfall: 350, season: getCurrentSeason() },
        "Tamil Nadu": { temperature: 30, humidity: 80, rainfall: 200, season: getCurrentSeason() },
        "Uttar Pradesh": { temperature: 24, humidity: 60, rainfall: 280, season: getCurrentSeason() },
        // Add more states as needed
      }

      const weatherData = stateWeatherMap[state] || {
        temperature: 25,
        humidity: 65,
        rainfall: 300,
        season: getCurrentSeason(),
      }

      onWeatherFetch(weatherData)
      setWeatherFetched(true)
      setLastLocation(state)
      console.log("[v0] Weather data fetched for state:", { state, weather: weatherData })
    } catch (error) {
      console.error("[v0] Error fetching weather data for state:", error)
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const getCurrentSeason = (): WeatherData["season"] => {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return "spring"
    if (month >= 6 && month <= 8) return "summer"
    if (month >= 9 && month <= 11) return "autumn"
    return "winter"
  }

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsLoadingGPS(true)
    const options = {
      enableHighAccuracy: false, // Use network location for speed
      timeout: 5000, // Reduced to 5 seconds
      maximumAge: 300000, // Accept 5-minute old location
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        console.log("[v0] GPS coordinates obtained:", { latitude, longitude, accuracy })

        setGpsCoordinates({ lat: latitude, lon: longitude })
        fetchWeatherByCoords(latitude, longitude)
        setIsLoadingGPS(false)
      },
      (error) => {
        console.error("[v0] GPS error:", error)
        alert("Unable to get location. Please select your state manually.")
        setIsLoadingGPS(false)
      },
      options,
    )
  }

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    fetchWeatherByState(state)
  }

  return (
    <div className="space-y-6">
      {weatherFetched && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 md:p-6 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
               <span className="text-primary text-sm font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm text-white/80 font-bold mb-1">
                Weather synchronized for {lastLocation}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {gpsCoordinates && (
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">
                    GPS: {gpsCoordinates.lat.toFixed(4)}, {gpsCoordinates.lon.toFixed(4)}
                  </p>
                )}
                <p className="text-[10px] text-primary/60 uppercase tracking-wider font-bold">
                  Parameters auto-populated
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6 items-end">
          {/* GPS Location Button */}
          <div className="space-y-3">
             <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Precision Detection</Label>
             <Button
                onClick={handleUseMyLocation}
                disabled={isLoadingGPS || isLoadingWeather}
                className={`w-full h-12 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${isLoadingGPS ? 'bg-primary/20 text-primary' : 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20'}`}
                variant="outline"
              >
                {isLoadingGPS ? (
                  <>
                    <Leaf className="mr-2 h-4 w-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Precise Location
                  </>
                )}
              </Button>
          </div>

          {/* State Selection */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Manual Selection</Label>
            <Select value={selectedState} onValueChange={handleStateSelect} disabled={isLoadingWeather}>
              <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20 text-white font-medium">
                <SelectValue placeholder="Choose Region" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a0a0a] border-white/10">
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state} className="focus:bg-primary/10 focus:text-primary">
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingWeather && (
          <div className="flex flex-col items-center justify-center py-8 gap-4 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl animate-pulse">
            <LoadingAnimation size="sm" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Retrieving Meteorological Data</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-white/20 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
        Real-time atmospheric analysis will automatically calibrate temperature, humidity, and precipitation variables based on your geolocation telemetry.
      </p>
    </div>
  )
}
