import  dbConnection  from './dbConnection.js';
import cors from 'cors'
import dotenv from 'dotenv';
import express from 'express';
import musicRoute from'./routes/music.js';

dotenv.config();
dbConnection();

const app=express();
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT || 8800;


app.use('/api/songs',musicRoute);

  

app.use((err,req,res,next)=>{
    const errorStatus=err.statusCode || 500;
    const errorMessage=err.message || "Something went wrong";
   return res.status(errorStatus).json({
    success:false,
    status: errorStatus,
message:errorMessage,
stack:err.stack});
})

app.listen(PORT,()=>{
    console.log("connected to backend server");
    // clientConnect();
})