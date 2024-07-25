import {ApiEndpoints, AppType} from "@/consts"
import {prisma} from "@/lib/prisma"
import qs from "qs"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })
  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const apiEndPoint = ApiEndpoints[app.type as AppType].targets
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  const targetsReq = await fetch(`${app.url}${apiEndPoint.uri}?${apiEndPointParams}`, { cache: "no-cache" })

  return Response.json(await targetsReq.json(), {status: targetsReq.status})
}