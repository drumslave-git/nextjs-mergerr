import {ApiEndpoints, AppType} from "@/consts"
import {prisma} from "@/lib/prisma"
import qs from "qs"

export async function GET(req: Request, { params }: { params: { id: string, targetId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })
  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const apiEndPoint = ApiEndpoints[app.type as AppType].target
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  const targetReq = await fetch(`${app.url}${apiEndPoint.uri}/${params.targetId}?${apiEndPointParams}`, { cache: "no-cache" })

  return Response.json(await targetReq.json(), {status: targetReq.status})
}