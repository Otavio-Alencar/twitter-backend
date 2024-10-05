import { prisma } from "../utils/prisma"

export const addHashTag = async (hashtag: string)=>{
    const hs = await prisma.trend.findFirst({
        where: {hashtag}
    })
    if(hs){
        await prisma.trend.update({
            where:{id:hs.id}, 
            data:{
                counter:hs.counter +1,updatedAt:new Date()
            }
        })
    }else{
        await prisma.trend.create({
            data:{
                hashtag
            }
        })
    }
}

export const getAllTrends = async()=>{
    const hs = await prisma.trend.findMany({
        select:{
            hashtag:true,
            counter:true
        },
        orderBy:{updatedAt:'desc'},
        take:4
    })

    return hs
}