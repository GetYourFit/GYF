import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import MongoDB from "./utils/DB.js"
import userRoutes from "./routes/user.routes.js"


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





app.listen(PORT, ()=>{
    MongoDB();
    console.log(`server is running on port ${PORT}`);
})