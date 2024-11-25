import formatOutputFilePath from "@/lib/formatOutputFilePath"
import withApi, {NextApiRequestWithApi} from "@/lib/withApi"

async function deleteHandler(req: NextApiRequestWithApi, { params }: { params: { id: string, itemId: string } }) {
  const resp = await req.api.queue.delete(Number(params.itemId))

  return Response.json(resp.data, {status: resp.status})
}

export async function getHandler(req: NextApiRequestWithApi, { params }: { params: { id: string, itemId: string } }) {
  const resp = await req.api.queue.get(Number(params.itemId))
  const record = resp.data
  if (record.movieId) {
    record.movie = await req.api.movie.get(record.movieId)
  }

  return Response.json({
    ...record,
    mergerrOutputFile: formatOutputFilePath(record)
  }, {status: resp.status})
}

export const GET = withApi(deleteHandler)
export const DELETE = withApi(getHandler)