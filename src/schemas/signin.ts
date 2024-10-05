import { z } from "zod";

export const signInSchema = z.object({
    email: z.string({message:"Email é obrigatório"}).email("Email e/ou Senha inválido"),
    password:  z.string({message:"Email e/ou Senha inválido"}).min(4, 'Senha deve ter no mínimo 4 caracteres')
})