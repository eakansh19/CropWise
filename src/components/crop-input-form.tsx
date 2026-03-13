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

  const isComplete = (val: any) => val !== undefined && val !== null && val !== ""

  return (
    <div className="space-y-12">
      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all hover:bg-white/[0.03]">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <Thermometer className="h-6 w-6" />
           </div>
           <div>
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Location & Climate</h3>
              <p className="text-sm text-white/40 font-medium">Auto-detect your local environmental conditions</p>
           </div>
        </div>
        <LocationInput onWeatherFetch={handleWeatherFetch} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Soil Information */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all hover:bg-white/[0.03]">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Soil Composition</h3>
          </div>
          
          <div className="space-y-10">
            {/* Nitrogen */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Nitrogen (N)</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(soilData.nitrogen) ? 'text-primary' : 'text-white/20'}`}>
                  {soilData.nitrogen || 0} <span className="text-[10px] opacity-40 uppercase">mg/kg</span>
                </div>
              </div>
              <Slider
                value={[soilData.nitrogen || 0]}
                onValueChange={(value) => onSoilChange({ ...soilData, nitrogen: value[0] })}
                max={140}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Phosphorus (P)</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(soilData.phosphorus) ? 'text-primary' : 'text-white/20'}`}>
                  {soilData.phosphorus || 0} <span className="text-[10px] opacity-40 uppercase">mg/kg</span>
                </div>
              </div>
              <Slider
                value={[soilData.phosphorus || 0]}
                onValueChange={(value) => onSoilChange({ ...soilData, phosphorus: value[0] })}
                max={140}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Potassium */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Potassium (K)</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(soilData.potassium) ? 'text-primary' : 'text-white/20'}`}>
                  {soilData.potassium || 0} <span className="text-[10px] opacity-40 uppercase">mg/kg</span>
                </div>
              </div>
              <Slider
                value={[soilData.potassium || 0]}
                onValueChange={(value) => onSoilChange({ ...soilData, potassium: value[0] })}
                max={200}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* pH */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Soil pH Level</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(soilData.ph) ? 'text-primary' : 'text-white/20'}`}>
                  {soilData.ph || 0} <span className="text-[10px] opacity-40 uppercase">pH</span>
                </div>
              </div>
              <Slider
                value={[soilData.ph || 0]}
                onValueChange={(value) => onSoilChange({ ...soilData, ph: value[0] })}
                max={14}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all hover:bg-white/[0.03]">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
              <Thermometer className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">Weather Context</h3>
          </div>
          
          <div className="space-y-10">
            {/* Temperature */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Temperature</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(weatherData.temperature) ? 'text-primary' : 'text-white/20'}`}>
                  {weatherData.temperature || 0} <span className="text-[10px] opacity-40 uppercase">°C</span>
                </div>
              </div>
              <Slider
                value={[weatherData.temperature || 0]}
                onValueChange={(value) => onWeatherChange({ ...weatherData, temperature: value[0] })}
                max={50}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Humidity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Humidity</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(weatherData.humidity) ? 'text-primary' : 'text-white/20'}`}>
                  {weatherData.humidity || 0} <span className="text-[10px] opacity-40 uppercase">%</span>
                </div>
              </div>
              <Slider
                value={[weatherData.humidity || 0]}
                onValueChange={(value) => onWeatherChange({ ...weatherData, humidity: value[0] })}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Rainfall */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Avg Rainfall</Label>
                <div className={`text-sm font-bold flex items-center gap-2 ${isComplete(weatherData.rainfall) ? 'text-primary' : 'text-white/20'}`}>
                  {weatherData.rainfall || 0} <span className="text-[10px] opacity-40 uppercase">mm</span>
                </div>
              </div>
              <Slider
                value={[weatherData.rainfall || 0]}
                onValueChange={(value) => onWeatherChange({ ...weatherData, rainfall: value[0] })}
                max={500}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Season */}
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Growing Season
              </Label>
              <Select
                value={weatherData.season || ""}
                onValueChange={(value) => onWeatherChange({ ...weatherData, season: value as WeatherData["season"] })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/20">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  <SelectItem value="spring" className="focus:bg-primary/10 focus:text-primary">Spring (Mar-May)</SelectItem>
                  <SelectItem value="summer" className="focus:bg-primary/10 focus:text-primary">Summer (Jun-Aug)</SelectItem>
                  <SelectItem value="autumn" className="focus:bg-primary/10 focus:text-primary">Autumn (Sep-Nov)</SelectItem>
                  <SelectItem value="winter" className="focus:bg-primary/10 focus:text-primary">Winter (Dec-Feb)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
