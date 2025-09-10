import type { RecommendationRequest, RecommendationResponse } from "./types"

export interface SavedRecommendation {
  id: string
  request: RecommendationRequest
  response: RecommendationResponse
  createdAt: string
  farmLocation: string
  farmSize: number
}

async function getFirestoreFunctions() {
  try {
    const { collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc } = await import(
      "firebase/firestore"
    )
    const { db } = await import("./firebase")
    return { collection, addDoc, getDocs, query, orderBy, limit, where, doc, getDoc, db }
  } catch (error) {
    console.error("[v0] Failed to load Firebase functions:", error)
    return null
  }
}

// Save a recommendation to Firestore
export async function saveRecommendation(
  request: RecommendationRequest,
  response: RecommendationResponse,
): Promise<string> {
  const firebase = await getFirestoreFunctions()
  if (!firebase || !firebase.db) {
    console.warn("[v0] Firebase not available, skipping save")
    return "firebase-not-available"
  }

  try {
    const { collection, addDoc, db } = firebase
    const docRef = await addDoc(collection(db, "recommendations"), {
      request,
      response,
      createdAt: new Date().toISOString(),
      timestamp: response.timestamp,
    })

    console.log("[v0] Recommendation saved with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("[v0] Error saving recommendation:", error)
    throw new Error("Failed to save recommendation")
  }
}

// Get recent recommendations
export async function getRecentRecommendations(limitCount = 10): Promise<SavedRecommendation[]> {
  const firebase = await getFirestoreFunctions()
  if (!firebase || !firebase.db) {
    console.warn("[v0] Firebase not available, returning empty array")
    return []
  }

  try {
    const { collection, getDocs, query, orderBy, limit, db } = firebase
    const q = query(collection(db, "recommendations"), orderBy("createdAt", "desc"), limit(limitCount))

    const querySnapshot = await getDocs(q)
    const recommendations: SavedRecommendation[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      recommendations.push({
        id: doc.id,
        request: data.request,
        response: data.response,
        createdAt: data.createdAt,
        farmLocation: data.farmLocation || "Unknown",
        farmSize: data.farmSize || 0,
      })
    })

    console.log("[v0] Retrieved", recommendations.length, "recommendations")
    return recommendations
  } catch (error) {
    console.error("[v0] Error getting recommendations:", error)
    return []
  }
}

export async function getRecommendationsByLocation(location: string): Promise<SavedRecommendation[]> {
  const firebase = await getFirestoreFunctions()
  if (!firebase || !firebase.db) {
    return []
  }

  try {
    const { collection, getDocs, query, where, orderBy, limit, db } = firebase
    const q = query(
      collection(db, "recommendations"),
      where("farmLocation", "==", location),
      orderBy("createdAt", "desc"),
      limit(5),
    )

    const querySnapshot = await getDocs(q)
    const recommendations: SavedRecommendation[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      recommendations.push({
        id: doc.id,
        request: data.request,
        response: data.response,
        createdAt: data.createdAt,
        farmLocation: data.farmLocation || "Unknown",
        farmSize: data.farmSize || 0,
      })
    })

    return recommendations
  } catch (error) {
    console.error("[v0] Error getting recommendations by location:", error)
    return []
  }
}

export async function getRecommendationById(id: string): Promise<SavedRecommendation | null> {
  const firebase = await getFirestoreFunctions()
  if (!firebase || !firebase.db) {
    return null
  }

  try {
    const { doc, getDoc, db } = firebase
    const docRef = doc(db, "recommendations", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        request: data.request,
        response: data.response,
        createdAt: data.createdAt,
        farmLocation: data.farmLocation || "Unknown",
        farmSize: data.farmSize || 0,
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("[v0] Error getting recommendation by ID:", error)
    return null
  }
}

export async function getRecommendationStats(): Promise<{
  totalRecommendations: number
  uniqueLocations: number
  averageFarmSize: number
}> {
  const firebase = await getFirestoreFunctions()
  if (!firebase || !firebase.db) {
    return {
      totalRecommendations: 0,
      uniqueLocations: 0,
      averageFarmSize: 0,
    }
  }

  try {
    const { collection, getDocs, db } = firebase
    const querySnapshot = await getDocs(collection(db, "recommendations"))
    const locations = new Set<string>()
    let totalFarmSize = 0
    let count = 0

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      locations.add(data.farmLocation || "Unknown")
      totalFarmSize += data.farmSize || 0
      count++
    })

    return {
      totalRecommendations: count,
      uniqueLocations: locations.size,
      averageFarmSize: count > 0 ? Math.round((totalFarmSize / count) * 10) / 10 : 0,
    }
  } catch (error) {
    console.error("[v0] Error getting stats:", error)
    return {
      totalRecommendations: 0,
      uniqueLocations: 0,
      averageFarmSize: 0,
    }
  }
}
