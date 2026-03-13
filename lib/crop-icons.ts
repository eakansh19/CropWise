export const cropIcons: Record<string, string> = {
  // Grains
  Wheat: "🌾",
  Rice: "🌾",
  Maize: "🌽",
  Corn: "🌽",
  Barley: "🌾",
  Oats: "🌾",
  Millet: "🌾",
  Sorghum: "🌾",

  // Vegetables
  Potato: "🥔",
  "Sweet Potato": "🍠",
  Tomato: "🍅",
  Onion: "🧅",
  Carrot: "🥕",
  Cabbage: "🥬",
  Lettuce: "🥬",
  Spinach: "🥬",
  Broccoli: "🥦",
  Cauliflower: "🥦",
  Peas: "🟢",
  Beans: "🫘",

  // Fruits
  Apple: "🍎",
  Orange: "🍊",
  Banana: "🍌",
  Grapes: "🍇",
  Strawberry: "🍓",
  Watermelon: "🍉",
  Mango: "🥭",
  Pineapple: "🍍",

  // Cash crops
  Cotton: "🌱",
  Sugarcane: "🎋",
  Tobacco: "🌿",
  Coffee: "☕",
  Tea: "🍃",

  // Legumes
  Soybean: "🫘",
  Chickpea: "🫘",
  Lentil: "🫘",
  Groundnut: "🥜",
  Peanut: "🥜",

  // Default fallback
  default: "🌱",
}

export function getCropIcon(cropName: string): string {
  return cropIcons[cropName] || cropIcons.default
}
