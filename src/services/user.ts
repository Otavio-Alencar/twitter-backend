import { Prisma, User } from "@prisma/client"
import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url"

export const FindUserByEmail = async(email:string)=>{
    const user = await prisma.user.findFirst({
        where:{
            email
        }
    })

    if(user){
        return{
            ...user,
            avatar:getPublicUrl(user.avatar),
            cover:getPublicUrl(user.cover),
        }
    }
    return user
}
export const FindUserBySlug = async(slug:string)=>{
    const user = await prisma.user.findFirst({
        select:{
            avatar:true,
            cover: true,
            slug: true,
            name: true,
            bio: true,
            link: true
        },
        where:{
            slug
        }
    })

    if(user){
        return{
            ...user,
            avatar:getPublicUrl(user.avatar),
            cover:getPublicUrl(user.cover),
        }
    }
    return user
}

export const createUser = async(data: Prisma.UserCreateInput)=>{
   const newUser = await prisma.user.create({data})


   return{
    ...newUser,
    avatar:getPublicUrl(newUser.avatar),
            cover:getPublicUrl(newUser.cover),
   }

    
}

export const getUserFollowingCount = async (slug:string)=>{

    const count =  await prisma.follow.count({
        where:{user1Slug:slug}
    })

    return  count
}

export const getUserFollowersCount = async (slug:string)=>{

    const count =  await prisma.follow.count({
        where:{user2Slug:slug}
    })

    return  count
}

export const getUserTweetCount = async (slug:string)=>{

    const count =  await prisma.tweet.count({
        where:{userSlug:slug}
    })

    return  count
}



export const checkIfUserIsFollowedByUser = async (slug:string,slug2:string)=>{
    const isFollow = await prisma.follow.findFirst({
        where:{
            user1Slug:slug,
            user2Slug:slug2
        }
    })


    return isFollow ? true : false
}

export const unfollowUser = async (slug:string,slug2:string)=>{
    await prisma.follow.deleteMany({
        where:{
            user1Slug:slug,
            user2Slug:slug2
        }
    })
}


export const followUser = async (slug:string,slug2:string)=>{
    await prisma.follow.create({
        data:{
            user1Slug:slug,
            user2Slug:slug2
        }
    })
}


export const UpdateUserInfo = async(slug:string,data:Prisma.UserUpdateInput)=>{
    await prisma.user.update({
        where:{slug},
        data
    })
}

export const getUserFollowing = async (slug:string)=>{
    const following  = []
    const reqFollow = await prisma.follow.findMany({
        select:{user2Slug:true},
        where:{user1Slug:slug}
    })

    for(let reqItem of reqFollow){
        following.push(reqItem.user2Slug)
    }

    return following
}

export const getUserSuggestions = async (slug:string)=>{
    const following = await getUserFollowing(slug)

    const follwingPlusMe = [...following,slug]

    type Suggestion = Pick<
    Prisma.UserGetPayload<Prisma.UserDefaultArgs>,
    "name" | "avatar" | "slug">


    const suggestions: Suggestion[] = await prisma.$queryRaw`
        SELECT
            name, avatar, slug
        FROM "User"
        WHERE
            slug NOT IN (${follwingPlusMe.join(',')})
        ORDER BY RANDOM()
        LIMIT 2;
    `

    for(let sugIndex in suggestions){
        suggestions[sugIndex].avatar = getPublicUrl(suggestions[sugIndex].avatar)
    }

    return suggestions
}