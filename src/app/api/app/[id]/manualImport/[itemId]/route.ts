import {ApiEndpoints, AppType} from "@/consts"
import {NextRequest} from "next/server"
import qs from "qs"
import {prisma} from "@/lib/prisma"
import path from "path"

export async function GET(req: NextRequest, { params }: { params: { id: string, itemId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  let output = req.nextUrl.searchParams.get('output')
  if (output) {
    output = output.split(path.sep).slice(0, -1).join(path.sep)
  }

  const apiEndpoint = ApiEndpoints[app.type as AppType].manualImport

  const reqParams = {
    ...apiEndpoint.params,
    apiKey: app.api_key,
    [output ? 'movieId' : 'downloadId']: params.itemId,
  }
  if (output) {
    reqParams.folder = output
  }

  const resp = await fetch(`${app.url}${apiEndpoint.uri}?${qs.stringify(reqParams)}`, {
    cache: "no-cache"
  })

  return Response.json(await resp.json(), {status: resp.status})
}