import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest)
{
    try
    {
        const searchParams = request.nextUrl.searchParams
        const skip = searchParams.get("skip")
        const take = searchParams.get("take")
        const branches = await prisma.branch.findMany({ skip: skip ? parseInt(skip) : 0, take: take ? parseInt(take) : 5 })
        return Response.json({ branches: branches })
    } catch (e)
    {
        console.log(e)
        return Response.json({ error: { message: "Something went wrong" } }, { status: 500 })
    } finally
    {

    }
}