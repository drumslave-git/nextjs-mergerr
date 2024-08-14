import {prisma} from "@/lib/prisma"

export async function GET(req: Request) {
  const apps = await prisma.app.findMany()
  return Response.json(apps.map(app => {
    const {api_key, ...rest} = app
    return rest
  }))
}