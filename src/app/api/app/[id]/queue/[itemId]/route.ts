import {ApiEndpoints, AppType} from "@/consts"
import {prisma} from "@/lib/prisma"
import qs from "qs"

export async function DELETE(req: Request, { params }: { params: { id: string, itemId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const apiEndPoint = ApiEndpoints[app.type as AppType].deleteItemFromQueue
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  const resp = await fetch(`${app.url}${apiEndPoint.uri}/${params.itemId}?${apiEndPointParams}`, {
    cache: "no-cache",
    method: 'DELETE'
  })

  return Response.json(await resp.json(), {status: resp.status})
}