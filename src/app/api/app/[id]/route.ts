import {prisma} from "@/lib/prisma"

export const GET = async (req: Request, {params}: {params: {id: string}}) => {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id
    }
  })
  return Response.json(app)
}