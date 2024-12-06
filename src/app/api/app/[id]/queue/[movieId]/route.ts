import {QueueEntry} from "@/common/api/Radarr/entities/QueueAPI"
import formatOutputFilePath from "@/lib/formatOutputFilePath"
import withApi, {NextRequestWithApi} from "@/lib/withApi"

async function deleteHandler(req: NextRequestWithApi, { params }: { params: { id: string, itemId: string } }) {
  const {itemId} = await params
  const resp = await req.api.queue.delete(Number(itemId))

  return Response.json(resp.data, {status: resp.status})
}

async function getHandler(req: NextRequestWithApi, { params }: { params: { id: string, movieId: string } }) {
  const {movieId} = await params
  const resp = await req.api.queue.details(movieId)

  return Response.json(resp.data.map((record: QueueEntry) => ({
    ...record,
    mergerrOutputFile: formatOutputFilePath(record)
  })), {status: resp.status})
}

export const DELETE = withApi(deleteHandler)
export const GET = withApi(getHandler)