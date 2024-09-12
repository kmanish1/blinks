import { PrismaClient } from "@prisma/client";

export async function GET(){
    const prisma = new PrismaClient();
    const data=await prisma.solMeet.findMany();
    return Response.json(data);
}