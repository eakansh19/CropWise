"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import type { WeatherData } from "@/lib/types"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherDataFormProps {
  data: Partial<WeatherData>
  onChange: (data: Partial<WeatherData>) => void
}

export function WeatherDataForm({ data, onChange }: WeatherDataFormProps) {
  const handleSliderChange = (field: keyof WeatherData, value: number[]) => {
    onChange({
      ...data,
      [field]: value[0],
    })
  }

  const handleSelectChange = (field: keyof WeatherData, value: string) => {
    onChange({
      ...data,
      [field]: value as WeatherData["season"],
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Temperature */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Average Temperature</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average temperature in Celsius for the growing season.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust average temperature in °C</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <span className="text-sm font-medium text-primary">{data.temperature?.toFixed(1) || "0.0"}°C</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={50}
                  step={0.5}
                  value={[data.temperature || 0]}
                  onValueChange={(value) => handleSliderChange("temperature", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0°C</span>
                  <span>50°C</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Humidity */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Humidity</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average relative humidity percentage in your area.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust average humidity percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="humidity">Humidity (%)</Label>
                  <span className="text-sm font-medium text-primary">{data.humidity || 0}%</span>
                </div>
                <Slider
                  id="humidity"
                  min={0}
                  max={100}
                  step={1}
                  value={[data.humidity || 0]}
                  onValueChange={(value) => handleSliderChange("humidity", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rainfall */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Annual Rainfall</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total annual rainfall in millimeters for your location.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust annual rainfall in mm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rainfall">Rainfall (mm)</Label>
                  <span className="text-sm font-medium text-primary">{data.rainfall || 0} mm</span>
                </div>
                <Slider
                  id="rainfall"
                  min={0}
                  max={500}
                  step={1}
                  value={[data.rainfall || 0]}
                  onValueChange={(value) => handleSliderChange("rainfall", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 mm</span>
                  <span>500 mm</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Season */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Growing Season</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The primary season when you plan to grow crops.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Select your main growing season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="season">Season</Label>
                <Select value={data.season || ""} onValueChange={(value) => handleSelectChange("season", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select growing season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="autumn">Autumn</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
