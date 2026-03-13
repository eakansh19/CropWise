"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import type { FarmData } from "@/lib/types"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FarmDataFormProps {
  data: Partial<FarmData>
  onChange: (data: Partial<FarmData>) => void
}

export function FarmDataForm({ data, onChange }: FarmDataFormProps) {
  const handleSliderChange = (field: keyof FarmData, value: number[]) => {
    onChange({
      ...data,
      [field]: value[0],
    })
  }

  const handleInputChange = (field: keyof FarmData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  const handleSelectChange = (field: keyof FarmData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Location */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Farm Location</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your farm's location (city, state/province, country).</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Enter your farm's location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Iowa, USA"
                  value={data.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Farm Size */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Farm Size</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total cultivable area of your farm in acres.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust farm size in acres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="farmSize">Farm Size (acres)</Label>
                  <span className="text-sm font-medium text-primary">{data.farmSize?.toFixed(1) || "0.0"} acres</span>
                </div>
                <Slider
                  id="farmSize"
                  min={0.1}
                  max={1000}
                  step={0.1}
                  value={[data.farmSize || 0.1]}
                  onValueChange={(value) => handleSliderChange("farmSize", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1</span>
                  <span>1000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soil Type */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Soil Type</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The primary soil type in your farming area.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Select your primary soil type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select value={data.soilType || ""} onValueChange={(value) => handleSelectChange("soilType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="loam">Loam</SelectItem>
                    <SelectItem value="silt">Silt</SelectItem>
                    <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                    <SelectItem value="clay-loam">Clay Loam</SelectItem>
                    <SelectItem value="silt-loam">Silt Loam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Irrigation Type */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Irrigation System</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The type of irrigation system you use or plan to use.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Select your irrigation method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="irrigationType">Irrigation Type</Label>
                <Select
                  value={data.irrigationType || ""}
                  onValueChange={(value) => handleSelectChange("irrigationType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler System</SelectItem>
                    <SelectItem value="flood">Flood Irrigation</SelectItem>
                    <SelectItem value="furrow">Furrow Irrigation</SelectItem>
                    <SelectItem value="rain-fed">Rain-fed (No Irrigation)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
