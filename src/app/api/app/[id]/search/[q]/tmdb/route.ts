import withApi, {NextRequestWithApi} from "@/lib/withApi"

const getHandler = async (req: NextRequestWithApi, {params}: {params: {id: string, q: string}}) => {
  const resp = await req.api.tmdbSearch(params.q)
  return Response.json(resp.data, {status: resp.status})
}

export const GET = withApi(getHandler)