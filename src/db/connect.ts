import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_url =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/snap-link";

async function connectDb() {
  const res = await mongoose.connect(mongo_url);
  if (res) console.info("Database successfully connected");
  else console.error("Oops! Database not able to connected");
}

export { connectDb };
