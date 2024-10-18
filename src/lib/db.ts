import mongoose from "mongoose";

const MONGO_URI =
  // net/qManager - to access qManager collection without it connects to default
  "mongodb+srv://verrafalenko:7Gy3D4trVyy@qmanager.vmegg.mongodb.net/qManager?retryWrites=true&w=majority&appName=QManager/";

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
        console.log("new connection");
        return mongoose;
      })
      .catch(err => console.error("MongoDB connection error", err));
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
