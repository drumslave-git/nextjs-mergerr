import {ManualImportOptions} from "@/common/api/Radarr/entities/ManualImportAPI"
import {ApiEndpoints, AppType} from "@/consts"
import withApi, {NextRequestWithApi} from "@/lib/withApi"
import qs from "qs"
import {prisma} from "@/lib/prisma"
import path from "path"

async function getHandler(req: NextRequestWithApi, {params}: { params: { id: string, itemId: string } }) {
  let output = req.nextUrl.searchParams.get('output')
  if (output) {
    output = output.split(path.sep).slice(0, -1).join(path.sep)
  }

  const reqParams: ManualImportOptions = {
    [output ? 'movieId' : 'downloadId']: params.itemId,
  }
  if (output) {
    reqParams.folder = output
  }

  const resp = await req.api.manualImport.fetchManualImportItems(reqParams)
  resp.data.sort((a: any, b: any) => a.path.localeCompare(b.path))
  return Response.json(resp.data)
}

export async function POST(req: Request, {params}: { params: { id: string, itemId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const data = {
    ...await req.json(),
    movieId: params.itemId,
    importMode: 'auto',
    name: 'ManualImport'
  }

  const resp = await fetch(`${app.url}${ApiEndpoints[app.type as AppType].command.uri}?${qs.stringify({apiKey: app.api_key})}`, {
    method: 'POST',
    body: JSON.stringify(data),
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json'
    }
  })

  let respData = await resp.json()
  const {apiKey, ...rest} = data

  return Response.json({...respData, requestedData: rest}, {status: resp.status})
}

export const GET = withApi(getHandler)