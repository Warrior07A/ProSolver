import express, { type NextFunction, type Request, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import cors from "cors";
import { ProbSchema, ProTagSchema, SigninSchema, SignupSchema, TagsSchema, ProbeditSchema } from "./types/types";
import mongoose, { Types, type ObjectId } from "mongoose";
import * as dotenv from "dotenv";
import { User } from "./db";
import { Problems } from "./db";


dotenv.config();
const SECRET = "akshat";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL!);

function ferr(msg: string, code: number, res: Response) {
    return res.status(code).json({
        success: "false",
        error: msg
    })
}

function authm() {
    return ((req: Request, res: Response, next: NextFunction) => {
        try {
            let token = req.headers.authorization as string;
            if (token && token.startsWith("Bearer ")) {
                token = token.split(" ")[1] as string;
            }
            let tokenver = jwt.verify(token, SECRET) as JwtPayload;
            if (!tokenver) return ferr("UNAUTHORISED", 401, res);
            let id = tokenver.id;
            req.id = id;
            if (!id) {
                console.log("here1");
                return ferr("NOT_FOUND", 404, res);
            }
            next();
        } catch (e) {
            return ferr("UNAUTHORISED", 401, res);
        }
    })
}

app.post("/signup", async (req: Request, res: Response) => {
    const signupvalid = SignupSchema.safeParse(req.body);
    if (!signupvalid.success) {
        return ferr("INVALID_INPUT", 400, res);
    }
    const userexist = await User.exists({
        email: signupvalid.data.email
    })
    // await prisma.users.findUnique({
    //     where: {
    //         email: signupvalid.data.email
    //     }
    // })
    if (userexist) {
        return ferr("EMAIL_ALREADY_EXISTS", 409, res);
    }

    const useradd = await User.create({
        name: signupvalid.data.name,
        email: signupvalid.data.email,
        password: signupvalid.data.password
    })

    // await prisma.users.create({
    //     data: {
    //         name: signupvalid.data.name,
    //         email: signupvalid.data.email,
    //         password: signupvalid.data.password
    //     }
    // })
    return res.status(201).json({
        msg: "user created successfully",
    })
})

app.post("/login", async (req: Request, res: Response) => {
    const loginverify = SigninSchema.safeParse(req.body);
    if (!loginverify.success) {
        return ferr("INVALID_INPUT", 400, res);
    }
    const userexist = await User.exists({
        email: loginverify.data.email,
        password: loginverify.data.password
    })

    // await prisma.users.findUnique({
    //     where: {
    //         email: loginverify.data.email
    //     }
    // })

    if (!userexist) {
        return ferr("USER_DOESNOT_EXIST", 404, res);
    }
    console.log(userexist);
    let id = userexist._id as Types.ObjectId;
    const token = jwt.sign({ id }, SECRET);
    return res.status(201).json({
        msg: "user create successfully",
        token: token
    })
})


app.post("/create", authm(), async (req: Request, res: Response) => {
    const probver = ProbSchema.safeParse(req.body);
    if (!probver.success) {
        return ferr("INPUT IS INVLAID", 400, res);
    }
    let id = req.id as Types.ObjectId;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }
    try {
        let Probfound = await Problems.find({
            title : probver.data.title
        })

        console.log(Probfound)
        if (Probfound.length > 0){
            return ferr("Problem Already Exists" , 401, res);
        }
        let probadd = await Problems.create({
            user_id: id,
            title: probver.data.title,
            description: probver.data.description,
            polygon_link: probver.data.link,
            tags: probver.data.tags
        });

        return res.status(200).json({
            msg: "problem has been created successfully",
            id: probadd._id
        });
    }
    catch (e: any) {
        return ferr(e, 400, res);
    }
})

app.get("/dashboard", authm(), async (req: Request, res: Response) => {
    let id = req.id;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }

    const problems = await Problems.find({
        user_id : id
    });
    
    return res.status(200).json({
        problems: problems
    });
})

app.put("/edit", authm(), async (req: Request, res: Response) => {
    const editver = ProbeditSchema.safeParse(req.body);
    if (!editver.success) {
        return ferr("INPUT IS INVALID", 400, res);
    }

    let id = req.id as Types.ObjectId;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }

    try {
        const { problem_id, title, description, link, tags } = editver.data;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (link !== undefined) updateData.polygon_link = link;
        if (tags !== undefined) updateData.tags = tags;

        const updatedProblem = await Problems.findOneAndUpdate(
            { _id: problem_id, user_id: id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProblem) {
            return ferr("PROBLEM NOT FOUND OR UNAUTHORIZED", 404, res);
        }

        return res.status(200).json({
            msg: "Problem updated successfully",
            problem: updatedProblem
        });
    } catch (e: any) {
        return ferr(e.message || "An error occurred", 400, res);
    }
})


app.listen(3001);