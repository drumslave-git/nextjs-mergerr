import {prisma} from "@/lib/prisma"
import {App} from "@prisma/client"

export async function GET(req: Request) {
  const apps = await prisma.app.findMany()
  const noKeyApps = apps.map((app: App) => {
    console.log(app.name)
    const {api_key, ...rest} = app
    return rest
  })
  return Response.json(noKeyApps)
}