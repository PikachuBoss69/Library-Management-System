import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl:string | undefined = process.env.MONGO_URL;

export const  connectDb = async():Promise<void> => {
   try{
    if (!mongoUrl) {
        throw new Error("MONGO_URL is missing");
    }
    await mongoose.connect(mongoUrl, {
        dbName: "Central_Database"
    });
        console.log("✅ MongoDB Connected Successfully");
    }catch(err:any){
        console.log("❌ MongoDB Not Connected");
        console.error(err);
        process.exit(1);
    }
};
