import {ApiEndpoints} from "@/consts"
import formatOutputFilePath from "@/lib/formatOutputFilePath"
import {prisma} from "@/lib/prisma"
import qs from "qs"
import {AppType} from "@/consts"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const apiEndPoint = ApiEndpoints[app.type as AppType].queue
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  const queueReq = await fetch(`${app.url}${apiEndPoint.uri}?${apiEndPointParams}`, { cache: "no-cache" } )
  const resp = await queueReq.json()
  resp.records = resp.records.filter(apiEndPoint.filterMergable || (() => true))
  resp.records = resp.records.map((record: any) => {
    return {
      ...record,
      mergerrOutputFile: formatOutputFilePath(record)
    }
  })

  return Response.json(resp, {status: queueReq.status})
}