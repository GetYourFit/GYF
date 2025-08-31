import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import MongoDB from "./utils/MongoDb.js"
import userRoutes from "./routes/user.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js"
import orderRoutes from "./routes/order.routes.js"
import insightRoutes from "./routes/insights.routes.js"
import { v2 as cloudinary } from "cloudinary";

// configure once in your app (or load from .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


dotenv.config({})

const app = express()
const PORT = process.env.PORT || 6000;
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users',userRoutes);
app.use('/api/recommend',recommendationRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/insights',insightRoutes);



app.get("/",(_,res)=>{
    res.send("Hello World");
})

app.listen(PORT, ()=>{
    MongoDB();
    console.log(`server is running on port ${PORT}`);
})