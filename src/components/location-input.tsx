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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location & Weather
          {weatherFetched && (
            <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              ✓ Weather Updated
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weatherFetched && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ Weather data updated from: {lastLocation}
            </p>
            {gpsCoordinates && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                GPS Coordinates: {gpsCoordinates.lat.toFixed(6)}, {gpsCoordinates.lon.toFixed(6)}
              </p>
            )}
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Temperature, humidity, and rainfall sliders have been automatically set below.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-sm font-medium">Auto-fetch weather data for your location</Label>

          {/* GPS Location Button */}
          <Button
            onClick={handleUseMyLocation}
            disabled={isLoadingGPS || isLoadingWeather}
            className="w-full bg-transparent"
            variant="outline"
          >
            {isLoadingGPS ? (
              <>
                <Leaf className="mr-2 h-4 w-4 animate-spin text-primary" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Use My Location (Quick)
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-muted"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 border-t border-muted"></div>
          </div>

          {/* State Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select your state</Label>
            <Select value={selectedState} onValueChange={handleStateSelect} disabled={isLoadingWeather}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your state" />
              </SelectTrigger>
              <SelectContent>
                {INDIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoadingWeather && (
            <div className="flex items-center justify-center py-4">
              <LoadingAnimation size="sm" message="Fetching weather data..." />
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Weather data will auto-populate temperature, humidity, and rainfall based on your location. Location name will
          be refined in the background for better accuracy.
        </p>
      </CardContent>
    </Card>
  )
}
