import {prisma} from "@/lib/prisma"
import {App} from "@prisma/client"

export const dynamic = 'force-dynamic'

export async function GET() {
  const apps = await prisma.app.findMany()
  const noKeyApps = apps.map((app: App) => {
    const {api_key, ...rest} = app
    return rest
  })
  return Response.json(noKeyApps)
}