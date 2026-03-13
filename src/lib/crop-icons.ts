import { 
  Wheat, 
  Sprout, 
  Leaf, 
  Grape, 
  Coffee, 
  Apple, 
  Citrus,
  Cherry, 
  Shrub,
  Flower2,
  TreeDeciduous,
  Waves,
  Soup,
  Wind,
  LucideIcon
} from "lucide-react"
import React from "react"

export const cropIcons: Record<string, LucideIcon> = {
  // Grains
  Wheat: Wheat,
  Rice: Shrub,
  Maize: Sprout,
  Corn: Sprout,
  Barley: Wheat,
  Oats: Wheat,
  Millet: Wheat,
  Sorghum: Wheat,

  // Vegetables
  Potato: Shrub,
  "Sweet Potato": Shrub,
  Tomato: Shrub,
  Onion: Shrub,
  Carrot: Shrub,
  Cabbage: Leaf,
  Lettuce: Leaf,
  Spinach: Leaf,
  Broccoli: Shrub,
  Cauliflower: Shrub,
  Peas: Shrub,
  Beans: Shrub,

  // Fruits
  Apple: Apple,
  Orange: Citrus,
  Banana: Citrus, // Lucide doesn't have banana, using Citrus
  Grapes: Grape,
  Strawberry: Shrub,
  Watermelon: Citrus,
  Mango: Citrus,
  Pineapple: Shrub,

  // Cash crops
  Cotton: Sprout,
  Sugarcane: Shrub,
  Tobacco: Leaf,
  Coffee: Coffee,
  Tea: Leaf,

  // Legumes
  Soybean: Sprout,
  Chickpea: Sprout,
  Lentil: Sprout,
  Groundnut: Sprout,
  Peanut: Sprout,

  // Default fallback
  default: Sprout,
}

export function getCropIcon(cropName: string): LucideIcon {
  return cropIcons[cropName] || cropIcons.default
}
