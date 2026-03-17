import express, { type NextFunction, type Request, type Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "./prisma/db";
import cors from "cors";
import { ProbSchema, SigninSchema, SignupSchema, TagsSchema } from "./types/types";
const SECRET = "akshat";

const app = express();

app.use(cors());
app.use(express.json());


function ferr(msg: string, code: number, res: Response) {
    return res.status(code).json({
        success: "false",
        error: msg
    })
}

function authm() {
    return ((req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1] as string;
            console.log(token);
            let tokenver = jwt.verify(token, SECRET) as JwtPayload;
            if (!tokenver) return ferr("UNAUTHORISED", 401, res);
            let id = tokenver.id;
            req.id = id;
            if (!id) {
                return ferr("NOT_FOUND", 404, res);
            }
            next();
        } catch (e) {
            console.log(e);
            return ferr("UNAUTHORISED", 401, res);
        }
    })
}

app.post("/signup", async (req: Request, res: Response) => {
    const signupvalid = SignupSchema.safeParse(req.body);
    if (!signupvalid.success) {
        return ferr("INVALID_INPUT", 400, res);
    }
    const userexist = await prisma.users.findUnique({
        where: {
            email: signupvalid.data.email
        }
    })
    if (userexist) {
        return ferr("EMAIL_ALREADY_EXISTS", 409, res);
    }
    const useradd = await prisma.users.create({
        data: {
            name: signupvalid.data.name,
            email: signupvalid.data.email,
            password: signupvalid.data.password
        }
    })
    return res.status(201).json({
        msg: "user create successfully",
    })
})

app.post("/login", async (req: Request, res: Response) => {
    const loginverify = SigninSchema.safeParse(req.body);
    if (!loginverify.success) {
        return ferr("INVALID_INPUT", 400, res);
    }
    const userexist = await prisma.users.findUnique({
        where: {
            email: loginverify.data.email
        }
    })
    if (!userexist) {
        return ferr("USER_DOESNOT_EXIST", 404, res);
    }
    let id = userexist.id;
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
    let id = req.id;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }
    try {
        const probadd = await prisma.problems.create({
            data: {
                title: probver.data.title,
                description: probver.data.description,
                polygon_link: probver.data.link,
                userid: id
            }
        })
        return res.status(200).json({
            msg: "probelm has been created successfully",
            id: probadd.id
        })
    }
    catch (e) {
        return ferr("CATCH mein fata", 400, res);
    }
})

app.post("/tagsadd", authm(), async (req: Request, res: Response) => {
    const tagver = TagsSchema.safeParse(req.body);
    if (!tagver.success) {
        return ferr("INPUT IS INVLAID", 400, res);
    }
    let id = req.id;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }
    try {
        const tagsadd = await prisma.tags.create({
            data: {
                Pro_id : tagver.data.Pro_id,
                title :  tagver.data.title
            }
        })
        return res.status(200).json({
            msg: "tags has been created successfully",
            id: tagsadd.id
        })
    }
    catch (e) {
        return ferr("tags ke CATCH mein fata", 400, res);
    }
})


app.get("/dashboard", authm(), async (req: Request, res: Response) => {
    let id = req.id;
    if (!id) {
        return ferr("ID IS MISSING", 401, res);
    }

    const problems = await prisma.problems.findMany({
        where: {
            userid: id
        }
    })
    if (problems.length == 0) {
        return res.status(200).json({
            msg: "no posts exist",
        })
    }
    return res.status(201).json({
        problems: problems
    })
})


app.listen(3001);