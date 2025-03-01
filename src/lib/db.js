import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config();
dotenv.config({ path: "../../.env.local" });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Define MONGO_URI");

// will allow to reuse the established connection
let cached = global.mongoose;
// tried to resolve this with global.d.ts
if (!cached) cached = global.mongoose = {conn: null, promise: null};

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
      .then(mongoose => {
        console.log("new DB connection");
        return mongoose;
      })
      .catch(err => console.error("MongoDB connection error", err));
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
