"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Thermometer, Calendar } from "lucide-react"
import { LocationInput } from "./location-input"
import type { SoilData, WeatherData } from "@/lib/types"

interface CropInputFormProps {
  soilData: Partial<SoilData>
  weatherData: Partial<WeatherData>
  onSoilChange: (data: Partial<SoilData>) => void
  onWeatherChange: (data: Partial<WeatherData>) => void
}

export function CropInputForm({ soilData, weatherData, onSoilChange, onWeatherChange }: CropInputFormProps) {
  const handleWeatherFetch = (fetchedWeatherData: Partial<WeatherData>) => {
    onWeatherChange({ ...weatherData, ...fetchedWeatherData })
  }

  return (
    <div className="space-y-6">
      <LocationInput onWeatherFetch={handleWeatherFetch} />

      {/* Soil Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Soil Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nitrogen */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Nitrogen (N) - mg/kg
              <span className="text-primary font-semibold">{soilData.nitrogen || 0}</span>
            </Label>
            <Slider
              value={[soilData.nitrogen || 0]}
              onValueChange={(value) => onSoilChange({ ...soilData, nitrogen: value[0] })}
              max={140}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Essential for leaf growth and overall plant development</p>
          </div>

          {/* Phosphorus */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Phosphorus (P) - mg/kg
              <span className="text-primary font-semibold">{soilData.phosphorus || 0}</span>
            </Label>
            <Slider
              value={[soilData.phosphorus || 0]}
              onValueChange={(value) => onSoilChange({ ...soilData, phosphorus: value[0] })}
              max={140}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Important for root development and flowering</p>
          </div>

          {/* Potassium */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Potassium (K) - mg/kg
              <span className="text-primary font-semibold">{soilData.potassium || 0}</span>
            </Label>
            <Slider
              value={[soilData.potassium || 0]}
              onValueChange={(value) => onSoilChange({ ...soilData, potassium: value[0] })}
              max={200}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Helps with disease resistance and fruit quality</p>
          </div>

          {/* pH */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Soil pH
              <span className="text-primary font-semibold">{soilData.ph || 0}</span>
            </Label>
            <Slider
              value={[soilData.ph || 0]}
              onValueChange={(value) => onSoilChange({ ...soilData, ph: value[0] })}
              max={14}
              min={0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Affects nutrient availability (6.0-7.0 is ideal for most crops)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weather Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Weather Conditions
            {(weatherData.temperature || weatherData.humidity || weatherData.rainfall) && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Auto-populated</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Average Temperature (°C)
              <span className="text-primary font-semibold">{weatherData.temperature || 0}°C</span>
            </Label>
            <Slider
              value={[weatherData.temperature || 0]}
              onValueChange={(value) => onWeatherChange({ ...weatherData, temperature: value[0] })}
              max={50}
              min={0}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Average temperature during growing season</p>
          </div>

          {/* Humidity */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Humidity (%)
              <span className="text-primary font-semibold">{weatherData.humidity || 0}%</span>
            </Label>
            <Slider
              value={[weatherData.humidity || 0]}
              onValueChange={(value) => onWeatherChange({ ...weatherData, humidity: value[0] })}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Relative humidity levels in your area</p>
          </div>

          {/* Rainfall */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center justify-between">
              Annual Rainfall (mm)
              <span className="text-primary font-semibold">{weatherData.rainfall || 0}mm</span>
            </Label>
            <Slider
              value={[weatherData.rainfall || 0]}
              onValueChange={(value) => onWeatherChange({ ...weatherData, rainfall: value[0] })}
              max={500}
              min={0}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Total expected rainfall for the growing season</p>
          </div>

          {/* Season */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Growing Season
            </Label>
            <Select
              value={weatherData.season || ""}
              onValueChange={(value) => onWeatherChange({ ...weatherData, season: value as WeatherData["season"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select growing season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">Spring (March - May)</SelectItem>
                <SelectItem value="summer">Summer (June - August)</SelectItem>
                <SelectItem value="autumn">Autumn (September - November)</SelectItem>
                <SelectItem value="winter">Winter (December - February)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">When do you plan to grow your crops?</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
