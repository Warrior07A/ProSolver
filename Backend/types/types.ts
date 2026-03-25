import e from "express";
import z from "zod";

export const SignupSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
})

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string()
})

export const PostSchema = z.object({
    content: z.string(),
    contentimg: z.string().optional(),
    contentvdo: z.string().optional()

})


export const ProbSchema = z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    tags : z.array(z.string())
})

export const TagsSchema = z.object({
    data: z.array(z.object({ "title": z.string() }))
})

export const ProTagSchema = z.object({
    data: z.array(
        z.object({
            pro_id: z.string(),
            tag_id: z.string()
        }))
})