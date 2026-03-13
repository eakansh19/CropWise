"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import type { SoilData } from "@/lib/types"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SoilDataFormProps {
  data: Partial<SoilData>
  onChange: (data: Partial<SoilData>) => void
}

export function SoilDataForm({ data, onChange }: SoilDataFormProps) {
  const handleSliderChange = (field: keyof SoilData, value: number[]) => {
    onChange({
      ...data,
      [field]: value[0],
    })
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nitrogen */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Nitrogen (N)</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Nitrogen content in ppm (parts per million). Essential for leaf growth.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust nitrogen content in ppm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
                  <span className="text-sm font-medium text-primary">{data.nitrogen || 0} ppm</span>
                </div>
                <Slider
                  id="nitrogen"
                  min={0}
                  max={140}
                  step={1}
                  value={[data.nitrogen || 0]}
                  onValueChange={(value) => handleSliderChange("nitrogen", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>140</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phosphorus */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Phosphorus (P)</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Phosphorus content in ppm. Important for root development and flowering.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust phosphorus content in ppm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
                  <span className="text-sm font-medium text-primary">{data.phosphorus || 0} ppm</span>
                </div>
                <Slider
                  id="phosphorus"
                  min={0}
                  max={140}
                  step={1}
                  value={[data.phosphorus || 0]}
                  onValueChange={(value) => handleSliderChange("phosphorus", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>140</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Potassium */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Potassium (K)</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Potassium content in ppm. Helps with disease resistance and fruit quality.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust potassium content in ppm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="potassium">Potassium (ppm)</Label>
                  <span className="text-sm font-medium text-primary">{data.potassium || 0} ppm</span>
                </div>
                <Slider
                  id="potassium"
                  min={0}
                  max={200}
                  step={1}
                  value={[data.potassium || 0]}
                  onValueChange={(value) => handleSliderChange("potassium", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>200</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* pH Level */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">pH Level</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Soil pH level (0-14). Most crops prefer pH between 6.0-7.5.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust soil pH level (0-14)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ph">pH Level</Label>
                  <span className="text-sm font-medium text-primary">{data.ph?.toFixed(1) || "0.0"}</span>
                </div>
                <Slider
                  id="ph"
                  min={0}
                  max={14}
                  step={0.1}
                  value={[data.ph || 0]}
                  onValueChange={(value) => handleSliderChange("ph", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.0</span>
                  <span>14.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Soil Properties */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Organic Matter</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Organic matter percentage in soil. Higher values indicate better soil health.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust organic matter percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                  <span className="text-sm font-medium text-primary">{data.organicMatter?.toFixed(1) || "0.0"}%</span>
                </div>
                <Slider
                  id="organicMatter"
                  min={0}
                  max={10}
                  step={0.1}
                  value={[data.organicMatter || 0]}
                  onValueChange={(value) => handleSliderChange("organicMatter", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.0%</span>
                  <span>10.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Soil Moisture</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current soil moisture percentage. Affects water retention and drainage.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription>Adjust current moisture percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="moisture">Moisture (%)</Label>
                  <span className="text-sm font-medium text-primary">{data.moisture?.toFixed(1) || "0.0"}%</span>
                </div>
                <Slider
                  id="moisture"
                  min={0}
                  max={100}
                  step={0.1}
                  value={[data.moisture || 0]}
                  onValueChange={(value) => handleSliderChange("moisture", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.0%</span>
                  <span>100.0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
