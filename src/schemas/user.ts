import { z } from "zod"

export const SignUpSchema = z.object({
    "user_name": z.string(),
    "user_email": z.string().email(),
    "user_password": z.string().min(6)
})