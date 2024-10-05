import { RequestHandler } from "express";
import { SignUpSchema } from "../schemas/signup";
import { FindUserByEmail, FindUserBySlug, createUser } from "../services/user";
import slug from "slug";
import { compare, hash } from "bcrypt-ts";
import { CreateToken } from "../utils/jwt";
import { signInSchema } from "../schemas/signin";

export const signup:RequestHandler = async (req,res) =>{
    const safeData = SignUpSchema.safeParse(req.body)
    
    if(!safeData.success){
        return res.json({error: safeData.error.flatten().fieldErrors})
    }

    const emailExist = await FindUserByEmail(safeData.data.email)

    if(emailExist){
        return res.json({error: 'Acesso negado'})
    }

    let genSlug  = true
    let userSlug = slug(safeData.data.name)
    while(genSlug){
        const hasSlug = await FindUserBySlug(userSlug)
        if(hasSlug){
            let slugSufix = Math.floor(Math.random() * 9999).toString()
            userSlug =  slug(safeData.data.name + slugSufix)
        }else{
            genSlug=false
        }
    }

    const hashPassword = await hash(safeData.data.password,10)

    const newUser = await createUser({
        
            email:safeData.data.email,
            name:safeData.data.name,
            password:hashPassword,
            slug:userSlug,
    
    })


    const token  =  CreateToken(userSlug)

    res.status(201).json({token,user:{
        name: newUser.name,
        slug: newUser.slug,
        avatar: newUser.avatar
    }})
}

export const signin:RequestHandler = async (req,res)=>{
    const safeData = signInSchema.safeParse(req.body)
    if(!safeData.success){
        return res.json({error: safeData.error.flatten().fieldErrors})
    }

    const user = await FindUserByEmail(safeData.data.email)
    if(!user){
        return res.status(401).json({error:"E-mail e/ou senha inválidos"})
    }

    const passwordVerifier = await compare(safeData.data.password, user.password)
    if(!passwordVerifier){
        return res.status(401).json({error:"E-mail e/ou senha inválidos"})
    }

    const token = CreateToken(user.slug)
    res.json({token,user:{
        name: user.name,
        email: user.email,
        avatar: user.avatar
    }})

}