import {z} from "zod"

export const CreatePostSchema = z.object({
    post_title: z.string().min(4),
    post_content: z.string().min(10)
})

export const UpdateSchema = z.object({
    post_title: z.string().min(4).optional(),
    post_content: z.string().min(10).optional()
})