import { z } from "zod";

export const SignUpSchema = z.object({
    name: z.string({message:"Nomé é obrigatório"}).min(2, "O nome deve ter no mínimo dois caracteres"),
    email: z.string({message:"Email é obrigatório"}).email("Email e/ou Senha inválido"),
    password:  z.string({message:"Email e/ou Senha inválido"}).min(4, 'Senha deve ter no mínimo 4 caracteres')
})
