import app from "./app";
import {connectDb} from "./database/mongoDb";
import dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT || 3000
const startServer = async(): Promise<void> => {
    try{

        await connectDb();
        
        app.listen(port,()=>{
            console.log(`🚀 Server is running on port ${port}`);
        })
    }catch(error:any){
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();