const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isFirebaseConfigured = Object.values(firebaseConfig).every((value) => value !== undefined && value !== "")

let app: any = null
let db: any = null
let auth: any = null

if (isFirebaseConfigured) {
  try {
    // Dynamic import to prevent parse errors
    import("firebase/app")
      .then(({ initializeApp }) => {
        app = initializeApp(firebaseConfig)

        // Initialize Firestore and Auth dynamically
        Promise.all([import("firebase/firestore"), import("firebase/auth")])
          .then(([{ getFirestore }, { getAuth }]) => {
            db = getFirestore(app)
            auth = getAuth(app)
            console.log("[v0] Firebase initialized successfully")
          })
          .catch((error) => {
            console.error("[v0] Firebase services initialization failed:", error)
          })
      })
      .catch((error) => {
        console.error("[v0] Firebase app initialization failed:", error)
      })
  } catch (error) {
    console.error("[v0] Firebase initialization failed:", error)
  }
} else {
  console.warn("[v0] Firebase not configured - missing environment variables")
}

export { db, auth }
export const isFirebaseReady = isFirebaseConfigured
export default app
