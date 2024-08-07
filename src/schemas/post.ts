import {z} from "zod"

export const PostSchema = z.object({
    post_title: z.string().min(4),
    post_content: z.string().min(10)
})