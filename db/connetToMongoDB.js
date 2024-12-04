import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connected to mongo");
  } catch (error) {
    console.log("Error connecting Mongo", error.message);
  }
};

export default connectToMongoDB;
