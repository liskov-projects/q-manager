import mongoose from "mongoose";
import dotenv from "dotenv";

// Only load dotenv in non-production environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const MONGO_URI = process.env.MONGO_URI || process.env.NEXT_PUBLIC_MONGO_URI;
const MONG = process.env["MONGO_URI"];
const SOMETHING_ELSE = process.env.NODE_ENV;
const HHH = process.env.NEXT_RUNTIME;

if (!MONGO_URI) {
  throw new Error(`Define this damn MONGO_URI WTF = ${MONGO_URI}`);
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
