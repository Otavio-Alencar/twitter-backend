import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"
import { FindUserBySlug } from "../services/user"
import { ExtendedRequest } from "../types/extended-request"


export const CreateToken = (slug:string)=>{
    return jwt.sign({slug},process.env.SECRET_KEY as string)
}

export const verifyJWT =(req:ExtendedRequest,res:Response,next:NextFunction)=>{
    const authheader = req.headers['authorization']
    if(!authheader){
        return res.status(401).json({error: "acesso não autorizado"})
    }

    const token = authheader.split(' ')[1]

    jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        async (error,decoded:any)=>{
            if(error){
                return res.status(401).json({error: "acesso não autorizado"})
            }
            const user  = await FindUserBySlug(decoded.slug)

            if(!user){
                return res.status(401).json({error: "acesso não autorizado"})
            }
            req.userSlug = user.slug
            next()
        }
    )

}