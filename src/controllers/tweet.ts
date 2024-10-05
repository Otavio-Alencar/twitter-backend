import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { AddTweetSchema } from "../schemas/tweet";
import { checkIfTweetIsLikedByUser, createTweet, findAnswersFromTweet, findTweet,  likeTweet, unlikeTweet } from "../services/tweet";
import { addHashTag } from "../services/trend";


export const SendTweet = async (req:ExtendedRequest,res:Response)=>{
    const safeData = AddTweetSchema.safeParse(req.body)
    if(!safeData.success){
        return res.json({error: safeData.error.flatten().fieldErrors})
    }
    

    if(safeData.data.answer){
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer))
        if(!hasAnswerTweet){
            return res.json({error: 'Tweet original inexistente'})
        }
    }

    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0
    )

    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g)
    if(hashtags){
        for(let hashtag of hashtags){
            if(hashtag.length >= 2){
                await addHashTag(hashtag)
            }
        }
    }
    res.json({tweet:newTweet})
}


export const getTweet = async (req:ExtendedRequest,res:Response)=>{
    const id = parseInt(req.params.id)
    const tweetItem = await findTweet(id)

    if(!tweetItem){
        return res.status(401).json({error:"Tweet não encontrado"})
    }

    res.json({tweet:tweetItem})
}

export const getAnswers = async(req:ExtendedRequest,res:Response)=>{
    const {id} = req.params

    const answers = await findAnswersFromTweet(parseInt(id))

    res.json({answers: answers})
}


export const likeToggle = async (req:ExtendedRequest,res:Response)=>{
    const {id} = req.params

    const liked = await checkIfTweetIsLikedByUser(req.userSlug as string,parseInt(id))

    if(liked){
        unlikeTweet(req.userSlug as string,parseInt(id))
    }else{
        likeTweet(req.userSlug as string,parseInt(id))
    }

    res.json({})
}