import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import MongoDB from "./utils/MongoDb.js"
import userRoutes from "./routes/user.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js"


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



app.get("/",(_,res)=>{
    res.send("Hello World");
})

app.listen(PORT, ()=>{
    MongoDB();
    console.log(`server is running on port ${PORT}`);
})