import { z } from "zod";

export const AddTweetSchema = z.object({
    body: z.string({message:'Precisa enviar algo'}),
    answer: z.string().optional()
})


