import {ApiEndpoints} from "@/consts"
import {prisma} from "@/lib/prisma"
import {NextRequest} from "next/server"
import qs from "qs"
import {AppType} from "@/consts"
import fs from "fs"

export async function DELETE(req: NextRequest, {params}: { params: { id: string, fileId: string } }) {
  const app = await prisma.app.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!app) {
    return Response.json({message: 'App not found'}, {status: 404})
  }

  const force = req.nextUrl.searchParams.get('force')

  const apiEndPoint = ApiEndpoints[app.type as AppType].mediaFile
  const apiEndPointParams = qs.stringify({
    ...apiEndPoint.params,
    apiKey: app.api_key,
  })

  if (force === 'true') {
    const fileReq = await fetch(`${app.url}${apiEndPoint.uri}/${params.fileId}?${apiEndPointParams}`, { cache: "no-cache" } )
    const data = await fileReq.json()
    fs.rmSync(data.path, {force: true})
    return Response.json({
      info: data,
      success: true,
    }, {status: fileReq.status})
  }

  const deleteFileReq = await fetch(`${app.url}${apiEndPoint.uri}/${params.fileId}?${apiEndPointParams}`, { cache: "no-cache", method: 'DELETE' } )
  return Response.json(await deleteFileReq.json(), {status: deleteFileReq.status})
}