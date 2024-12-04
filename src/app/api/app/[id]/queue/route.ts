import withApi, {NextRequestWithApi} from "@/lib/withApi"

async function getHandler(req: NextRequestWithApi) {
  const resp = await req.api.queue.getAll()
  resp.data.records = resp.data.records.filter(record => req.api.queue.isCompleted(record))

  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)