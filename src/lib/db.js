import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local in dev/qa, let real envs come through in prod
if (process.env.NODE_ENV !== "production") {
  const envPath = path.resolve(__dirname, "../../.env.local");
  dotenv.config({ path: envPath });
  console.log("🔧 Loaded ENV from", envPath);
}

// Always log the URI for sanity
console.log("📡 MONGO_URI =", process.env.MONGO_URI);
// console.log("📂 MONGO_DB_NAME =", process.env.MONGO_DB_NAME);

const MONGO_URI = process.env.MONGO_URI;
// const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "qManager";
const MONGO_DB_NAME = "q-manager-qa" || "qManager";
console.log("📂 MONGO_DB_NAME =", process.env.MONGO_DB_NAME);

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables.");
}

// Global cache for hot-reloading in dev
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log("🟢 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: MONGO_DB_NAME,
        // Optional: you can tune poolSize, writeConcern, etc. here
      })
      .then((mongooseInstance) => {
        console.log("🆕 New DB connection established");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
