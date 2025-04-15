import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../.env.production")
    : path.resolve(__dirname, "../../.env.local");

dotenv.config({ path: envPath });

// console.log("Loaded ENV from:", envPath);
// console.log("PORT =", process.env.NEXT_PUBLIC_PORT);
console.log("NEXT_PUBLIC_MONGO_URI =", process.env.NEXT_PUBLIC_MONGO_URI);

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;

// console.log("PROCESS.ENV");
// console.log(process.env);

if (!MONGO_URI) {
  throw new Error(`Define NEXT_PUBLIC_MONGO_URI = ${MONGO_URI}`);
}

// will allow to reuse the established connection
let cached = global.mongoose;
// tried to resolve this with global.d.ts
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  // checks for existing connection
  if (cached.conn) {
    console.log("using cached connection");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
      })
      .then((mongoose) => {
        console.log("new DB connection");
        return mongoose;
      })
      .catch((err) => console.error("MongoDB connection error", err));
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
