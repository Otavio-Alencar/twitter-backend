import express  from "express";
import helmet from "helmet";
import cors from 'cors'
import { mainrouter } from "./routes/main";
const server = express()
server.use(helmet());
server.use(cors())
server.use(express.json()); 
server.use(express.urlencoded({extended:true}));
server.use(mainrouter)
server.listen(process.env.PORT 
    || 3000, ()=>{
    console.log('Servidor está rodando no link : http://localhost:3000/')
})