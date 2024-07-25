import {ApiEndpoints, AppType} from "@/consts"
import qs from "qs"
import {prisma} from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string, downloadId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const resp = await fetch(`${app.url}${ApiEndpoints[app.type as AppType].manualImport.uri}?${qs.stringify({
    apiKey: app.api_key,
    downloadId: params.downloadId,
  })}`, {
    cache: "no-cache"
  })

  return Response.json(await resp.json(), {status: resp.status})
}