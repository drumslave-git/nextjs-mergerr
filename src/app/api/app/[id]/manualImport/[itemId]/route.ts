import {ApiEndpoints, AppType} from "@/consts"
import withApi, {NextRequestWithApi} from "@/lib/withApi"
import qs from "qs"
import {prisma} from "@/lib/prisma"

async function getHandler(req: NextRequestWithApi, {params}: { params: { id: string, itemId: string } }) {
  const {itemId} = await params

  const resp = await req.api.manualImport.get({downloadId: itemId})
  resp.data.sort((a: any, b: any) => a.path.localeCompare(b.path))
  return Response.json(resp.data, {status: resp.status})
}

export async function POST(req: Request, props: { params: Promise<{ id: string, itemId: string }> }) {
  const params = await props.params
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const data = {
    ...(await req.json()),
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