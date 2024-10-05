
import { ExtendedRequest } from "../types/extended-request";
import { FindUserBySlug, UpdateUserInfo, checkIfUserIsFollowedByUser, followUser, getUserFollowersCount, getUserFollowingCount, getUserTweetCount, unfollowUser } from "../services/user";
import { Response } from "express";
import { userTweetsSchema } from "../schemas/user-tweets";
import { findTweetByUser } from "../services/tweet";
import { updateUserSchema } from "../schemas/update-user";


export const getUser = async(req:ExtendedRequest,res:Response)=>{
    const {slug} = req.params

    const user = await FindUserBySlug(slug)

    if(!user){
        return res.status(401).json({error:  "Usuário inexistente"})
    }
    const followingCount = await getUserFollowingCount(user.slug)
    const followersCount =  await getUserFollowersCount(user.slug)
    const tweetCount = await getUserTweetCount(user.slug)
    res.json({user,followingCount,followersCount,tweetCount})
}

export const getUserTweets = async (req:ExtendedRequest,res:Response)=>{
    const {slug} = req.params
    const safeData = userTweetsSchema.safeParse(req.query)
    if(!safeData.success){
        return res.json({error: safeData.error.flatten().fieldErrors})
    }

    let perPage = 2

    let currentPage = safeData.data.page ??  0;
    
    const tweets = await findTweetByUser(
        slug,
        currentPage,
        perPage
    )
    res.json({tweets,page: currentPage})
}


export const followToggle=async (req:ExtendedRequest,res:Response)=>{
    const {slug} = req.params
    const userExist = FindUserBySlug(slug)
    if(!userExist){
        res.status(401).json({error:"Esse usuário não existe"})
    }
    const follow = await checkIfUserIsFollowedByUser(req.userSlug as string,slug)

    if(follow){
        unfollowUser(req.userSlug as string,slug)
    }else{
        followUser(req.userSlug as string,slug)
    }

    res.json({})
}

export const updateUser = async (req:ExtendedRequest,res:Response)=>{
    const safeData = updateUserSchema.safeParse(req.body)
    if(!safeData.success){
        return res.json({error: safeData.error.flatten().fieldErrors})
    }

    await UpdateUserInfo(req.userSlug as string,safeData.data)
    res.json({})
}